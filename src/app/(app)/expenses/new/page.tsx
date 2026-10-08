'use client';

import { createExpense } from '@/actions/expense';
import Link from 'next/link';

export default function NewExpensePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Add New Expense</h2>
        <p className="text-slate-400 text-sm">Log an office or operational expense.</p>
      </div>

      <form action={createExpense} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Expense Title / Purpose *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Lunch for guests"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Payee Name (Who gets the money) *</label>
            <input
              type="text"
              name="payeeName"
              required
              placeholder="e.g. Rahim (Delivery Man)"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category *</label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 transition-all"
            >
              <option value="Local Conveyance">Local Conveyance</option>
              <option value="Loading/Unloading">Loading/Unloading</option>
              <option value="Courier">Courier</option>
              <option value="Repair & Maintenance">Repair & Maintenance</option>
              <option value="Office Equipment">Office Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              min="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="Additional details..."
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/expenses"
            className="px-4 py-2 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
}
