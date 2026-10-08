'use client';

import { useState } from 'react';
import { updateTransactionStatus } from '@/actions/transaction';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';

type Status = 'Pending' | 'Paid' | 'Cancelled';

interface Props {
  transactionId: string;
  currentStatus: Status;
  invoiceNumber: string;
}

export default function SalesActions({ transactionId, currentStatus, invoiceNumber }: Props) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    const result = await updateTransactionStatus(transactionId, newStatus);
    setLoading(false);
    if (result.success) {
      showToast(result.message, 'success');
      router.refresh();
    } else {
      showToast(result.message, 'error');
    }
  };

  if (currentStatus === 'Paid') {
    return (
      <span className="text-xs text-emerald-500/60 font-medium px-2">✓ Settled</span>
    );
  }

  if (currentStatus === 'Cancelled') {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => handleStatusChange('Paid')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600/10 border border-emerald-600/30 hover:bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
        title="Mark as Paid"
      >
        {loading ? '...' : '✓ Paid'}
      </button>
      <button
        onClick={() => handleStatusChange('Cancelled')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500/5 border border-rose-700/30 hover:bg-rose-500/10 text-rose-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
        title="Cancel Invoice"
      >
        ✕
      </button>
    </div>
  );
}
