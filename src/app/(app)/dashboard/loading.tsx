export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-40 bg-slate-800 rounded-lg" />
          <div className="h-4 w-64 bg-slate-800/60 rounded mt-2" />
        </div>
        <div className="h-7 w-44 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Row 1 — 3 financial cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <div className="flex justify-between mb-4">
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-9 w-32 bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-800/60 rounded mt-3" />
          </div>
        ))}
      </div>

      {/* Row 2 — 3 inventory/contact cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <div className="flex justify-between mb-4">
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-9 w-16 bg-slate-800 rounded" />
            <div className="h-3 w-24 bg-slate-800/60 rounded mt-3" />
          </div>
        ))}
      </div>

      {/* Row 3 — 2 big panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl space-y-4">
            <div className="h-6 w-40 bg-slate-800 rounded" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex justify-between py-2 border-b border-slate-800/30">
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-4 w-16 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}