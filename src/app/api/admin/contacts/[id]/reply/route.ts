import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    await connectDB();

    const contact = await Contact.findById(id);

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
      isFromUser: false,
    });
    contact.status = 'replied';
    await contact.save();

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
