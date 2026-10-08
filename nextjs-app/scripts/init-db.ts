import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
  const db = await open({ filename: 'customer.db', driver: sqlite3.Database });
  
  // Drop table to reset schema and include the payment_method column
  await db.exec(`DROP TABLE IF EXISTS customers;`);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('cash','credit')) NOT NULL,
      amount_due REAL NOT NULL,
      paid INTEGER DEFAULT 0,
      payment_method TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await db.close();
  console.log('Database initialized with payment_method column.');
})();
