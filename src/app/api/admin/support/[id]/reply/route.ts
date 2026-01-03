import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
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

        // Send email notification to user if requested
        let emailResult = { success: true, error: null };
        if (shouldSendEmail) {
            const result = await sendEmail({
                to: ticket.email,
                subject: `Re: ${ticket.subject} [Ticket #${ticket.ticketId}]`,
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Reply to your Ticket</h2>
                    <p>Hello ${ticket.name},</p>
                    <p>You have received a new reply to your support ticket <strong>#${ticket.ticketId}</strong>.</p>
                    <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p>Best regards,<br>TeamMistake Support</p>
                </div>
            `,
            });
            // @ts-ignore
            emailResult = result;
        }

        return NextResponse.json({ ticket, emailResult }, { status: 200 });
    } catch (error) {
        console.error('Error adding admin reply:', error);
        return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
}
