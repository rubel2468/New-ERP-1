'use server';

import { connectToDatabase } from '@/libs/db';
import Product from '@/models/product';
import Transaction from '@/models/transaction';
import Contact from '@/models/contact';
import DocumentModel from '@/models/document';

export type SearchResultItem = {
  id: string;
  type: 'Product' | 'Invoice' | 'Contact' | 'Document';
  title: string;
  subtitle: string;
  meta: Record<string, any>;
};

export type GlobalSearchResponse = {
  success: boolean;
  results: SearchResultItem[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

export async function globalSearch(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<GlobalSearchResponse> {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return {
        success: true,
        results: [],
        pagination: { page, limit, hasMore: false },
      };
    }

    const searchCondition = { $text: { $search: cleanQuery } };

    const [products, transactions, contacts, documents] = await Promise.all([
      Product.find(searchCondition, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .lean(),

      Transaction.find(searchCondition, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .populate('contact', 'name')
        .lean(),

      Contact.find(searchCondition, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .lean(),

      DocumentModel.find(searchCondition, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    const formattedResults: SearchResultItem[] = [
      ...products.map((p: any) => ({
        id: p._id.toString(),
        type: 'Product' as const,
        title: p.name,
        subtitle: `SKU: ${p.sku} | Stock: ${p.stockLevel}`,
        meta: {
          category: p.category,
          price: p.sellingPrice,
          isLowStock: p.stockLevel <= p.lowStockLimit,
        },
      })),

      ...transactions.map((t: any) => ({
        id: t._id.toString(),
        type: 'Invoice' as const,
        title: `Invoice #${t.invoiceNumber}`,
        subtitle: `${t.type} | Contact: ${t.contact?.name || 'N/A'}`,
        meta: {
          total: t.total,
          status: t.status,
          date: t.createdAt,
        },
      })),

      ...contacts.map((c: any) => ({
        id: c._id.toString(),
        type: 'Contact' as const,
        title: c.name,
        subtitle: `${c.type} | Balance: $${c.balance}`,
        meta: {
          email: c.email,
          companyName: c.companyName,
        },
      })),

      ...documents.map((d: any) => ({
        id: d._id.toString(),
        type: 'Document' as const,
        title: d.fileName,
        subtitle: `Tags: ${d.tags.join(', ')} | Type: ${d.fileType}`,
        meta: {
          url: d.fileUrl,
          size: d.fileSize,
          referenceModel: d.referenceModel,
        },
      })),
    ];

    const hasMore = formattedResults.length >= limit;

    return {
      success: true,
      results: formattedResults.slice(0, limit),
      pagination: {
        page,
        limit,
        hasMore,
      },
    };
  } catch (error: any) {
    console.error('Global Search Error:', error);
    return {
      success: false,
      results: [],
      pagination: { page, limit, hasMore: false },
    };
  }
}