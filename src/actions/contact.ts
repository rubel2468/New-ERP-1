'use server';

import { connectToDatabase } from '@/libs/db';
import Contact from '@/models/contact';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { createContactSchema } from '@/libs/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized: Please log in to perform this action.');
  }
  return (session.user as any).id;
}

export async function createContact(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validated = createContactSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    customerType: formData.get('customerType') || undefined,
    email: formData.get('email') || undefined,
    phone: formData.get('phone'),
    companyName: formData.get('companyName'),
    balance: parseFloat(formData.get('balance') as string) || 0,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0];
    throw new Error(firstError?.message || 'Invalid input');
  }

  await connectToDatabase();

  const { name, type, customerType, email, phone, companyName, balance } = validated.data;

  await Contact.create({
    name,
    type,
    customerType: type === 'Customer' ? customerType : undefined,
    email: email || undefined,
    phone: phone || undefined,
    companyName: companyName || undefined,
    balance,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  revalidatePath('/contacts');
  redirect('/contacts');
}

export async function deleteContact(contactId: string): Promise<{ success: boolean; message: string }> {
  try {
    await getAuthenticatedUserId();

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return { success: false, message: 'Invalid contact ID.' };
    }

    await connectToDatabase();

    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return { success: false, message: 'Contact not found.' };
    }

    revalidatePath('/contacts');
    revalidatePath('/dashboard');
    return { success: true, message: `"${contact.name}" has been removed.` };
  } catch (error: any) {
    console.error('Delete Contact Error:', error);
    return { success: false, message: error.message || 'Failed to delete contact.' };
  }
}