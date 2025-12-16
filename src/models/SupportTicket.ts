import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: String, required: true }, // 'admin' or 'user'
    isFromUser: { type: Boolean, default: false },
});

const supportTicketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'open', 'closed'],
        default: 'new',
    },
    createdAt: { type: Date, default: Date.now },
    replies: [replySchema],
});

export default mongoose.models.SupportTicket ||
    mongoose.model('SupportTicket', supportTicketSchema);
