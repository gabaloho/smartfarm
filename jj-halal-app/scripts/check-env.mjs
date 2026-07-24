#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;

    const key = line.slice(0, eq).trim();
    if (!key || process.env[key]) continue;

    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APP_NAME",
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "AUTH_URL",
  "EMAIL_FROM",
  "CONTACT_RECEIVER_EMAIL",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
  "PAYSTACK_SECRET_KEY",
  "PAYSTACK_CALLBACK_URL",
  "PAYSTACK_WEBHOOK_URL",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_WEBHOOK_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const smtpRequired = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];

const placeholderPatterns = [/REPLACE/i, /^sk_test_REPLACE$/i, /^pk_test_REPLACE$/i, /^whsec_REPLACE$/i];
const strict = process.env.ENV_CHECK_STRICT === "1";

const missing = [];
const placeholders = [];

for (const key of required) {
  const value = process.env[key];
  if (!value || !value.trim()) {
    missing.push(key);
    continue;
  }

  if (placeholderPatterns.some((pattern) => pattern.test(value.trim()))) {
    placeholders.push(key);
  }
}

const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
const smtpMissing = smtpRequired.filter((key) => !process.env[key]?.trim());
const hasSmtp = smtpMissing.length === 0;

if (!hasResend && !hasSmtp) {
  missing.push("EMAIL_PROVIDER: set RESEND_API_KEY or SMTP_HOST+SMTP_USER+SMTP_PASS");
}

if (missing.length === 0 && placeholders.length === 0) {
  console.log("Env check passed. All required variables are present and non-placeholder.");
  process.exit(0);
}

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
}

if (placeholders.length > 0) {
  const label = strict ? "Invalid placeholder values detected:" : "Placeholder values detected (warning):";
  const writer = strict ? console.error : console.warn;
  writer(label);
  for (const key of placeholders) {
    writer(`- ${key}`);
  }
}

if (missing.length > 0 || (strict && placeholders.length > 0)) {
  process.exit(1);
}

process.exit(0);
