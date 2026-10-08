export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Product from '@/models/product';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SalesActions from '../SalesActions';

interface PageProps {
  params: { id: string };
}

async function getTransaction(id: string) {
  await connectToDatabase();
  const tx = await Transaction.findById(id)
    .populate('contact', 'name companyName email phone')
    .populate('items.product', 'name sku')
    .lean();
  return tx;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const transaction: any = await getTransaction(params.id);

  if (!transaction) {
    notFound();
  }

  const statusColor = {
    Paid:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Pending:   'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Cancelled: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  }[transaction.status as 'Paid' | 'Pending' | 'Cancelled'];

  const typeColor = transaction.type === 'Sale'
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
    : 'bg-amber-500/15 text-amber-400 border-amber-500/20';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back & Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/sales"
          className="px-3 py-1.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/40 transition-colors"
        >
          ← Back to Ledger
        </Link>
      </div>

      {/* Invoice Card */}
      <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold font-mono text-blue-400">{transaction.invoiceNumber}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Created: {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${typeColor}`}>
              {transaction.type}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColor}`}>
              {transaction.status}
            </span>
          </div>
        </div>

        <hr className="border-slate-800/60" />

        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            {transaction.type === 'Sale' ? 'Bill To' : 'Supplier'}
          </h3>
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800/60 space-y-1">
            <p className="font-semibold text-slate-200">{transaction.contact?.name || 'N/A'}</p>
            {transaction.contact?.companyName && (
              <p className="text-sm text-slate-400">{transaction.contact.companyName}</p>
            )}
            {transaction.contact?.email && (
              <p className="text-xs text-slate-500">{transaction.contact.email}</p>
            )}
            {transaction.contact?.phone && (
              <p className="text-xs text-slate-500">{transaction.contact.phone}</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Line Items</h3>
          <div className="rounded-xl border border-slate-800/60 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-800/50">
              <thead className="bg-slate-900/60">
                <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-center">Qty</th>
                  <th className="px-5 py-3 text-right">Unit Price</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {transaction.items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/10">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-200">{item.product?.name || 'Unknown Product'}</div>
                      {item.product?.sku && (
                        <div className="text-xs text-slate-500 font-mono">SKU: {item.product.sku}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold">{item.quantity}</td>
                    <td className="px-5 py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right font-bold text-white">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium text-slate-300">${transaction.subTotal.toFixed(2)}</span>
            </div>
            {transaction.tax > 0 && (
              <div className="flex justify-between text-sm text-slate-400">
                <span>Tax</span>
                <span className="font-medium text-slate-300">${transaction.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-slate-800/60 pt-2 mt-2">
              <span className="text-slate-200">Grand Total</span>
              <span className="text-white">${transaction.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-800/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Notes</h3>
            <p className="text-sm text-slate-400">{transaction.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <SalesActions
              transactionId={transaction._id.toString()}
              currentStatus={transaction.status}
              invoiceNumber={transaction.invoiceNumber}
            />
          </div>
          <a
            href={`/api/invoices/export?id=${transaction._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            download
          >
            📥 Download PDF Invoice
          </a>
        </div>
      </div>
    </div>
  );
}
