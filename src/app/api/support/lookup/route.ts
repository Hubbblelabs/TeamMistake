import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const ticketId = searchParams.get('ticketId');
        const email = searchParams.get('email');

        if (!ticketId || !email) {
            return NextResponse.json(
                { error: 'Ticket ID and email are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Look up by ticketId field (not _id)
        const ticket = await SupportTicket.findOne({
            ticketId: ticketId.toUpperCase(),
            email: email.toLowerCase()
        });

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found. Please check your ticket ID and email.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ ticket }, { status: 200 });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ticket' },
            { status: 500 }
        );
    }
}
