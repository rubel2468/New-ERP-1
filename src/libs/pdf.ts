import PDFDocument from 'pdfkit';
import { ITransaction } from '@/models/transaction';
import { IContact } from '@/models/contact';

/**
 * Generates an Invoice PDF using pdfkit and returns a Buffer
 */
export async function generateInvoicePDF(
  transaction: ITransaction & { contact: IContact; items: any[] }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // --- Header ---
    doc
      .fillColor('#475569')
      .fontSize(20)
      .text('INVOICE', { align: 'right' })
      .fontSize(10)
      .text(`Invoice Number: ${transaction.invoiceNumber}`, { align: 'right' })
      .text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, { align: 'right' })
      .moveDown();

    // --- Company Info ---
    doc
      .fillColor('#1e293b')
      .fontSize(14)
      .text('Rubel ERP', 50, 50)
      .fontSize(10)
      .text('Dhaka, Bangladesh')
      .text('rubelerp.com')
      .text('rk1769950@gmail.com')
      .moveDown(2);

    // --- Bill To / Customer Details ---
    const contact = transaction.contact;
    doc
      .fontSize(12)
      .text('Bill To:', 50, 150)
      .fontSize(10)
      .text(contact.name)
      .text(contact.companyName || '')
      .text(contact.email || '')
      .text(contact.phone || '')
      .moveDown(2);

    // --- Table Headers ---
    const tableTop = 250;
    doc
      .fontSize(10)
      .text('Product Name', 50, tableTop, { bold: true } as any)
      .text('Qty', 250, tableTop, { width: 50, align: 'right' })
      .text('Unit Price', 320, tableTop, { width: 80, align: 'right' })
      .text('Line Total', 420, tableTop, { width: 100, align: 'right' });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .strokeColor('#cbd5e1')
      .stroke();

    // --- Table Rows ---
    let currentY = tableTop + 25;
    transaction.items.forEach((item) => {
      const productName = (item.product as any)?.name || 'Unknown Product';
      doc
        .text(productName, 50, currentY)
        .text(item.quantity.toString(), 250, currentY, { width: 50, align: 'right' })
        .text(`$${item.unitPrice.toFixed(2)}`, 320, currentY, { width: 80, align: 'right' })
        .text(`$${item.totalPrice.toFixed(2)}`, 420, currentY, { width: 100, align: 'right' });

      currentY += 20;
    });

    // --- Divider line ---
    doc
      .moveTo(50, currentY + 10)
      .lineTo(550, currentY + 10)
      .stroke();

    // --- Summary Totals ---
    const summaryY = currentY + 20;
    doc
      .text('Subtotal:', 320, summaryY, { width: 100, align: 'right' })
      .text(`$${transaction.subTotal.toFixed(2)}`, 420, summaryY, { width: 100, align: 'right' })
      .text('Tax:', 320, summaryY + 15, { width: 100, align: 'right' })
      .text(`$${transaction.tax.toFixed(2)}`, 420, summaryY + 15, { width: 100, align: 'right' })
      .fontSize(12)
      .text('Total:', 320, summaryY + 35, { width: 100, align: 'right', bold: true } as any)
      .text(`$${transaction.total.toFixed(2)}`, 420, summaryY + 35, { width: 100, align: 'right', bold: true } as any);

    // --- Footer ---
    doc
      .fontSize(8)
      .fillColor('#94a3b8')
      .text('Thank you for your business!', 50, 700, { align: 'center' });

    doc.end();
  });
}
