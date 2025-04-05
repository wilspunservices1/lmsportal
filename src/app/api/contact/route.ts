// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/emial/emailService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // ✅ Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Send email to training@meqmp.com
    await sendEmail({
      to: process.env.INSTRUCTOR_EMAIL_RECEIVER!,
      subject: `Contact Form – ${subject}`,
      text: `
You have received a new message from the Contact Us form.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    return NextResponse.json(
      { message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Error sending contact message.", error: error.message },
      { status: 500 }
    );
  }
}