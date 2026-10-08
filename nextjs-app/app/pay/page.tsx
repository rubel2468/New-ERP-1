'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pay() {
  const [id, setId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, paymentMethod }),
    });
    if (res.ok) {
      alert('Payment recorded successfully!');
      router.push('/');
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to record payment');
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Record Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer ID:</label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            required 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter unique ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method:</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit (Card/Online)</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-medium rounded py-2 mt-4 hover:bg-blue-700 transition"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
