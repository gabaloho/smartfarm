import { Resend } from "resend";
import nodemailer from "nodemailer";

const FROM = process.env.EMAIL_FROM;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Gue Smart Farms Limited";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";

let smtpTransporter: nodemailer.Transporter | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }
  return new Resend(apiKey);
}

function hasSmtpConfig() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function getSmtpTransporter() {
  if (!hasSmtpConfig()) {
    throw new Error("Missing SMTP config (SMTP_HOST, SMTP_USER, SMTP_PASS)");
  }

  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number.isFinite(SMTP_PORT) ? SMTP_PORT : 587,
      secure: SMTP_SECURE,
      requireTLS: !SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return smtpTransporter;
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput) {
  if (!FROM) {
    throw new Error("Missing EMAIL_FROM environment variable");
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
    });
    return;
  }

  if (hasSmtpConfig()) {
    const smtp = getSmtpTransporter();
    await smtp.sendMail({
      from: FROM,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
    });
    return;
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_* variables.");
}

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const link = `${APP_URL}/auth/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#176f36">Welcome to ${APP_NAME}</h2>
        <p>Hi ${name}, please verify your email address by clicking the button below.</p>
        <a href="${link}" style="display:inline-block;background:#176f36;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Verify Email</a>
        <p style="color:#6b7280;font-size:14px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: `Reset your password — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#176f36">${APP_NAME}</h2>
        <p>Hi ${name}, click below to reset your password.</p>
        <a href="${link}" style="display:inline-block;background:#176f36;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Reset Password</a>
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
  await sendEmail({
    to: email,
    subject: `Order confirmed #${orderNumber} — ${APP_NAME}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#176f36">Order Confirmed!</h2>
        <p>Hi ${name}, your order <strong>#${orderNumber}</strong> has been received.</p>
        <p>Total: <strong>₦${total.toLocaleString()}</strong></p>
        <a href="${APP_URL}/orders" style="display:inline-block;background:#176f36;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">View Order</a>
      </div>
    `,
  });
}
