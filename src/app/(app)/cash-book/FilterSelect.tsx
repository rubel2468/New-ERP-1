'use client';

import { useRouter } from 'next/navigation';

export default function FilterSelect({ currentFilter }: { currentFilter: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => window.print()}
        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-2 shadow-lg shadow-black/20"
      >
        🖨️ Print
      </button>
      
      <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-2">Filter:</label>
          <select 
            defaultValue={currentFilter}
            onChange={(e) => router.push(`/cash-book?filter=${e.target.value}`)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-lg text-sm text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
          >
            <option value="All">All Transactions</option>
            <optgroup label="Income & Goods">
              <option value="Sale">Invoice / Sales</option>
              <option value="Purchase">Purchases</option>
            </optgroup>
            <optgroup label="Payroll">
              <option value="All Payroll">All Payroll (Combined)</option>
              <option value="Salary">Basic Salary</option>
              <option value="Overtime">Overtime</option>
              <option value="Bonus">Bonus</option>
            </optgroup>
            <optgroup label="Expenses">
              <option value="All Expense">All Expenses</option>
              <option value="Local Conveyance">Local Conveyance</option>
              <option value="Loading/Unloading">Loading/Unloading</option>
              <option value="Courier">Courier</option>
              <option value="Repair & Maintenance">Repair & Maintenance</option>
              <option value="Office Equipment">Office Equipment</option>
              <option value="Other">Other Expenses</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
