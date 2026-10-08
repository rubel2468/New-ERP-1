export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Contact from '@/models/contact';
import Product from '@/models/product';
import NewTransactionForm from './NewTransactionForm';

async function getFormData() {
  await connectToDatabase();
  const [contacts, products] = await Promise.all([
    Contact.find({ }, 'name type companyName').sort({ name: 1 }).lean(),
    Product.find({ }, 'name sku sellingPrice purchasePrice stockLevel').sort({ name: 1 }).lean(),
  ]);
  return { contacts, products };
}

export default async function NewTransactionPage() {
  const { contacts, products } = await getFormData();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">New Transaction</h2>
        <p className="text-slate-400 text-sm">Create a Sale or Purchase invoice with line items and auto inventory update.</p>
      </div>
      <NewTransactionForm
        contacts={JSON.parse(JSON.stringify(contacts))}
        products={JSON.parse(JSON.stringify(products))}
      />
    </div>
  );
}
