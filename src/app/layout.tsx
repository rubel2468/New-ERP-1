import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Apex ERP & Smart Vault',
  description: 'Manage products, stocks, sales ledgers, and dynamic documents attachments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 min-h-screen text-slate-100`}>
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}