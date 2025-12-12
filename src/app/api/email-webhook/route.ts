import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new NextResponse('Please add RESEND_WEBHOOK_SECRET from Resend Dashboard to .env or .env.local', {
      status: 500,
    });
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400,
    });
  }

  // Handle the event
  const eventType = evt.type;
  console.log(`Received webhook with type: ${eventType}`);
  console.log('Webhook payload:', evt.data);

  try {
    // Handle email.replied event - when a user replies to our email
    if (eventType === 'email.replied') {
      await connectDB();
      
      const { from, to, subject, text, html, headers } = evt.data;
      
      // Try to find the contact by email
      let contact = null;
      
      // First try to find by X-Contact-ID header if available
      const contactId = headers?.['x-contact-id'];
      if (contactId) {
        contact = await Contact.findById(contactId);
      }
      
      // If not found, try to find by sender email
      if (!contact && from) {
        const senderEmail = typeof from === 'string' ? from : from.email || from.address;
        contact = await Contact.findOne({ 
          email: senderEmail 
        }).sort({ createdAt: -1 }); // Get most recent contact
      }
      
      if (contact) {
        // Extract the reply message (try to get text content)
        const replyMessage = text || html || 'No message content';
        
        // Add the user's reply to the contact
        contact.replies.push({
          message: replyMessage,
          sentAt: new Date(),
          sentBy: contact.name,
          isFromUser: true, // This is from the user
        });
        
        // Update status if it was just 'read'
        if (contact.status === 'read') {
          contact.status = 'replied';
        }
        
        await contact.save();
        
        console.log(`✅ User reply stored for contact: ${contact._id}`);
      } else {
        console.log('⚠️ Could not find matching contact for reply');
      }
    }
    
    // Handle other email events
    if (eventType === 'email.sent') {
      console.log('✅ Email sent successfully');
    }
    
    if (eventType === 'email.delivered') {
      console.log('✅ Email delivered successfully');
    }
    
    if (eventType === 'email.bounced') {
      console.log('❌ Email bounced');
      await connectDB();
      const { headers } = evt.data;
      const contactId = headers?.['x-contact-id'];
      
      if (contactId) {
        const contact = await Contact.findById(contactId);
        if (contact) {
          // You could add a 'bounced' status or flag here
          console.log(`Email bounced for contact: ${contact._id}`);
        }
      }
    }
    
    if (eventType === 'email.complained') {
      console.log('⚠️ Email marked as spam');
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Don't return error to Resend, so they don't retry
  }

  return new NextResponse('Webhook received', { status: 200 });
}
