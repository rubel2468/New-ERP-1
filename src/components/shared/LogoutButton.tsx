'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        signOut({ redirect: false }).then(() => {
          window.location.href = '/login';
        });
      }}
      className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800/40"
      title="Logout"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
