export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Link from 'next/link';
import SalesActions from './SalesActions';

async function getInvoices() {
  await connectToDatabase();
  return Transaction.find()
    .sort({ createdAt: -1 })
    .populate('contact', 'name companyName')
    .lean();
}

export default async function SalesInvoicesPage() {
  const invoices: any[] = await getInvoices();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Invoices Ledger
          </h2>
          <p className="text-slate-400 text-sm">View logs, download PDF receipts, and track transaction payment statuses.</p>
        </div>
        <Link
          href="/sales/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
        >
          + New Transaction
        </Link>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Invoice Number</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Partner (Contact)</th>
              <th className="px-6 py-4 text-right">Amount Details</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No invoices found. Click &ldquo;+ New Transaction&rdquo; to create your first invoice.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-slate-800/10 transition-colors">
                  {/* Invoice # — clickable link */}
                  <td className="px-6 py-4 font-mono font-semibold text-blue-400">
                    <Link href={`/sales/${invoice._id}`} className="hover:underline hover:text-blue-300 transition-colors">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                      invoice.type === 'Sale'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                      {invoice.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{invoice.contact?.name || 'N/A'}</div>
                    {invoice.contact?.companyName && (
                      <div className="text-xs text-slate-500 mt-0.5">{invoice.contact?.companyName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <div className="text-slate-200 font-bold">Total: ${invoice.total.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Sub: ${invoice.subTotal.toFixed(2)}</div>
                    {invoice.tax > 0 && (
                      <div className="text-xs text-slate-600">Tax: ${invoice.tax.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      invoice.status === 'Paid'      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                      invoice.status === 'Pending'   ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <SalesActions
                        transactionId={invoice._id.toString()}
                        currentStatus={invoice.status}
                        invoiceNumber={invoice.invoiceNumber}
                      />
                      <a
                        href={`/api/invoices/export?id=${invoice._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                        download
                        title="Download PDF"
                      >
                        📥 PDF
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
