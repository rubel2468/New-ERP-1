'use client';

import { createEmployee } from '@/actions/employee';
import Link from 'next/link';

export default function NewEmployeePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Add New Employee</h2>
        <p className="text-slate-400 text-sm">Create an employee profile for payroll processing.</p>
      </div>

      <form action={createEmployee} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Employee Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Designation *</label>
            <input
              type="text"
              name="designation"
              required
              placeholder="e.g. Manager"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+8801XXXXXXXXX"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Basic Salary ($) *</label>
            <input
              type="number"
              step="0.01"
              name="basicSalary"
              required
              defaultValue="0"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
          <select
            name="status"
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
}
