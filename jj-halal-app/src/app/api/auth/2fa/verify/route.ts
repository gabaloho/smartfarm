import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTOTP } from "@/lib/totp";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  const token = String(body?.token ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, twoFactorSecret: true },
  });

  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "2FA setup not initialized" }, { status: 400 });
  }

  const isValid = verifyTOTP(user.twoFactorSecret, token);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({ ok: true });
}
