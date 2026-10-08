'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const inputCls = `
    w-full px-4 py-3 text-sm
    bg-slate-900/60 border border-slate-800/80 rounded-xl
    text-slate-100 placeholder-slate-600
    focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent
    transition-all duration-300
    hover:border-slate-700/80
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">

      {/* ── Animated background orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large blue orb top-left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl animate-float" />
        {/* Indigo orb top-right */}
        <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-indigo-500/8 blur-3xl animate-float-slow" />
        {/* Violet orb bottom-left */}
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-violet-500/6 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        {/* Emerald orb bottom-right */}
        <div className="absolute -bottom-32 -right-20 w-72 h-72 rounded-full bg-emerald-500/6 blur-3xl animate-float-slow" style={{ animationDelay: '1.5s' }} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Card ── */}
      <div className="
        animate-scale-in
        relative z-10 w-full max-w-sm mx-4
        p-8 rounded-3xl
        bg-slate-900/70 backdrop-blur-2xl
        border border-slate-800/60
        shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(148,163,184,0.04)]
        noise
      ">

        {/* Decorative top glow */}
        <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 border-t border-white/20 mb-4 animate-float">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Rubel ERP
          </h1>
          <p className="text-slate-500 text-xs mt-1.5">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
              autoFocus
              className={inputCls}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                tabIndex={-1}
              >
                {showPw
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye    className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fade-up flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              py-3 px-4 rounded-xl text-sm font-bold text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              shadow-lg shadow-blue-500/30
              hover:shadow-blue-500/50 hover:scale-[1.02]
              transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              border-t border-white/10
              mt-2
            "
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Demo</p>
          <button
            type="button"
            onClick={() => { setEmail('admin@company.com'); setPassword('Password123!'); }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono hover:underline"
          >
            admin@company.com / Password123!
          </button>
        </div>
      </div>
    </div>
  );
}