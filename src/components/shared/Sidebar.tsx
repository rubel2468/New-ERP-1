'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export type SidebarItem = {
  name: string;
  href: string;
  icon: string;
  color: string;   // accent color class
};

const navigation: SidebarItem[] = [
  { name: 'Dashboard',        href: '/dashboard', icon: '📊', color: 'blue' },
  { name: 'Inventory',        href: '/inventory', icon: '📦', color: 'indigo' },
  { name: 'Sales & Invoices', href: '/sales',     icon: '📄', color: 'emerald' },
  { name: 'Payments',         href: '/payments',  icon: '💳', color: 'emerald' },
  { name: 'Contacts',         href: '/contacts',  icon: '👥', color: 'violet' },
  { name: 'Employees',        href: '/employees', icon: '🧑‍💼', color: 'indigo' },
  { name: 'Expenses',         href: '/expenses',  icon: '💸', color: 'rose' },
  { name: 'Cash Book',        href: '/cash-book', icon: '💰', color: 'amber' },
  { name: 'Documents Vault',  href: '/documents', icon: '🔒', color: 'amber' },
];

const activeColorMap: Record<string, string> = {
  blue:    'from-blue-600/80    to-indigo-600/80    shadow-blue-500/20    border-blue-400/20',
  indigo:  'from-indigo-600/80  to-violet-600/80    shadow-indigo-500/20  border-indigo-400/20',
  emerald: 'from-emerald-600/80 to-teal-600/80      shadow-emerald-500/20 border-emerald-400/20',
  violet:  'from-violet-600/80  to-purple-600/80    shadow-violet-500/20  border-violet-400/20',
  amber:   'from-amber-600/80   to-orange-600/80    shadow-amber-500/20   border-amber-400/20',
  rose:    'from-rose-600/80    to-pink-600/80      shadow-rose-500/20    border-rose-400/20',
};

export default function Sidebar() {
  const pathname          = usePathname();
  const { data: session } = useSession();

  const userName  = session?.user?.name  || 'User';
  const userEmail = session?.user?.email || '';
  const initials  = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-slate-800/50 bg-slate-950 shadow-2xl relative overflow-hidden">

      {/* Background gradient + noise */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950" />
      <div className="pointer-events-none absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />

      {/* ── Brand ── */}
      <div className="relative z-10 px-5 py-6 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo icon with glow */}
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 border-t border-white/20">
              <span className="text-lg leading-none">🛡️</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent leading-none">
                Apex ERP
              </h1>
              <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider mt-0.5">Management Suite</p>
            </div>
          </div>
          <span className="text-[8px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/25">
            PRO
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 flex-1 px-3 py-5 space-y-1">
        {navigation.map((item, idx) => {
          const isActive   = pathname.startsWith(item.href);
          const colorClass = activeColorMap[item.color] ?? activeColorMap.blue;

          return (
            <Link
              key={item.name}
              href={item.href}
              style={{ animationDelay: `${idx * 0.06}s` }}
              className={`
                group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300 relative overflow-hidden
                animate-slide-in-left
                ${isActive
                  ? `bg-gradient-to-r ${colorClass} text-white shadow-lg border-t`
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 hover:translate-x-1'
                }
              `}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-white/50" />
              )}

              {/* Active background shimmer */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50" />
              )}

              <span className={`
                text-base relative z-10 transition-all duration-300
                ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}
              `}>
                {item.icon}
              </span>
              <span className="relative z-10 text-[13px]">{item.name}</span>

              {/* Hover glow */}
              {!isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-600">
                  →
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User Profile Footer ── */}
      <div className="relative z-10 px-3 pb-5 pt-3 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/30 transition-colors group cursor-default">
          {/* Avatar */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-lg border border-white/10">
              {initials}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 glow-dot" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-300 truncate leading-none">{userName}</div>
            <div className="text-[9px] text-slate-600 truncate mt-0.5">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
