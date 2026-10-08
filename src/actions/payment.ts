'use server';

import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Contact from '@/models/contact';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

export async function receivePayment(contactId: string, paymentMethod: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return { success: false, message: 'Invalid customer ID.' };
    }

    await connectToDatabase();

    // Find contact
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return { success: false, message: 'Customer not found.' };
    }

    // Update all pending transactions for this customer to Paid
    const updateResult = await Transaction.updateMany(
      { contact: contactId, status: 'Pending' },
      { 
        $set: { status: 'Paid' } 
      }
    );

    // Set contact balance to 0 (assuming full payment)
    contact.balance = 0;
    await contact.save();

    revalidatePath('/sales');
    revalidatePath('/contacts');
    revalidatePath('/dashboard');
    revalidatePath('/payments');

    return { 
      success: true, 
      message: `Payment recorded successfully via ${paymentMethod}. ${updateResult.modifiedCount} invoice(s) marked as paid.` 
    };
  } catch (error: any) {
    console.error('Receive Payment Error:', error);
    return { success: false, message: error.message || 'Failed to record payment.' };
  }
}
