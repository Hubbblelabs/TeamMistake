import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function POST(request: NextRequest) {
    try {
        const { ticketId, email, message } = await request.json();

        if (!ticketId || !email || !message) {
            return NextResponse.json(
                { error: 'Ticket ID, email, and message are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Verify the ticket belongs to this email using ticketId field
        const ticket = await SupportTicket.findOne({
            ticketId: ticketId.toUpperCase(),
            email: email.toLowerCase()
        });

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found or access denied' },
                { status: 404 }
            );
        }

        if (ticket.status === 'closed') {
            return NextResponse.json(
                { error: 'Cannot reply to a closed ticket' },
                { status: 400 }
            );
        }

        // Add the reply
        const reply = {
            message,
            sentAt: new Date(),
            sentBy: 'user',
            isFromUser: true,
        };

        ticket.replies = ticket.replies || [];
        ticket.replies.push(reply);

        // If ticket is new, change to open
        if (ticket.status === 'new') {
            ticket.status = 'open';
        }

        await ticket.save();

        return NextResponse.json({ ticket }, { status: 200 });
    } catch (error) {
        console.error('Error adding reply:', error);
        return NextResponse.json(
            { error: 'Failed to send reply' },
            { status: 500 }
        );
    }
}
