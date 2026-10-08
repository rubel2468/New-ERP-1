'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTransaction } from '@/actions/transaction';
import { useToast } from '@/components/providers/ToastProvider';
import Link from 'next/link';

interface Contact {
  _id: string;
  name: string;
  type: string;
  companyName?: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  purchasePrice: number;
  stockLevel: number;
}

interface LineItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Props {
  contacts: Contact[];
  products: Product[];
}

export default function NewTransactionForm({ contacts, products }: Props) {
  const [type, setType]           = useState<'Sale' | 'Purchase'>('Sale');
  const [contactId, setContactId] = useState('');
  const [items, setItems]         = useState<LineItem[]>([{ productId: '', quantity: 1, unitPrice: 0 }]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes]         = useState('');
  const [loading, setLoading]     = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  // ── computed totals ──
  const subTotal  = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = (subTotal * taxPercent) / 100;
  const grandTotal = subTotal + taxAmount;

  const addItem = () => setItems((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }]);

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: value };

        // Auto-fill unit price when product is selected
        if (field === 'productId') {
          const product = products.find((p) => p._id === value);
          if (product) {
            updated.unitPrice = type === 'Sale' ? product.sellingPrice : product.purchasePrice;
          }
        }
        return updated;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactId) {
      showToast('Please select a contact.', 'error');
      return;
    }
    if (items.some((i) => !i.productId)) {
      showToast('Please select a product for each line item.', 'error');
      return;
    }

    setLoading(true);
    const result = await createTransaction(null, { type, contactId, items, taxPercent, notes });
    setLoading(false);

    if (result.success) {
      showToast(result.message, 'success');
      if (result.lowStockItems && result.lowStockItems.length > 0) {
        result.lowStockItems.forEach((msg) => showToast(`⚠️ ${msg}`, 'warning'));
      }
      router.push('/sales');
      router.refresh();
    } else {
      showToast(result.message, 'error');
    }
  };

  const inputCls = 'w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all';
  const labelCls = 'block text-xs font-semibold text-slate-400 uppercase mb-1';

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-6">

      {/* Transaction Type Toggle */}
      <div>
        <label className={labelCls}>Transaction Type</label>
        <div className="flex gap-2 mt-1">
          {(['Sale', 'Purchase'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                // Re-apply unit prices when switching type
                setItems((prev) =>
                  prev.map((item) => {
                    if (!item.productId) return item;
                    const p = products.find((pr) => pr._id === item.productId);
                    return p ? { ...item, unitPrice: t === 'Sale' ? p.sellingPrice : p.purchasePrice } : item;
                  })
                );
              }}
              className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                type === t
                  ? t === 'Sale'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                  : 'border-slate-800 text-slate-500 hover:bg-slate-800/30'
              }`}
            >
              {t === 'Sale' ? '💰 Sale' : '🛒 Purchase'}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div>
        <label className={labelCls}>Contact *</label>
        <select
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
          required
          className={inputCls}
        >
          <option value="">— Select a contact —</option>
          {contacts.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}{c.companyName ? ` (${c.companyName})` : ''} — {c.type}
            </option>
          ))}
        </select>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className={labelCls}>Line Items *</label>
          <button
            type="button"
            onClick={addItem}
            className="text-xs px-3 py-1 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-semibold"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const selectedProduct = products.find((p) => p._id === item.productId);
            const lineTotal = item.quantity * item.unitPrice;

            return (
              <div key={idx} className="p-4 bg-slate-800/20 border border-slate-800/60 rounded-xl space-y-3">
                <div className="grid grid-cols-12 gap-3">
                  {/* Product select */}
                  <div className="col-span-5">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                      required
                      className={inputCls}
                    >
                      <option value="">— Select product —</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Stock: {p.stockLevel})
                        </option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">SKU: {selectedProduct.sku}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={type === 'Sale' ? selectedProduct?.stockLevel ?? undefined : undefined}
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={inputCls}
                      required
                    />
                  </div>

                  {/* Line Total + Remove */}
                  <div className="col-span-2 flex flex-col justify-end items-end">
                    <span className="text-xs text-slate-500 mb-1">Total</span>
                    <span className="text-sm font-bold text-white">${lineTotal.toFixed(2)}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="mt-1 text-[10px] text-rose-500/70 hover:text-rose-400 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax & Notes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tax Rate (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={taxPercent}
            onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions..."
            className={inputCls}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-slate-800/20 border border-slate-800/60 rounded-xl space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Summary</h4>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-slate-300">${subTotal.toFixed(2)}</span>
        </div>
        {taxPercent > 0 && (
          <div className="flex justify-between text-sm text-slate-400">
            <span>Tax ({taxPercent}%)</span>
            <span className="font-medium text-slate-300">${taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t border-slate-700/40 pt-2 mt-1">
          <span className="text-slate-200">Grand Total</span>
          <span className="text-white text-lg">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/sales"
          className="px-4 py-2.5 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Create ${type} Invoice`}
        </button>
      </div>
    </form>
  );
}
