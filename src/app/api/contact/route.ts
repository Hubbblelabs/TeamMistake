import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const resendFrom = process.env.RESEND_FROM;

    if (!adminEmail) {
      console.error('ADMIN_EMAIL is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!resendFrom) {
      console.error('RESEND_FROM is not defined');
      return NextResponse.json(
        { error: 'Server configuration error (missing from address)' },
        { status: 500 }
      );
    }

    // Send email to admin
    await resend.emails.send({
      from: resendFrom,
      to: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: resendFrom,
      to: email,
      subject: 'We received your message!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thanks for reaching out to Team Mistake. We've received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>Team Mistake</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
