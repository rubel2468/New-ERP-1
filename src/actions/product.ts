'use server';

import { connectToDatabase } from '@/libs/db';
import Product from '@/models/product';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { createProductSchema } from '@/libs/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized: Please log in to perform this action.');
  }
  return (session.user as any).id;
}

export async function createProduct(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validated = createProductSchema.safeParse({
    name: formData.get('name'),
    sku: formData.get('sku'),
    barcode: formData.get('barcode'),
    category: formData.get('category'),
    description: formData.get('description'),
    purchasePrice: parseFloat(formData.get('purchasePrice') as string),
    sellingPrice: parseFloat(formData.get('sellingPrice') as string),
    stockLevel: parseInt(formData.get('stockLevel') as string) || 0,
    lowStockLimit: parseInt(formData.get('lowStockLimit') as string) || 5,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0];
    throw new Error(firstError?.message || 'Invalid input');
  }

  await connectToDatabase();

  const { name, sku, barcode, category, description, purchasePrice, sellingPrice, stockLevel, lowStockLimit } = validated.data;

  await Product.create({
    name,
    sku,
    barcode: barcode || undefined,
    category,
    description: description || undefined,
    purchasePrice,
    sellingPrice,
    stockLevel: stockLevel || 0,
    lowStockLimit: lowStockLimit || 5,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  revalidatePath('/inventory');
  redirect('/inventory');
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    await getAuthenticatedUserId();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return { success: false, message: 'Invalid product ID.' };
    }

    await connectToDatabase();

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { success: true, message: `"${product.name}" has been deleted.` };
  } catch (error: any) {
    console.error('Delete Product Error:', error);
    return { success: false, message: error.message || 'Failed to delete product.' };
  }
}

export async function updateProductStock(
  productId: string,
  newStockLevel: number
): Promise<{ success: boolean; message: string }> {
  try {
    await getAuthenticatedUserId();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return { success: false, message: 'Invalid product ID.' };
    }
    if (newStockLevel < 0) {
      return { success: false, message: 'Stock level cannot be negative.' };
    }

    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(
      productId,
      { stockLevel: newStockLevel },
      { new: true }
    );

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    revalidatePath('/inventory');
    revalidatePath('/dashboard');
    return { success: true, message: `Stock updated to ${newStockLevel} units.` };
  } catch (error: any) {
    console.error('Update Stock Error:', error);
    return { success: false, message: error.message || 'Failed to update stock.' };
  }
}