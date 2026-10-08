export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Contact from '@/models/contact'; // Must import to register models
import Product from '@/models/product'; // Must import to register models
import { generateInvoicePDF } from '@/libs/pdf';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Retrieve Transaction and populate related fields
    const transaction = await Transaction.findById(invoiceId)
      .populate('contact')
      .populate('items.product')
      .exec();

    if (!transaction) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Generate the PDF Buffer
    const pdfBuffer = await generateInvoicePDF(transaction as any);

    // Return the response as a PDF attachment download
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${transaction.invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('PDF Generation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
