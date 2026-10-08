import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-gray-100 text-gray-900`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md flex flex-col z-10">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">ERP System</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              Dashboard
            </Link>
            <Link href="/new" className="block px-4 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              New Customer
            </Link>
            <Link href="/pay" className="block px-4 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              Payment Option
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
