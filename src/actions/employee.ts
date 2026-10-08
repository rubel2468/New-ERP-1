'use server';

import { connectToDatabase } from '@/libs/db';
import Employee from '@/models/employee';
import Payroll from '@/models/payroll';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { createEmployeeSchema, createPayrollSchema } from '@/libs/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return (session.user as any).id;
}

export async function createEmployee(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validated = createEmployeeSchema.safeParse({
    name: formData.get('name'),
    designation: formData.get('designation'),
    phone: formData.get('phone') || undefined,
    basicSalary: parseFloat(formData.get('basicSalary') as string) || 0,
    status: formData.get('status') || 'Active',
  });

  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || 'Invalid input');
  }

  await connectToDatabase();

  await Employee.create({
    ...validated.data,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  revalidatePath('/employees');
  redirect('/employees');
}

export async function processPayroll(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const validated = createPayrollSchema.safeParse({
    employeeId: formData.get('employeeId'),
    monthYear: formData.get('monthYear'),
    basicSalary: parseFloat(formData.get('basicSalary') as string) || 0,
    overtime: parseFloat(formData.get('overtime') as string) || 0,
    bonus: parseFloat(formData.get('bonus') as string) || 0,
    notes: formData.get('notes') || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.issues[0]?.message || 'Invalid input');
  }

  await connectToDatabase();

  const { employeeId, monthYear, basicSalary, overtime, bonus, notes } = validated.data;
  const totalPaid = basicSalary + overtime + bonus;

  await Payroll.create({
    employee: new mongoose.Types.ObjectId(employeeId),
    monthYear,
    basicSalary,
    overtime,
    bonus,
    totalPaid,
    notes,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  revalidatePath('/employees');
  revalidatePath('/cash-book');
  redirect('/employees');
}
