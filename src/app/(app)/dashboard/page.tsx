export const dynamic = 'force-dynamic';

import { connectToDatabase } from '@/libs/db';
import Product from '@/models/product';
import Transaction from '@/models/transaction';
import Contact from '@/models/contact';
import DashboardClient from './DashboardClient';

async function getDashboardData() {
  await connectToDatabase();

  const [
    totalProducts,
    lowStockProducts,
    transactions,
    totalContacts,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.find({ $expr: { $lte: ['$stockLevel', '$lowStockLimit'] } }).lean(),
    Transaction.find().sort({ createdAt: -1 }).limit(5).populate('contact', 'name').lean(),
    Contact.countDocuments(),
  ]);

  const financialStats = await Transaction.aggregate([
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$total' },
      },
    },
  ]);

  const salesStat    = financialStats.find((f) => f._id === 'Sale')     || { totalAmount: 0 };
  const purchaseStat = financialStats.find((f) => f._id === 'Purchase') || { totalAmount: 0 };

  const netProfit       = salesStat.totalAmount - purchaseStat.totalAmount;
  const profitMarginPct = salesStat.totalAmount > 0
    ? ((netProfit / salesStat.totalAmount) * 100).toFixed(1)
    : '0.0';

  return {
    totalProducts,
    lowStockCount:       lowStockProducts.length,
    lowStockItems:       lowStockProducts,
    recentTransactions:  transactions,
    totalContacts,
    totalSales:          salesStat.totalAmount,
    totalPurchases:      purchaseStat.totalAmount,
    netProfit,
    profitMarginPct,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Serialize mongoose docs for client component
  const serialized = JSON.parse(JSON.stringify(data));

  return (
    <DashboardClient
      data={serialized}
      lastUpdated={lastUpdated}
    />
  );
}
