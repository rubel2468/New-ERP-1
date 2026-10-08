'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-100">Something went wrong!</h2>
      <p className="text-sm text-slate-400">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  );
}