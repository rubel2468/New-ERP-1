import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

async function getDb() {
  return open({ filename: 'customer.db', driver: sqlite3.Database });
}

export async function GET() {
  const db = await getDb();
  const customers = await db.all('SELECT * FROM customers');
  await db.close();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const { name, type, amount } = await request.json();
  const id = uuidv4();
  const db = await getDb();
  await db.run(
    'INSERT INTO customers (id, name, type, amount_due) VALUES (?,?,?,?)',
    id,
    name,
    type,
    amount,
  );
  await db.close();
  return NextResponse.json({ id }, { status: 201 });
}
