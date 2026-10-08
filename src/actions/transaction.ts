'use server';

import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Product from '@/models/product';
import Contact from '@/models/contact';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

export type CreateTransactionState = {
  success: boolean;
  message: string;
  transaction?: any;
  lowStockItems?: string[];
};

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized: Please log in to perform this action.');
  }
  return (session.user as any).id;
}

/**
 * Creates a Sale or Purchase Invoice, updates product inventory quantities,
 * and updates Contact ledger balance. Runs inside a Mongoose transaction to ensure atomicity.
 */
export async function createTransaction(
  prevState: any,
  data: {
    type: 'Sale' | 'Purchase';
    contactId: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
    taxPercent?: number;
    notes?: string;
  }
): Promise<CreateTransactionState> {
  const userId = await getAuthenticatedUserId();
  const dbConnection = await connectToDatabase();
  const session = await dbConnection.startSession();
  session.startTransaction();

  try {
    const { type, contactId, items, taxPercent = 0, notes } = data;

    // Validate inputs
    if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
      throw new Error('Invalid or missing contact ID');
    }
    if (!items || items.length === 0) {
      throw new Error('Transaction must contain at least one item');
    }

    // Retrieve Contact
    const contactObj = await Contact.findById(contactId).session(session);
    if (!contactObj) {
      throw new Error('Contact not found');
    }

    let subTotal = 0;
    const transactionItems = [];
    const lowStockItems: string[] = [];

    // Process each line item
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Invalid Product ID: ${item.productId}`);
      }

      const productObj = await Product.findById(item.productId).session(session);
      if (!productObj) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const qty = item.quantity;
      const unitPrice = item.unitPrice;
      const lineTotal = qty * unitPrice;
      subTotal += lineTotal;

      // Check and update stock levels based on transaction type
      if (type === 'Sale') {
        if (productObj.stockLevel < qty) {
          throw new Error(`Insufficient stock for "${productObj.name}". Available: ${productObj.stockLevel}, Requested: ${qty}`);
        }
        productObj.stockLevel -= qty;

        // Trigger low stock alert check
        if (productObj.stockLevel <= productObj.lowStockLimit) {
          lowStockItems.push(`${productObj.name} (SKU: ${productObj.sku}) is running low. Current: ${productObj.stockLevel}`);
        }
      } else if (type === 'Purchase') {
        productObj.stockLevel += qty;
      }

      await productObj.save({ session });

      transactionItems.push({
        product: new mongoose.Types.ObjectId(item.productId),
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    const taxAmount = (subTotal * taxPercent) / 100;
    const grandTotal = subTotal + taxAmount;

    // Generate Invoice Number (e.g. INV-20260819-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `${type === 'Sale' ? 'INV' : 'PO'}-${dateStr}-${randomSuffix}`;

    // Create the transaction document
    const newTransaction = new Transaction({
      invoiceNumber,
      type,
      contact: new mongoose.Types.ObjectId(contactId),
      items: transactionItems,
      subTotal,
      tax: taxAmount,
      total: grandTotal,
      status: 'Pending',
      notes,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    await newTransaction.save({ session });

    // Update Contact Ledger Balance
    if (type === 'Sale') {
      // Sale: customer owes us more
      contactObj.balance += grandTotal;
    } else {
      // Purchase: we owe the supplier more
      contactObj.balance -= grandTotal;
    }
    await contactObj.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // Revalidate paths for inventory & transaction view
    revalidatePath('/inventory');
    revalidatePath('/sales');
    revalidatePath('/dashboard');
    revalidatePath(`/contacts`);

    return {
      success: true,
      message: 'Transaction successfully processed and balance ledgers updated.',
      transaction: JSON.parse(JSON.stringify(newTransaction)),
      lowStockItems,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Create Transaction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to process transaction.',
    };
  }
}

/**
 * Updates the payment status of a transaction (e.g. Pending → Paid).
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'Pending' | 'Paid' | 'Cancelled'
): Promise<{ success: boolean; message: string }> {
  try {
    await getAuthenticatedUserId();

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return { success: false, message: 'Invalid transaction ID.' };
    }

    await connectToDatabase();

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return { success: false, message: 'Transaction not found.' };
    }

    revalidatePath('/sales');
    revalidatePath(`/sales/${transactionId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Invoice ${transaction.invoiceNumber} marked as ${status}.`,
    };
  } catch (error: any) {
    console.error('Update Transaction Status Error:', error);
    return { success: false, message: error.message || 'Failed to update status.' };
  }
}
