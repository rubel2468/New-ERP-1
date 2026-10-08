import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import Product from '../models/product';
import Contact from '../models/contact';
import Transaction from '../models/transaction';
import DocumentModel from '../models/document';
import fs from 'fs';
import path from 'path';

// Load .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.log('No .env.local file found, using defaults.');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seedDatabase() {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Database connected successfully.');

    // Clear existing data by dropping collections to remove conflicting indexes
    console.log('Clearing old collections & indexes...');
    const collections = await mongoose.connection.db!.listCollections().toArray();
    for (const col of collections) {
      try {
         await mongoose.connection.db!.dropCollection(col.name);
        console.log(`Dropped collection: ${col.name}`);
      } catch (err) {
        // Ignore errors
      }
    }

    // 1. Create Users
    console.log('Seeding Users...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    const adminUser = await User.create({
      name: 'Jane Doe Admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active',
    });

    const staffUser = await User.create({
      name: 'John Staff',
      email: 'staff@company.com',
      password: hashedPassword,
      role: 'Staff',
      status: 'Active',
    });

    // 2. Create Contacts (Customers and Suppliers)
    console.log('Seeding Contacts...');
    const customer1 = await Contact.create({
      name: 'Alice Customer',
      type: 'Customer',
      email: 'alice@client.com',
      phone: '+1555123456',
      companyName: 'Acme Corporates',
      balance: 1500.0, // Owe us $1500
      createdBy: adminUser._id,
    });

    const supplier1 = await Contact.create({
      name: 'Bob Supplier',
      type: 'Supplier',
      email: 'bob@distribution.com',
      phone: '+1555987654',
      companyName: 'Global Wholesale Group',
      balance: -3000.0, // We owe them $3000
      createdBy: adminUser._id,
    });

    // 3. Create Products
    console.log('Seeding Products...');
    const product1 = await Product.create({
      name: 'Premium Wireless Headphones',
      sku: 'WHP-882-BLK',
      barcode: '882103847291',
      description: 'Noise-cancelling over-ear wireless headphones with premium sound.',
      category: 'Electronics',
      purchasePrice: 120.0,
      sellingPrice: 199.99,
      stockLevel: 45,
      lowStockLimit: 10,
      createdBy: adminUser._id,
    });

    const product2 = await Product.create({
      name: 'Ergonomic Office Chair',
      sku: 'CHR-990-GRY',
      barcode: '990204738291',
      description: 'Breathable mesh chair with lumber support.',
      category: 'Furniture',
      purchasePrice: 85.0,
      sellingPrice: 149.99,
      stockLevel: 4, // Will trigger low-stock warning
      lowStockLimit: 5,
      createdBy: staffUser._id,
    });

    // 4. Create Transactions (Sales & Purchases Invoices)
    console.log('Seeding Invoices/Transactions...');
    await Transaction.create({
      invoiceNumber: 'INV-20260819-1001',
      type: 'Sale',
      contact: customer1._id,
      items: [
        {
          product: product1._id,
          quantity: 2,
          unitPrice: 199.99,
          totalPrice: 399.98,
        },
      ],
      subTotal: 399.98,
      tax: 32.0,
      total: 431.98,
      status: 'Paid',
      notes: 'Initial order payment processed.',
      createdBy: adminUser._id,
    });

    await Transaction.create({
      invoiceNumber: 'PO-20260819-2001',
      type: 'Purchase',
      contact: supplier1._id,
      items: [
        {
          product: product2._id,
          quantity: 10,
          unitPrice: 85.0,
          totalPrice: 850.0,
        },
      ],
      subTotal: 850.0,
      tax: 0.0,
      total: 850.0,
      status: 'Pending',
      notes: 'Bulk stock restock shipment pending arrival.',
      createdBy: staffUser._id,
    });

    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
seedDatabase();
