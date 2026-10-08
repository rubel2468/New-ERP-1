export default function Loading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/50">
          <div className="h-4 w-32 bg-slate-800/50 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-800/50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="h-4 flex-1 bg-slate-800/50 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-800/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}