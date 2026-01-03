import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { message, sendEmail: shouldSendEmail } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectDB();

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Add admin reply
    const reply = {
      message,
      sentAt: new Date(),
      sentBy: session.user?.email || 'admin',
      isFromUser: false,
    };

    contact.replies = contact.replies || [];
    contact.replies.push(reply);

    // Update status if needed
    if (contact.status !== 'replied') {
      contact.status = 'replied';
    }

    await contact.save();

    // Send email notification to user if requested
    let emailResult = { success: true, error: null };
    if (shouldSendEmail) {
      const result = await sendEmail({
        to: contact.email,
        subject: `Re: Your Inquiry to TeamMistake`,
        html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Response to your Inquiry</h2>
                    <p>Hello ${contact.name},</p>
                    <p>Thank you for contacting TeamMistake. We have a response to your message.</p>
                    <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p>Best regards,<br>TeamMistake Team</p>
                </div>
            `,
      });
      // @ts-ignore
      emailResult = result;
    }

    return NextResponse.json({ contact, emailResult }, { status: 200 });
  } catch (error) {
    console.error('Error adding contact reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
