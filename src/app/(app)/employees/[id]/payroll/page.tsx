import { connectToDatabase } from '@/libs/db';
import Employee from '@/models/employee';
import { notFound } from 'next/navigation';
import IssuePayrollForm from './IssuePayrollForm';

export default async function IssuePayrollPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const employee = await Employee.findById(params.id).lean();

  if (!employee) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Issue Payroll</h2>
        <p className="text-slate-400 text-sm">Process salary, overtime, and bonus for {employee.name}.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex justify-between items-center bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</div>
            <div className="text-lg font-bold text-slate-200">{employee.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basic Salary</div>
            <div className="text-lg font-bold text-emerald-400">${employee.basicSalary.toFixed(2)}</div>
          </div>
        </div>

        <IssuePayrollForm employeeId={employee._id.toString()} basicSalary={employee.basicSalary} />
      </div>
    </div>
  );
}
