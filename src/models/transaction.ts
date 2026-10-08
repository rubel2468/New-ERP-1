import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'Sale' | 'Purchase';
export type TransactionStatus = 'Pending' | 'Paid' | 'Cancelled';

export interface ITransactionItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ITransaction extends Document {
  invoiceNumber: string;
  type: TransactionType;
  contact: mongoose.Types.ObjectId;
  items: ITransactionItem[];
  subTotal: number;
  tax: number;
  total: number;
  status: TransactionStatus;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionItemSchema = new Schema<ITransactionItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    invoiceNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      index: true 
    },
    type: { 
      type: String, 
      enum: ['Sale', 'Purchase'], 
      required: true,
      index: true 
    },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact', required: true, index: true },
    items: [TransactionItemSchema],
    subTotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Cancelled'], 
      default: 'Pending', 
      required: true 
    },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
TransactionSchema.index({ invoiceNumber: 'text', notes: 'text' });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
