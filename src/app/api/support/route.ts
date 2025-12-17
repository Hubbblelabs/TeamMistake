import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';

// Generate a short alphanumeric ticket ID (7 characters)
function generateTicketId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0/O, 1/I/L
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, subject, message } = await req.json();

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                status: 'active',
            });
        }

        // Generate unique ticket ID
        let ticketId = generateTicketId();
        let attempts = 0;
        while (await SupportTicket.findOne({ ticketId }) && attempts < 10) {
            ticketId = generateTicketId();
            attempts++;
        }

        // Create the support ticket with user reference
        const ticket = await SupportTicket.create({
            ticketId,
            name,
            email,
            subject,
            message,
            userId: user._id,
        });

        return NextResponse.json({ success: true, ticket }, { status: 201 });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create ticket' },
            { status: 500 }
        );
    }
}
