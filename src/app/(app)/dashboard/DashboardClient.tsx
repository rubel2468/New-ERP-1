'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ── Animated number counter ── */
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    function step(now: number) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(eased * value);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ── Stat card with animation ── */
interface StatCardProps {
  label: string;
  icon: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  link?: string;
  linkLabel?: string;
  badge?: React.ReactNode;
  accentClass: string;           // e.g. 'blue'  → drives color tokens
  glowClass: string;             // card-glow-blue etc.
  delay: string;                 // stagger-1 … stagger-6
  valueColor?: string;
}

const accentMap: Record<string, { bg: string; border: string; text: string; orb: string; orbHover: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    orb: 'bg-blue-500/10',    orbHover: 'group-hover:bg-blue-500/25' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   orb: 'bg-amber-500/10',   orbHover: 'group-hover:bg-amber-500/25' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', orb: 'bg-emerald-500/10', orbHover: 'group-hover:bg-emerald-500/25' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    orb: 'bg-rose-500/10',    orbHover: 'group-hover:bg-rose-500/25' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  orb: 'bg-indigo-500/10',  orbHover: 'group-hover:bg-indigo-500/25' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400',  orb: 'bg-violet-500/10',  orbHover: 'group-hover:bg-violet-500/25' },
};

function StatCard({
  label, icon, value, prefix = '', suffix = '', decimals = 0,
  link, linkLabel, badge, accentClass, glowClass, delay, valueColor,
}: StatCardProps) {
  const a = accentMap[accentClass] ?? accentMap.blue;

  return (
    <div
      className={`
        animate-fade-up ${delay}
        relative group overflow-hidden noise
        p-6 rounded-2xl border border-slate-800/70
        bg-slate-900/50 backdrop-blur-xl shadow-2xl
        card-glow ${glowClass}
      `}
    >
      {/* Animated background orb */}
      <div
        className={`
          absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl
          transition-all duration-700
          ${a.orb} ${a.orbHover}
          animate-float
        `}
      />

      {/* Secondary tiny orb */}
      <div className={`absolute bottom-2 left-2 w-16 h-16 rounded-full blur-2xl opacity-30 ${a.orb} animate-float-slow`} />

      {/* Header row */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">
          {label}
        </span>
        <div className={`p-2.5 rounded-xl ${a.bg} border ${a.border} text-base shadow-inner`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className={`text-4xl font-black tracking-tight relative z-10 mb-1 ${valueColor ?? 'text-white'}`}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>

      {/* Badge if provided */}
      {badge && <div className="mt-2 relative z-10">{badge}</div>}

      {/* Link */}
      {link && linkLabel && (
        <Link
          href={link}
          className={`mt-3 inline-flex items-center gap-1 text-[11px] font-bold ${a.text} opacity-60 hover:opacity-100 transition-opacity relative z-10 group/link`}
        >
          {linkLabel}
          <span className="transform transition-transform group-hover/link:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}

/* ── Types ── */
interface DashboardClientProps {
  data: {
    totalSales: number;
    totalPurchases: number;
    netProfit: number;
    profitMarginPct: string;
    lowStockCount: number;
    totalProducts: number;
    totalContacts: number;
    recentTransactions: any[];
    lowStockItems: any[];
  };
  lastUpdated: string;
}

/* ── Main exported component ── */
export default function DashboardClient({ data, lastUpdated }: DashboardClientProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so CSS animations fire after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const profitPositive = data.netProfit >= 0;

  return (
    <div className={`space-y-10 max-w-7xl mx-auto transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* ══ Hero Header ══ */}
      <div className="animate-fade-up stagger-1 relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl aurora-bg noise">
        {/* Decorative large orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-16 right-0 w-64 h-64 rounded-full bg-indigo-500/8 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute top-8 right-1/3 w-40 h-40 rounded-full bg-violet-500/6 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Dashboard</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-shimmer leading-none mb-2">
              Apex ERP
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Real-time business intelligence — stocks, ledgers, and financial performance at a glance.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Last synced</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">{lastUpdated}</div>
            </div>
            <Link
              href="/sales/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30
                hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300
                border-t border-white/10"
            >
              <span className="text-base">➕</span> New Transaction
            </Link>
          </div>
        </div>
      </div>

      {/* ══ Row 1: Financial KPIs ══ */}
      <div>
        <div className="animate-fade-up stagger-2 flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Financial Overview</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            label="Total Revenue"
            icon="💰"
            value={data.totalSales}
            prefix="$"
            decimals={2}
            accentClass="blue"
            glowClass="card-glow-blue"
            delay="stagger-3"
            link="/sales"
            linkLabel="View all invoices"
          />
          <StatCard
            label="Total Purchases"
            icon="🛒"
            value={data.totalPurchases}
            prefix="$"
            decimals={2}
            accentClass="amber"
            glowClass="card-glow-amber"
            delay="stagger-4"
          />
          <StatCard
            label="Net Profit"
            icon={profitPositive ? '📈' : '📉'}
            value={Math.abs(data.netProfit)}
            prefix={profitPositive ? '+$' : '-$'}
            decimals={2}
            accentClass={profitPositive ? 'emerald' : 'rose'}
            glowClass={profitPositive ? 'card-glow-emerald' : 'card-glow-rose'}
            delay="stagger-5"
            valueColor={profitPositive ? 'text-emerald-400' : 'text-rose-400'}
            badge={
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border
                ${profitPositive
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {profitPositive ? '↑' : '↓'} {data.profitMarginPct}% margin
              </span>
            }
          />
        </div>
      </div>

      {/* ══ Row 2: Operational KPIs ══ */}
      <div>
        <div className="animate-fade-up stagger-3 flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-400 to-violet-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Inventory & Contacts</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            label="Low Stock Alerts"
            icon="⚠️"
            value={data.lowStockCount}
            accentClass={data.lowStockCount > 0 ? 'rose' : 'emerald'}
            glowClass={data.lowStockCount > 0 ? 'card-glow-rose' : 'card-glow-emerald'}
            delay="stagger-4"
            link="/inventory"
            linkLabel="Manage inventory"
            badge={
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border
                ${data.lowStockCount > 0
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {data.lowStockCount > 0 ? '🔴 Needs Restock' : '🟢 All Healthy'}
              </span>
            }
          />
          <StatCard
            label="Product Catalog"
            icon="📦"
            value={data.totalProducts}
            accentClass="indigo"
            glowClass="card-glow-indigo"
            delay="stagger-5"
            link="/inventory/new"
            linkLabel="Add product"
          />
          <StatCard
            label="Total Contacts"
            icon="👥"
            value={data.totalContacts}
            accentClass="violet"
            glowClass="card-glow-violet"
            delay="stagger-6"
            link="/contacts/new"
            linkLabel="Add contact"
          />
        </div>
      </div>

      {/* ══ Row 3: Tables ══ */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Recent Transactions */}
        <div className="animate-fade-up stagger-5 noise relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm">📄</div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Recent Transactions</h3>
                <p className="text-[10px] text-slate-600">Latest 5 entries</p>
              </div>
            </div>
            <Link href="/sales" className="text-[11px] font-bold text-blue-400/60 hover:text-blue-400 transition-colors group">
              View all <span className="group-hover:translate-x-0.5 inline-block transition-transform">→</span>
            </Link>
          </div>

          <div className="relative z-10">
            {data.recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-600">
                <span className="text-4xl opacity-40">📭</span>
                <p className="text-sm">No transactions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/40">
                {data.recentTransactions.map((tx: any, i: number) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors group/row"
                    style={{ animationDelay: `${0.4 + i * 0.07}s` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Type dot */}
                      <div className={`w-1.5 h-5 rounded-full shrink-0 ${tx.type === 'Sale' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div className="min-w-0">
                        <Link href={`/sales/${tx._id}`} className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-2">
                          {tx.invoiceNumber}
                        </Link>
                        <p className="text-[10px] text-slate-600 truncate">{tx.contact?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wide border
                        ${tx.type === 'Sale'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <span className="text-sm font-black text-white">${tx.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="animate-fade-up stagger-6 noise relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <div className={`pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${data.lowStockCount > 0 ? 'bg-rose-500/8' : 'bg-emerald-500/5'}`} />

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border
                ${data.lowStockCount > 0
                  ? 'bg-rose-500/10 border-rose-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/20'
                }`}
              >
                {data.lowStockCount > 0 ? '⚠️' : '✅'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Stock Watchlist</h3>
                <p className="text-[10px] text-slate-600">Items below threshold</p>
              </div>
            </div>
            {data.lowStockCount > 0 && (
              <Link href="/inventory" className="text-[11px] font-bold text-rose-400/60 hover:text-rose-400 transition-colors group">
                Manage <span className="group-hover:translate-x-0.5 inline-block transition-transform">→</span>
              </Link>
            )}
          </div>

          <div className="relative z-10">
            {data.lowStockCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <span className="text-5xl animate-bounce-gentle">✅</span>
                <p className="text-sm text-emerald-400/70 font-semibold">All stock levels healthy!</p>
                <p className="text-xs text-slate-600">No items below threshold.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/40 max-h-72 overflow-y-auto">
                {data.lowStockItems.map((prod: any, i: number) => {
                  const pct = prod.lowStockLimit > 0 ? Math.max(0, Math.min(100, (prod.stockLevel / prod.lowStockLimit) * 100)) : 0;
                  return (
                    <div key={prod._id} className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{prod.name}</h4>
                          <p className="text-[10px] font-mono text-slate-600">SKU: {prod.sku}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-rose-400">{prod.stockLevel}</span>
                          <span className="text-[10px] text-slate-600"> / {prod.lowStockLimit} min</span>
                        </div>
                      </div>
                      {/* Stock progress bar */}
                      <div className="w-full h-1 bg-slate-800/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ Quick Actions Footer ══ */}
      <div className="animate-fade-up stagger-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-slate-500 to-slate-700" />
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/sales/new',      icon: '📄', label: 'New Invoice',   accent: 'hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300' },
            { href: '/inventory/new',  icon: '📦', label: 'Add Product',   accent: 'hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300' },
            { href: '/contacts/new',   icon: '👤', label: 'Add Contact',   accent: 'hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-300' },
            { href: '/documents',      icon: '🔒', label: 'Upload Doc',    accent: 'hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-300' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl
                border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm
                text-slate-400 text-sm font-semibold
                transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-0.5
                ${action.accent}
              `}
            >
              <span className="text-lg">{action.icon}</span>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
