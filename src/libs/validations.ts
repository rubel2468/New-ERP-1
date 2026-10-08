import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  stockLevel: z.number().int().min(0).default(0),
  lowStockLimit: z.number().int().min(0).default(5),
});

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Customer', 'Supplier']),
  customerType: z.enum(['Cash', 'Credit']).optional(),
  // Zod v4 compatible: use transform to treat empty string as undefined
  email: z.string().transform((val) => (val === '' ? undefined : val)).pipe(z.string().email('Invalid email').optional()).optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  balance: z.number().default(0),
});

export const createTransactionSchema = z.object({
  type: z.enum(['Sale', 'Purchase']),
  contactId: z.string().min(1, 'Contact is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
  })).min(1, 'At least one item is required'),
  taxPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  phone: z.string().optional(),
  basicSalary: z.number().min(0, 'Basic salary cannot be negative'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const createPayrollSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  monthYear: z.string().min(1, 'Month/Year is required'),
  basicSalary: z.number().min(0),
  overtime: z.number().min(0).default(0),
  bonus: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export const createExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  payeeName: z.string().min(1, 'Payee Name is required'),
  category: z.enum([
    'Local Conveyance', 
    'Loading/Unloading', 
    'Courier', 
    'Repair & Maintenance', 
    'Office Equipment', 
    'Other'
  ]),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional(),
});
