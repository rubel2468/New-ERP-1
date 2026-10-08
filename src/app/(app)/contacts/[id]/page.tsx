export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Contact from '@/models/contact';
import Transaction from '@/models/transaction';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

async function getContactData(id: string) {
  await connectToDatabase();
  const [contact, transactions] = await Promise.all([
    Contact.findById(id).lean(),
    Transaction.find({ contact: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);
  return { contact, transactions };
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { contact, transactions }: any = await getContactData(params.id);

  if (!contact) {
    notFound();
  }

  const totalSales     = transactions.filter((t: any) => t.type === 'Sale').reduce((s: number, t: any) => s + t.total, 0);
  const totalPurchases = transactions.filter((t: any) => t.type === 'Purchase').reduce((s: number, t: any) => s + t.total, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/contacts"
        className="inline-block px-3 py-1.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/40 transition-colors"
      >
        ← Back to Contacts
      </Link>

      {/* Contact Header Card */}
      <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-extrabold text-xl shadow-lg border border-white/10">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">{contact.name}</h2>
              {contact.companyName && (
                <p className="text-slate-400 text-sm">{contact.companyName}</p>
              )}
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                contact.type === 'Customer'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              }`}>
                {contact.type}
              </span>
            </div>
          </div>

          {/* Balance */}
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ledger Balance</p>
            <p className={`text-3xl font-black ${contact.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {contact.balance >= 0 ? '' : '-'}${Math.abs(contact.balance).toFixed(2)}
            </p>
          </div>
        </div>

        <hr className="border-slate-800/60 my-5" />

        {/* Contact Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {contact.email && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Email</p>
              <p className="text-slate-300">{contact.email}</p>
            </div>
          )}
          {contact.phone && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Phone</p>
              <p className="text-slate-300">{contact.phone}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Added</p>
            <p className="text-slate-300">
              {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Transactions</p>
          <p className="text-2xl font-black text-white">{transactions.length}</p>
        </div>
        <div className="p-4 bg-slate-900/40 border border-emerald-800/30 rounded-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sales Volume</p>
          <p className="text-2xl font-black text-emerald-400">${totalSales.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-slate-900/40 border border-amber-800/30 rounded-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Purchases Volume</p>
          <p className="text-2xl font-black text-amber-400">${totalPurchases.toFixed(2)}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-800/50">
          <h3 className="text-lg font-bold text-slate-100">Transaction History</h3>
          <p className="text-xs text-slate-500 mt-0.5">Last {transactions.length} transactions</p>
        </div>
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">No transactions with this contact yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-800/50">
            <thead className="bg-slate-900/40">
              <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-3 text-left">Invoice #</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
              {transactions.map((tx: any) => (
                <tr key={tx._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-blue-400">
                    <Link href={`/sales/${tx._id}`} className="hover:underline">
                      {tx.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                      tx.type === 'Sale'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      tx.status === 'Paid'      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                      tx.status === 'Pending'   ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-white">${tx.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
