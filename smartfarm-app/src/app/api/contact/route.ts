import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { getRequestIp, limitRequest } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const contactTo = process.env.CONTACT_RECEIVER_EMAIL;
  if (!contactTo) {
    console.error("Missing CONTACT_RECEIVER_EMAIL environment variable");
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 503 }
    );
  }

  const ip = getRequestIp(req.headers);
  const throttle = limitRequest({ key: `contact:${ip}`, limit: 8, windowMs: 60_000 });
  if (!throttle.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: throttle.retryAfterSeconds ? { "Retry-After": String(throttle.retryAfterSeconds) } : undefined,
      }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendEmail({
      to: contactTo,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#176f36">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send contact message:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again shortly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Message sent successfully. We will get back to you soon." });
}
