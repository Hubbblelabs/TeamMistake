import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, subject, message } = await req.json();

        const ticket = await SupportTicket.create({
            name,
            email,
            subject,
            message,
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
