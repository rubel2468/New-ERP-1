'use client';

import { createContact } from '@/actions/contact';
import Link from 'next/link';

import { useState } from 'react';

export default function NewContactPage() {
  const [type, setType] = useState('Customer');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Add New Contact</h2>
        <p className="text-slate-400 text-sm">Create a customer or supplier record with ledger balance.</p>
      </div>

      <form action={createContact} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Alice Customer"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type *</label>
            <select
              name="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 transition-all"
            >
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
        </div>
        
        {type === 'Customer' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Customer Type</label>
              <select
                name="customerType"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 transition-all"
              >
                <option value="Cash">Cash Customer</option>
                <option value="Credit">Credit Customer</option>
              </select>
            </div>
            <div></div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Initial Balance ($)</label>
            <input
              type="number"
              step="0.01"
              name="balance"
              defaultValue="0"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="alice@client.com"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+8801XXXXXXXXX"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Address</label>
          <input
            type="text"
            name="addressStreet"
            placeholder="Street"
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all mb-2"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              name="addressCity"
              placeholder="City"
              className="px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
            <input
              type="text"
              name="addressState"
              placeholder="State"
              className="px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
            <input
              type="text"
              name="addressZip"
              placeholder="Zip"
              className="px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/contacts"
            className="px-4 py-2 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Save Contact
          </button>
        </div>
      </form>
    </div>
  );
}