import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { InstitutionType, VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
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
      accountType: data.accountType,
      institution:
        data.accountType === "INSTITUTIONAL"
          ? {
              create: {
                name: data.institutionName ?? "Institution",
                type: data.institutionType ?? InstitutionType.OTHER,
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

  return NextResponse.json({
    ok: true,
    message: "Account created. Check your email for verification link.",
    verificationToken: process.env.NODE_ENV !== "production" ? token : undefined,
  });
}
