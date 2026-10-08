'use server';

import { connectToDatabase } from '@/libs/db';
import Expense from '@/models/expense';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { createExpenseSchema } from '@/libs/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return (session.user as any).id;
}

export async function createExpense(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validated = createExpenseSchema.safeParse({
    title: formData.get('title'),
    payeeName: formData.get('payeeName'),
    category: formData.get('category'),
    amount: parseFloat(formData.get('amount') as string) || 0,
    notes: formData.get('notes') || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || 'Invalid input');
  }

  await connectToDatabase();

  await Expense.create({
    ...validated.data,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  revalidatePath('/expenses');
  revalidatePath('/cash-book');
  redirect('/expenses');
}
