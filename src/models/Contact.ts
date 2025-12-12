import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReply {
  message: string;
  sentAt: Date;
  sentBy: string;
  isFromUser?: boolean; // true if user replied, false if admin sent
}

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  replies: IReply[];
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
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContact> = 
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
