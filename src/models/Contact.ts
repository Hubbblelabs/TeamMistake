import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReply {
  message: string;
  sentAt: Date;
  sentBy: string;
  emailId?: string; // Resend email ID for tracking
  isFromUser?: boolean; // true if user replied, false if admin sent
}

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  replies: IReply[];
  emailThreadId?: string; // To track email thread
  lastEmailId?: string; // Last email sent in this conversation
}

const ReplySchema = new Schema<IReply>({
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  sentBy: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: false,
  },
  isFromUser: {
    type: Boolean,
    default: false,
  },
});

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    replies: [ReplySchema],
    emailThreadId: {
      type: String,
      required: false,
    },
    lastEmailId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContact> = 
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
