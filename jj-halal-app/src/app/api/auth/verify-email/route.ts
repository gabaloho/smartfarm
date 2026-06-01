import { NextRequest, NextResponse } from "next/server";
import { VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  const token = String(body?.token ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token },
    select: {
      id: true,
      userId: true,
      purpose: true,
      usedAt: true,
      expiresAt: true,
    },
  });

  if (!verification || verification.purpose !== VerificationPurpose.EMAIL_VERIFICATION) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  if (verification.usedAt) {
    return NextResponse.json({ error: "Token already used" }, { status: 400 });
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true, message: "Email verified successfully" });
}
