'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ----- Toast Container & Individual Toast UI -----

const toastStyles: Record<ToastType, string> = {
  success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  error:   'bg-rose-500/15 border-rose-500/40 text-rose-300',
  warning: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  info:    'bg-blue-500/15 border-blue-500/40 text-blue-300',
};

const toastIcons: Record<ToastType, string> = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`
        flex items-center gap-3 w-full max-w-sm px-4 py-3 rounded-xl border
        shadow-2xl backdrop-blur-md text-sm font-medium
        transition-all duration-300
        ${toastStyles[toast.type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="text-base shrink-0">{toastIcons[toast.type]}</span>
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={onRemove}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
