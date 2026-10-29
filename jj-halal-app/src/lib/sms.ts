import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_PHONE_NUMBER ?? "";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Gue Smart Farms Limited";

export async function sendPhoneVerificationSMS(phone: string, otp: string) {
  await client.messages.create({
    body: `[${APP_NAME}] Your verification code is: ${otp}. Valid for 10 minutes.`,
    from: FROM,
    to: phone,
  });
}

export async function sendOrderStatusSMS(phone: string, orderNumber: string, status: string) {
  await client.messages.create({
    body: `[${APP_NAME}] Order #${orderNumber} status updated to: ${status}.`,
    from: FROM,
    to: phone,
  });
}
