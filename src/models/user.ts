import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'Admin' | 'Staff';
export type UserStatus = 'Active' | 'Inactive';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true,
    },
    password: { type: String, select: false }, // Don't return password by default
    role: { 
      type: String, 
      enum: ['Admin', 'Staff'], 
      default: 'Staff', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Active', 'Inactive'], 
      default: 'Active', 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

// Note: email already has unique:true which implicitly creates an index.
// No need for UserSchema.index({ email: 1 }) here.


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
