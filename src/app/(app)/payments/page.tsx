export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Contact from '@/models/contact';
import PaymentForm from './PaymentForm';

async function getCustomers() {
  await connectToDatabase();
  // Fetch only customers
  return Contact.find({ type: 'Customer' }, 'name companyName balance')
    .sort({ name: 1 })
    .lean();
}

export default async function PaymentsPage() {
  const customers = await getCustomers();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Record Payment
        </h2>
        <p className="text-slate-400 text-sm">
          Select a customer to settle their pending invoices and update their balance using a Cash or Credit payment method.
        </p>
      </div>

      <PaymentForm customers={JSON.parse(JSON.stringify(customers))} />
    </div>
  );
}
