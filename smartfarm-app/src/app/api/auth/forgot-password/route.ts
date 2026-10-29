import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_RESPONSE = {
  ok: true,
  message: "If this email exists, a password reset link has been sent.",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, isActive: true },
  });

  if (!user || !user.email || !user.isActive) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      purpose: VerificationPurpose.PASSWORD_RESET,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetEmail(user.email, token, user.name);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
