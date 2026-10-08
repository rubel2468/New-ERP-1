export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Contact from '@/models/contact';
import Link from 'next/link';
import ContactActions from './ContactActions';

async function getContacts() {
  await connectToDatabase();
  return Contact.find().sort({ createdAt: -1 }).lean();
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Contacts Ledger
          </h2>
          <p className="text-slate-400 text-sm">Manage customers and suppliers with balance tracking.</p>
        </div>
        <Link
          href="/contacts/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
        >
          + Add Contact
        </Link>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">Email / Phone</th>
              <th className="px-6 py-4 text-right">Balance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No contacts found. Click &ldquo;Add Contact&rdquo; to get started.
                </td>
              </tr>
            ) : (
              contacts.map((contact: any) => (
                <tr key={contact._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/contacts/${contact._id}`}
                      className="font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                    >
                      {contact.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                      contact.type === 'Customer'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {contact.companyName || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-400">{contact.email || '—'}</div>
                    <div className="text-xs text-slate-500">{contact.phone || '—'}</div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${contact.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {contact.balance >= 0 ? '' : '-'}${Math.abs(contact.balance).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ContactActions
                      contactId={contact._id.toString()}
                      contactName={contact.name}
                    />
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