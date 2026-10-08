export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Employee from '@/models/employee';
import Link from 'next/link';

async function getEmployees() {
  await connectToDatabase();
  return Employee.find().sort({ createdAt: -1 }).lean();
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Employees & Payroll
          </h2>
          <p className="text-slate-400 text-sm">Manage staff, basic salary, and issue payrolls.</p>
        </div>
        <Link
          href="/employees/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
        >
          + Add Employee
        </Link>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Designation</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-right">Basic Salary</th>
              <th className="px-6 py-4 text-right">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No employees found. Click &ldquo;Add Employee&rdquo; to get started.
                </td>
              </tr>
            ) : (
              employees.map((emp: any) => (
                <tr key={emp._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {emp.designation}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {emp.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    ${emp.basicSalary.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                      emp.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/employees/${emp._id}/payroll`}
                      className="text-blue-400 hover:text-blue-300 font-semibold text-xs"
                    >
                      Issue Payroll
                    </Link>
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
