import { getCashBookData } from '@/actions/report';
import Link from 'next/link';
import FilterSelect from './FilterSelect';

export const dynamic = 'force-dynamic';

export default async function CashBookPage({ searchParams }: { searchParams: { filter?: string } }) {
  const filter = searchParams.filter || 'All';
  const data = await getCashBookData();
  
  let entries = data.entries;
  let summary = data.summary;

  if (filter !== 'All') {
    entries = entries.filter((e: any) => {
      if (filter === 'All Expense') return e.entityType === 'Expense';
      if (filter === 'All Payroll') return e.entityType === 'Payroll';
      // Match exact type or expense category
      return e.type === filter || e.customerType === filter;
    });
    
    // Recalculate summary and running balance for the filtered view
    let balance = 0;
    let totalRevenue = 0;
    let totalExpense = 0;
    
    entries = entries.map((entry: any) => {
      if (entry.type === 'Sale') {
        totalRevenue += entry.debit;
        balance += entry.debit;
      } else {
        totalExpense += entry.credit;
        balance -= entry.credit;
      }
      return { ...entry, balance };
    });

    summary = {
      totalRevenue,
      totalExpense,
      netProfit: totalRevenue - totalExpense,
      finalBalance: balance,
    };
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            {filter === 'All' ? 'Cash Book & Profit/Loss' : `${filter} Report`}
          </h2>
          <p className="text-slate-400 text-sm">Comprehensive view of transactions and ledger balances.</p>
        </div>

        <FilterSelect currentFilter={filter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">${summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-1">Total Expense</p>
          <p className="text-2xl font-bold text-rose-400">${summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-1">Net Profit / Loss</p>
          <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${summary.netProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-1">
            {filter === 'All' ? 'Cash Balance' : 'Filtered Balance'}
          </p>
          <p className={`text-2xl font-bold ${summary.finalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${summary.finalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Invoice / Ref</th>
              <th className="px-6 py-4 text-left">Entity (Contact/Emp/Exp)</th>
              <th className="px-6 py-4 text-left">Category/Type</th>
              <th className="px-6 py-4 text-right">Debit (In)</th>
              <th className="px-6 py-4 text-right">Credit (Out)</th>
              <th className="px-6 py-4 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No transactions found in Cash Book.
                </td>
              </tr>
            ) : (
              entries.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {entry.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-semibold text-slate-200">{entry.entityName}</span>
                    <span className="text-xs text-slate-500 uppercase">{entry.entityType}</span>
                  </td>
                  <td className="px-6 py-4">
                    {entry.entityType === 'Customer' ? (
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                        entry.customerType === 'Cash'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                      }`}>
                        {entry.customerType || 'N/A'}
                      </span>
                    ) : entry.entityType === 'Expense' || entry.entityType === 'Payroll' ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        {entry.customerType || 'N/A'}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-rose-400">
                    {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '—'}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${entry.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${entry.balance.toFixed(2)}
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
