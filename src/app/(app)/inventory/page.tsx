export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Product from '@/models/product';
import Link from 'next/link';
import InventoryActions from './InventoryActions';

async function getProducts() {
  await connectToDatabase();
  return Product.find().sort({ createdAt: -1 }).lean();
}

export default async function InventoryPage() {
  const products: any[] = await getProducts();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Inventory Catalog
          </h2>
          <p className="text-slate-400 text-sm">Manage products, pricing, categories, and track stock limits.</p>
        </div>
        <Link
          href="/inventory/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800/50">
          <thead className="bg-slate-900/60">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4 text-left">Product Details</th>
              <th className="px-6 py-4 text-left">SKU / Barcode</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-right">Prices</th>
              <th className="px-6 py-4 text-center">Margin</th>
              <th className="px-6 py-4 text-center">Stock Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-transparent text-sm text-slate-300">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No products found. Click &ldquo;Add Product&rdquo; to build your catalog.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.stockLevel <= product.lowStockLimit;
                const margin = product.sellingPrice > 0
                  ? (((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100).toFixed(0)
                  : '0';
                const marginNum = parseFloat(margin);

                return (
                  <tr key={product._id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-400">{product.sku}</div>
                      {product.barcode && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{product.barcode}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700/50">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-slate-200">Sell: ${product.sellingPrice.toFixed(2)}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Buy: ${product.purchasePrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        marginNum >= 30
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : marginNum >= 10
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                        isLowStock
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {product.stockLevel} units
                        {isLowStock && <span className="ml-1 animate-pulse">⚠️</span>}
                      </span>
                      <div className="text-[10px] text-slate-600 mt-0.5">Limit: {product.lowStockLimit}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <InventoryActions
                        productId={product._id.toString()}
                        productName={product.name}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
