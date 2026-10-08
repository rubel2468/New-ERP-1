'use client';

import { useState } from 'react';
import { deleteContact } from '@/actions/contact';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';

interface Props {
  contactId: string;
  contactName: string;
}

export default function ContactActions({ contactId, contactName }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteContact(contactId);
    setLoading(false);
    setConfirming(false);
    if (result.success) {
      showToast(result.message, 'success');
      router.refresh();
    } else {
      showToast(result.message, 'error');
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-slate-400 hidden sm:inline">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1 border border-slate-700 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800/40 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-800/50 hover:border-rose-600/70 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 rounded-xl text-xs font-semibold transition-all"
      title="Delete contact"
    >
      🗑️ Delete
    </button>
  );
}
