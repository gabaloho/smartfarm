import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { InstitutionType, UserRole, VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";
import { getRequestIp, limitRequest } from "@/lib/rate-limit";
import { enqueueKycReview } from "@/lib/kyc-queue";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function createUniqueVendorSlug(brandName: string) {
  const base = toSlug(brandName) || `seller-${Date.now()}`;

  const existing = await prisma.vendor.findMany({
    where: {
      OR: [{ slug: base }, { slug: { startsWith: `${base}-` } }],
    },
    select: { slug: true },
  });

  const existingSlugs = new Set(existing.map((entry) => entry.slug));
  if (!existingSlugs.has(base)) return base;

  let suffix = 2;
  while (existingSlugs.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req.headers);
  const throttle = limitRequest({ key: `register:${ip}`, limit: 10, windowMs: 60_000 });
  if (!throttle.ok) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again shortly." },
      {
        status: 429,
        headers: throttle.retryAfterSeconds ? { "Retry-After": String(throttle.retryAfterSeconds) } : undefined,
      }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const normalizedEmail = data.email.toLowerCase();
  const normalizedPhone = data.phone?.trim() ? data.phone.trim() : null;
  const normalizedBusinessName = data.businessName?.trim()
    ? data.businessName.trim()
    : data.institutionName?.trim()
      ? data.institutionName.trim()
      : null;
  const normalizedBusinessType = data.businessType ?? data.institutionType ?? InstitutionType.OTHER;
  const normalizedBrandName = data.brandName?.trim() ? data.brandName.trim() : null;
  const normalizedSellerCategory = data.sellerCategory?.trim() ? data.sellerCategory.trim() : null;
  const normalizedCacNumber = data.cacNumber?.trim() ? data.cacNumber.trim() : null;
  const normalizedSellerAddress = data.sellerAddress?.trim() ? data.sellerAddress.trim() : null;
  const normalizedSellerBio = data.sellerBio?.trim() ? data.sellerBio.trim() : null;

  let vendorSlug: string | null = null;
  if (data.role === UserRole.VENDOR) {
    vendorSlug = await createUniqueVendorSlug(
      normalizedBrandName ?? `${data.name} Store`
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Email or phone is already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: data.role,
      accountType: data.accountType,
      institution:
        data.accountType === "INSTITUTIONAL"
          ? {
              create: {
                name: normalizedBusinessName ?? "Business",
                type: normalizedBusinessType,
                registrationNo: normalizedCacNumber,
              },
            }
          : undefined,
      vendor:
        data.role === UserRole.VENDOR
          ? {
              create: {
                shopName: normalizedBrandName ?? `${data.name} Store`,
                slug: vendorSlug ?? `seller-${Date.now()}`,
                sellerCategory: normalizedSellerCategory,
                cacNumber: normalizedCacNumber,
                contactAddress: normalizedSellerAddress,
                description: normalizedSellerBio,
              },
            }
          : undefined,
      verifications: {
        create: {
          token,
          purpose: VerificationPurpose.EMAIL_VERIFICATION,
          expiresAt,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (user.email) {
    try {
      await sendVerificationEmail(user.email, token, user.name);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  }

  if (data.accountType === "INSTITUTIONAL") {
    try {
      await enqueueKycReview({
        userId: user.id,
        accountType: data.accountType,
        businessName: normalizedBusinessName,
        businessType: normalizedBusinessType,
        cacNumber: normalizedCacNumber,
      });
    } catch (error) {
      console.error("Failed to enqueue KYC review:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      data.role === UserRole.VENDOR
        ? "Seller account created. Check your email for verification link."
        : "Buyer account created. Check your email for verification link.",
    verificationToken: process.env.NODE_ENV !== "production" ? token : undefined,
  });
}
