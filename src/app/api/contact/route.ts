import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function OPTIONS(req: Request) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database and save contact
    await connectDB();
    const contact = await Contact.create({
      name,
      email,
      message,
      status: 'new',
      replies: [],
    });

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
        <br/>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/dashboard">View in Dashboard</a></p>
      `,
      headers: {
        'X-Contact-ID': contact._id.toString(),
      },
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: resendFrom,
      to: email,
      subject: 'We received your message!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thanks for reaching out to Team Mistake. We've received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>Team Mistake</p>
      `,
      headers: {
        'X-Contact-ID': contact._id.toString(),
      },
    });

    // Store the email ID for tracking
    contact.lastEmailId = userEmailResponse.data?.id;
    await contact.save();

    return NextResponse.json({ 
      success: true,
      contactId: contact._id 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
