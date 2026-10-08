import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockLevel: number;
  lowStockLimit: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      uppercase: true,
      index: true 
    },
    barcode: { type: String, trim: true, index: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stockLevel: { type: Number, required: true, default: 0, min: 0 },
    lowStockLimit: { type: Number, required: true, default: 5, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Search indexes
ProductSchema.index({ name: 'text', sku: 'text', category: 'text', description: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
