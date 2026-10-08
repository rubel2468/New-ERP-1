'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/libs/db';
import DocumentModel from '@/models/document';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

export type UploadState = {
  success: boolean;
  message: string;
  document?: any;
};

/**
 * Server Action to upload a document to AWS S3 and save metadata to MongoDB.
 * User ID is retrieved securely from the server session, not from the client.
 */
export async function uploadDocument(
  prevState: any,
  formData: FormData
): Promise<UploadState> {
  try {
    // Get authenticated user from session (secure - not from client)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, message: 'Unauthorized: Please log in.' };
    }
    const userId = (session.user as any).id;

    await connectToDatabase();

    const file           = formData.get('file') as File | null;
    const tagsString     = formData.get('tags') as string | null;
    const referenceModel = formData.get('referenceModel') as 'Product' | 'Transaction' | 'Contact' | null;
    const referenceId    = formData.get('referenceId') as string | null;

    if (!file) {
      return { success: false, message: 'No file provided.' };
    }

    // Validate reference if provided
    if (referenceId && !mongoose.Types.ObjectId.isValid(referenceId)) {
      return { success: false, message: 'Invalid Reference ID.' };
    }

    // Convert file to buffer for uploading
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique file key
    const uniqueId      = crypto.randomUUID();
    const fileExtension = file.name.split('.').pop();
    const s3Key         = `documents/${uniqueId}-${Date.now()}.${fileExtension}`;

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket:      BUCKET_NAME,
      Key:         s3Key,
      Body:        buffer,
      ContentType: file.type,
    }));

    // Construct File URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
    const tags    = tagsString ? tagsString.split(',').map((t) => t.trim()).filter(Boolean) : [];

    // Save to Database
    const newDoc = await DocumentModel.create({
      fileName:       file.name,
      fileUrl,
      fileKey:        s3Key,
      fileType:       file.type,
      fileSize:       file.size,
      tags,
      referenceModel: referenceModel || undefined,
      referenceId:    referenceId ? new mongoose.Types.ObjectId(referenceId) : undefined,
      uploadedBy:     new mongoose.Types.ObjectId(userId),
    });

    // Revalidate paths if linking to a resource
    if (referenceModel && referenceId) {
      revalidatePath(`/${referenceModel.toLowerCase()}s/${referenceId}`);
    }
    revalidatePath('/documents');

    return {
      success:  true,
      message:  'File uploaded and linked successfully!',
      document: JSON.parse(JSON.stringify(newDoc)),
    };
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload document.',
    };
  }
}
