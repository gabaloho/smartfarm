import speakeasy from "speakeasy";
import QRCode from "qrcode";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "GONAA FARMS";

export function generateTOTPSecret(userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: `${APP_NAME} (${userEmail})`,
    length: 32,
  });
  return { secret: secret.base32, otpauthUrl: secret.otpauth_url ?? "" };
}

export async function generateQRCode(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTOTP(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // allow 30 second window drift
  });
}

export function generateOTP(digits = 6): string {
  return Array.from({ length: digits }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
}
