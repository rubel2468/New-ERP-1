import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({ filename: 'customer.db', driver: sqlite3.Database });
}

export async function POST(request: Request) {
  const { id, paymentMethod } = await request.json();
  const db = await getDb();
  
  const customer = await db.get('SELECT * FROM customers WHERE id = ?', id);
  
  if (!customer) {
    await db.close();
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  
  await db.run(
    'UPDATE customers SET paid = 1, payment_method = ? WHERE id = ?', 
    paymentMethod, 
    id
  );
  
  await db.close();
  return NextResponse.json({ success: true });
}
