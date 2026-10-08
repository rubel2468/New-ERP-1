export default function PageLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-800/60 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="bg-slate-900/60 px-6 py-4 flex gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-20 bg-slate-800 rounded" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-8 border-t border-slate-800/50">
            <div className="h-4 w-32 bg-slate-800/60 rounded" />
            <div className="h-4 w-16 bg-slate-800/60 rounded" />
            <div className="h-4 w-28 bg-slate-800/60 rounded" />
            <div className="h-4 w-20 bg-slate-800/60 rounded" />
            <div className="h-6 w-16 bg-slate-800/60 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}