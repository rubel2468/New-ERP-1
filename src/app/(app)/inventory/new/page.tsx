import { createProduct } from '@/actions/product';
import Link from 'next/link';

// Server component — uses native form action (no 'use client' needed)
export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Add New Product</h2>
        <p className="text-slate-400 text-sm">Insert details to create a new item in your inventory database.</p>
      </div>

      <form action={createProduct} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Wireless Mouse"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">SKU Code *</label>
            <input
              type="text"
              name="sku"
              required
              placeholder="e.g. MSE-WRL-01"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Barcode</label>
            <input
              type="text"
              name="barcode"
              placeholder="e.g. 79902047382"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category *</label>
            <input
              type="text"
              name="category"
              required
              placeholder="e.g. Accessories"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Product details, features or dimensions..."
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Purchase Price ($) *</label>
            <input
              type="number"
              step="0.01"
              name="purchasePrice"
              required
              placeholder="10.00"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Selling Price ($) *</label>
            <input
              type="number"
              step="0.01"
              name="sellingPrice"
              required
              placeholder="19.99"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Initial Stock Level</label>
            <input
              type="number"
              name="stockLevel"
              defaultValue="0"
              min="0"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Low Stock Alert Limit</label>
            <input
              type="number"
              name="lowStockLimit"
              defaultValue="5"
              min="0"
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/inventory"
            className="px-4 py-2 border border-slate-800/80 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
