import mongoose, { Schema, Document, Model } from 'mongoose';

export type ContactType = 'Customer' | 'Supplier';

export interface IContact extends Document {
  name: string;
  type: ContactType;
  customerType?: 'Cash' | 'Credit'; // added for 2 types of customers
  email?: string;
  phone?: string;
  companyName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  balance: number; // Positive means they owe us, negative means we owe them
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['Customer', 'Supplier'], 
      required: true,
      index: true 
    },
    customerType: {
      type: String,
      enum: ['Cash', 'Credit'],
    },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    companyName: { type: String, trim: true, index: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    balance: { type: Number, required: true, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
ContactSchema.index({ name: 'text', companyName: 'text', email: 'text' });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
