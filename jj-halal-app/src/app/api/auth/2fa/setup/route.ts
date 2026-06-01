import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRCode, generateTOTPSecret } from "@/lib/totp";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { secret, otpauthUrl } = generateTOTPSecret(session.user.email);
  const qrCode = await generateQRCode(otpauthUrl);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    },
  });

  return NextResponse.json({
    secret,
    otpauthUrl,
    qrCode,
  });
}
