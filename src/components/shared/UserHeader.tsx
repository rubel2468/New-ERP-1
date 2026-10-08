'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function UserHeader() {
  const { data: session, status } = useSession();
  const [hovered, setHovered]     = useState(false);

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-4 w-20 bg-slate-800 rounded" />
        <div className="w-8 h-8 bg-slate-800 rounded-full" />
      </div>
    );
  }

  const userName = session.user.name  || 'User';
  const email    = session.user.email || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="animate-fade-in flex items-center gap-3">

      {/* Name + email */}
      <div className="hidden sm:block text-right">
        <div className="text-xs font-bold text-slate-300 leading-none">{userName}</div>
        <div className="text-[9px] text-slate-600 mt-0.5 truncate max-w-[140px]">{email}</div>
      </div>

      {/* Avatar with glow ring on hover */}
      <div
        className="relative cursor-default"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Glow ring */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-500
          ${hovered ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-950 scale-110' : 'scale-100 ring-0'}
        `} />
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-xs shadow-lg border border-white/10 relative z-10">
          {initials}
        </div>
        {/* Online dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 glow-dot z-20" />
      </div>

      {/* Logout */}
      <button
        onClick={() =>
          signOut({ redirect: false }).then(() => {
            window.location.href = '/login';
          })
        }
        title="Sign out"
        className="
          p-2 rounded-xl text-slate-500 hover:text-rose-400
          border border-transparent hover:border-rose-500/25 hover:bg-rose-500/8
          transition-all duration-300 group
        "
      >
        <LogOut className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
