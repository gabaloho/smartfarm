import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@jjhalalfarms.com";
const CONTACT_TO = process.env.CONTACT_RECEIVER_EMAIL ?? "info@jjhalalfarms.com";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Messaging service is not configured yet. Please call or email support directly." },
      { status: 503 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_TO,
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
