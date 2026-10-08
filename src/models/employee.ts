import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  designation: string;
  phone?: string;
  basicSalary: number;
  status: 'Active' | 'Inactive';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    basicSalary: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

EmployeeSchema.index({ name: 'text', designation: 'text' });

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
