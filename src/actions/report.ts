'use server';

import { connectToDatabase } from '@/libs/db';
import Transaction from '@/models/transaction';
import Contact from '@/models/contact';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

import Employee from '@/models/employee';
import Expense from '@/models/expense';
import Payroll from '@/models/payroll';

export async function getCashBookData() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await connectToDatabase();
  
  // Ensure models are registered
  Contact.init();
  Employee.init();

  const transactions = await Transaction.find({}).populate('contact', 'name type customerType').lean();
  const expenses = await Expense.find({}).lean();
  const payrolls = await Payroll.find({}).populate('employee', 'name').lean();

  let allEntries: any[] = [];

  transactions.forEach((t: any) => {
    allEntries.push({
      id: t._id.toString(),
      date: new Date(t.createdAt).getTime(),
      displayDate: t.createdAt.toISOString(),
      invoiceNumber: t.invoiceNumber,
      entityName: t.contact?.name || 'N/A',
      entityType: t.contact?.type || 'N/A',
      customerType: t.contact?.customerType || 'N/A',
      type: t.type,
      notes: t.notes || '',
      amount: t.total,
    });
  });

  expenses.forEach((e: any) => {
    allEntries.push({
      id: e._id.toString(),
      date: new Date(e.expenseDate || e.createdAt).getTime(),
      displayDate: (e.expenseDate || e.createdAt).toISOString(),
      invoiceNumber: 'EXP-' + e._id.toString().substring(18).toUpperCase(),
      entityName: e.payeeName || 'N/A',
      entityType: 'Expense',
      customerType: e.category,
      type: 'Expense',
      notes: e.title + (e.notes ? ' - ' + e.notes : ''),
      amount: e.amount,
    });
  });

  payrolls.forEach((p: any) => {
    const base = {
      date: new Date(p.paymentDate || p.createdAt).getTime(),
      displayDate: (p.paymentDate || p.createdAt).toISOString(),
      invoiceNumber: 'PAY-' + p._id.toString().substring(18).toUpperCase(),
      entityName: p.employee?.name || 'N/A',
      entityType: 'Payroll',
      customerType: p.monthYear,
      notes: p.notes || '',
    };

    if (p.basicSalary > 0) {
      allEntries.push({ ...base, id: p._id.toString() + '-SAL', type: 'Salary', amount: p.basicSalary });
    }
    if (p.overtime > 0) {
      allEntries.push({ ...base, id: p._id.toString() + '-OT', type: 'Overtime', amount: p.overtime });
    }
    if (p.bonus > 0) {
      allEntries.push({ ...base, id: p._id.toString() + '-BON', type: 'Bonus', amount: p.bonus });
    }
  });

  allEntries.sort((a, b) => a.date - b.date);

  let balance = 0;
  let totalRevenue = 0;
  let totalExpense = 0;

  const entries = allEntries.map(entry => {
    let debit = 0;
    let credit = 0;

    if (entry.type === 'Sale') {
      debit = entry.amount;
      totalRevenue += debit;
      balance += debit;
    } else {
      // Purchase, Expense, Payroll are all Cash Out (Credit)
      credit = entry.amount;
      totalExpense += credit;
      balance -= credit;
    }

    return {
      ...entry,
      debit,
      credit,
      balance,
    };
  });

  return {
    entries,
    summary: {
      totalRevenue,
      totalExpense,
      netProfit: totalRevenue - totalExpense,
      finalBalance: balance,
    }
  };
}
