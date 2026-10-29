import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

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

  if (!verification || verification.purpose !== VerificationPurpose.PASSWORD_RESET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  if (verification.usedAt) {
    return NextResponse.json({ error: "Token already used" }, { status: 400 });
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verification.userId },
      data: { passwordHash },
    }),
    prisma.verificationToken.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.deleteMany({
      where: { userId: verification.userId },
    }),
  ]);

  return NextResponse.json({ ok: true, message: "Password reset successful" });
}
