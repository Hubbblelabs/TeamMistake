import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const tickets = await SupportTicket.find({
            email: email.toLowerCase()
        }).sort({ createdAt: -1 });

        if (!tickets || tickets.length === 0) {
            return NextResponse.json(
                { error: 'No tickets found for this email.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ticket' },
            { status: 500 }
        );
    }
}
