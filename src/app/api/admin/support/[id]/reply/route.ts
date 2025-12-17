import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { authOptions } from '@/lib/auth';

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
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        await connectDB();

        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Add admin reply
        const reply = {
            message,
            sentAt: new Date(),
            sentBy: session.user?.email || 'admin',
            isFromUser: false,
        };

        ticket.replies = ticket.replies || [];
        ticket.replies.push(reply);

        // Set ticket to open if it was new
        if (ticket.status === 'new') {
            ticket.status = 'open';
        }

        await ticket.save();

        return NextResponse.json({ ticket }, { status: 200 });
    } catch (error) {
        console.error('Error adding admin reply:', error);
        return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
}
