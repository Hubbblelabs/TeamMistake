import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Resend } from 'resend';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await Contact.findById(params.id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Add reply to contact
    contact.replies.push({
      message,
      sentAt: new Date(),
      sentBy: session.user.name || session.user.email || 'Admin',
    });
    contact.status = 'replied';
    await contact.save();

    // Send email to user
    const resendFrom = process.env.RESEND_FROM;

    if (!resendFrom) {
      console.error('RESEND_FROM is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: resendFrom,
      to: contact.email,
      subject: 'Re: Your message to Team Mistake',
      html: `
        <h2>Hi ${contact.name},</h2>
        <p>Thanks for reaching out! Here's our response:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p>${message}</p>
        </div>
        <p>If you have any additional questions, feel free to reply to this email.</p>
        <p>Best regards,</p>
        <p>Team Mistake</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">
          <strong>Your original message:</strong><br/>
          ${contact.message}
        </p>
      `,
    });

    return NextResponse.json({ 
      success: true,
      contact 
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
