export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Expense from '@/models/expense';
import Link from 'next/link';

async function getExpenses() {
  await connectToDatabase();
  return Expense.find().sort({ expenseDate: -1, createdAt: -1 }).lean();
}

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Expenses
          </h2>
          <p className="text-slate-400 text-sm">Track local conveyance, courier, maintenance, and other costs.</p>
        </div>
        <Link
          href="/expenses/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
        >
          + Add Expense
        </Link>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Notes</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No expenses recorded. Click &ldquo;Add Expense&rdquo; to log a new expense.
                </td>
              </tr>
            ) : (
              expenses.map((exp: any) => (
                <tr key={exp._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(exp.expenseDate || exp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{exp.title}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">To: {exp.payeeName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 truncate max-w-[200px]">
                    {exp.notes || '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-400">
                    ${exp.amount.toFixed(2)}
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
