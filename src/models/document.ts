import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument extends Document {
  fileName: string;
  fileUrl: string;
  fileKey: string; // S3 object key or Cloudinary public_id
  fileType: string; // MIME type
  fileSize: number; // in bytes
  tags: string[];
  referenceModel?: 'Product' | 'Transaction' | 'Contact';
  referenceId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema<IDocument> = new Schema(
  {
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileKey: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true, min: 0 },
    tags: [{ type: String, trim: true, index: true }],
    referenceModel: { 
      type: String, 
      enum: ['Product', 'Transaction', 'Contact'],
      index: true 
    },
    referenceId: { 
      type: Schema.Types.ObjectId, 
      refPath: 'referenceModel',
      index: true 
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
DocumentSchema.index({ fileName: 'text', tags: 'text' });

const DocumentModel: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
