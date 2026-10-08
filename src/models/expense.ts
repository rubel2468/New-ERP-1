import mongoose, { Schema, Document, Model } from 'mongoose';

export type ExpenseCategory = 
  | 'Local Conveyance' 
  | 'Loading/Unloading' 
  | 'Courier' 
  | 'Repair & Maintenance' 
  | 'Office Equipment' 
  | 'Other';

export interface IExpense extends Document {
  title: string;
  category: ExpenseCategory;
  payeeName: string;
  amount: number;
  expenseDate: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema<IExpense> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    payeeName: { type: String, required: true, trim: true },
    category: { 
      type: String, 
      required: true, 
      enum: [
        'Local Conveyance', 
        'Loading/Unloading', 
        'Courier', 
        'Repair & Maintenance', 
        'Office Equipment', 
        'Other'
      ] 
    },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
