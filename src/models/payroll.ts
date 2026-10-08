import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  monthYear: string;
  basicSalary: number;
  overtime: number;
  bonus: number;
  totalPaid: number;
  paymentDate: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema<IPayroll> = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    monthYear: { type: String, required: true },
    basicSalary: { type: Number, required: true, min: 0 },
    overtime: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    totalPaid: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Payroll: Model<IPayroll> = mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);

export default Payroll;
