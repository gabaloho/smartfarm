import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "noreply@jjhalalfarms.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "JJ HALAL FARMS LTD.";

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const link = `${APP_URL}/auth/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#15803d">Welcome to ${APP_NAME}</h2>
        <p>Hi ${name}, please verify your email address by clicking the button below.</p>
        <a href="${link}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Verify Email</a>
        <p style="color:#6b7280;font-size:14px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset your password — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#15803d">${APP_NAME}</h2>
        <p>Hi ${name}, click below to reset your password.</p>
        <a href="${link}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Reset Password</a>
        <p style="color:#6b7280;font-size:14px">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderNumber: string,
  total: number
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order confirmed #${orderNumber} — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#15803d">Order Confirmed!</h2>
        <p>Hi ${name}, your order <strong>#${orderNumber}</strong> has been received.</p>
        <p>Total: <strong>₦${total.toLocaleString()}</strong></p>
        <a href="${APP_URL}/orders" style="display:inline-block;background:#15803d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">View Order</a>
      </div>
    `,
  });
}
