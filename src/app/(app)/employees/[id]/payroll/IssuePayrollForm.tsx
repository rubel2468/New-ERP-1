'use client';

import { processPayroll } from '@/actions/employee';
import Link from 'next/link';
import { useState } from 'react';

export default function IssuePayrollForm({ employeeId, basicSalary }: { employeeId: string, basicSalary: number }) {
  const [overtime, setOvertime] = useState(0);
  const [bonus, setBonus] = useState(0);

  const totalPaid = basicSalary + overtime + bonus;

  return (
    <form action={processPayroll} className="space-y-4">
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="basicSalary" value={basicSalary} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Month / Year *</label>
          <input
            type="month"
            name="monthYear"
            required
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="e.g. Eid Bonus included"
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Overtime Amount ($)</label>
          <input
            type="number"
            step="0.01"
            name="overtime"
            value={overtime}
            onChange={(e) => setOvertime(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Bonus Amount ($)</label>
          <input
            type="number"
            step="0.01"
            name="bonus"
            value={bonus}
            onChange={(e) => setBonus(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 mt-6 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Payout</div>
          <div className="text-2xl font-bold text-emerald-400">${totalPaid.toFixed(2)}</div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/employees"
            className="px-4 py-2 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Process & Pay
          </button>
        </div>
      </div>
    </form>
  );
}
