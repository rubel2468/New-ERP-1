'use client';
import { useEffect, useState } from 'react';

interface Customer {
  id: string;
  name: string;
  type: string;
  amount_due: number;
  paid: number;
  payment_method?: string;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then(setCustomers);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">ID</th>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Cust. Type</th>
              <th className="p-4 font-medium text-gray-600">Amount Due</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Paid Via</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-500">{c.id}</td>
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 capitalize">{c.type}</td>
                <td className="p-4">${c.amount_due}</td>
                <td className="p-4">
                  {c.paid ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Paid</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">Unpaid</span>
                  )}
                </td>
                <td className="p-4 capitalize">{c.payment_method || '-'}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No customers found. Create one from the sidebar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
