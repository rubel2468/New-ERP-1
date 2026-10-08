'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCustomer() {
  const [name, setName] = useState('');
  const [type, setType] = useState('cash');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, amount: parseFloat(amount) }),
    });
    if (res.ok) {
      const data = await res.json();
      alert(`Customer created successfully!\n\nID: ${data.id}\n\nPlease copy this ID to process payments later.`);
      router.push('/');
    } else {
      alert('Failed to create customer');
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Create New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Customer Name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Type:</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="cash">Cash Customer</option>
            <option value="credit">Credit Customer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount Due:</label>
          <input 
            type="number" 
            step="0.01" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-medium rounded py-2 mt-4 hover:bg-blue-700 transition"
        >
          Create Customer
        </button>
      </form>
    </div>
  );
}
