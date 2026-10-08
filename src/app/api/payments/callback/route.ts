import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';

/**
 * Handle POST request callbacks from SSLCommerz (Success / Fail / Cancel / IPN)
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse URL-encoded request body from SSLCommerz
    const formData = await request.formData();
    const status = formData.get('status');
    const tranId = formData.get('tran_id') as string;
    const amount = formData.get('amount');
    const valId = formData.get('val_id');

    if (!tranId) {
      return NextResponse.json({ error: 'Transaction ID is missing' }, { status: 400 });
    }

    // Find transaction by invoice number
    const transaction = await Transaction.findOne({ invoiceNumber: tranId });

    if (!transaction) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (status === 'VALID' || status === 'SUCCESS') {
      // Update transaction status to Paid
      transaction.status = 'Paid';
      await transaction.save();

      // Redirect to success page on the frontend
      return NextResponse.redirect(
        new URL(`/sales/success?invoice=${tranId}&val_id=${valId}`, request.url),
        303
      );
    } else {
      // Update transaction status to Cancelled or pending based on callback
      transaction.status = 'Cancelled';
      await transaction.save();

      return NextResponse.redirect(
        new URL(`/sales/failed?invoice=${tranId}&reason=${status}`, request.url),
        303
      );
    }
  } catch (error: any) {
    console.error('SSLCommerz Callback Error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}
