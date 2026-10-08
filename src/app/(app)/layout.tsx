import Sidebar from '@/components/shared/Sidebar';
import SearchBar from '@/components/shared/SearchBar';
import UserHeader from '@/components/shared/UserHeader';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex w-full min-h-screen bg-slate-950">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Top Header Bar ── */}
          <header className="
            sticky top-0 z-40
            h-14 border-b border-slate-800/50
            bg-slate-950/80 backdrop-blur-xl
            px-6 flex items-center justify-between
            shadow-[0_1px_0_rgba(148,163,184,0.06)]
          ">
            {/* Left: Breadcrumb-style search */}
            <div className="flex-1 max-w-md">
              <SearchBar />
            </div>

            {/* Right: User info */}
            <UserHeader />
          </header>

          {/* ── Page Content ── */}
          <main className="flex-1 p-7 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}