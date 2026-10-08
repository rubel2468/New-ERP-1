'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/providers/ToastProvider';
import { receivePayment } from '@/actions/payment';

interface Customer {
  _id: string;
  name: string;
  companyName?: string;
  balance: number;
}

interface Props {
  customers: Customer[];
}

export default function PaymentForm({ customers }: Props) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      showToast('Please select a customer.', 'error');
      return;
    }

    setLoading(true);
    const result = await receivePayment(selectedCustomerId, paymentMethod);
    setLoading(false);

    if (result.success) {
      showToast(result.message, 'success');
      router.push('/sales');
    } else {
      showToast(result.message, 'error');
    }
  };

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Customer Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-300">Customer</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
        >
          <option value="">-- Select a Customer --</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.companyName ? `(${c.companyName})` : ''} - Balance: ${c.balance.toFixed(2)}
            </option>
          ))}
        </select>
        {selectedCustomer && (
          <p className="text-xs text-slate-400 mt-1">
            Current balance: <span className="font-bold text-white">${selectedCustomer.balance.toFixed(2)}</span>
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-300">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
        >
          <option value="Cash">Cash</option>
          <option value="Credit">Credit (Card/Online)</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !selectedCustomerId}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Record Payment & Settle Invoices'
        )}
      </button>

    </form>
  );
}
