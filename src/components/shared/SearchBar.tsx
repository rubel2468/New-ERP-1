'use client';

import { useState, useEffect, useRef } from 'react';
import { globalSearch, SearchResultItem } from '@/actions/search';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const res = await globalSearch(query, 1, 8);
        if (res.success) {
          setResults(res.results);
        }
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, invoices, ledgers..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all"
          onFocus={() => query.trim().length > 1 && setIsOpen(true)}
        />
        <div className="absolute left-3.5 top-2.5 text-slate-500">🔍</div>
        {loading && <div className="absolute right-3.5 top-2.5 animate-spin text-slate-400">🔄</div>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800/80 rounded-xl shadow-2xl backdrop-blur-md max-h-96 overflow-y-auto z-50">
          <div className="p-2 border-b border-slate-800/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Search Results
          </div>
          <div className="divide-y divide-slate-800/50">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/${item.type.toLowerCase()}s/${item.id}`}
                onClick={() => setIsOpen(false)}
                className="block p-3 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    item.type === 'Product' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.type === 'Invoice' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    item.type === 'Contact' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim().length > 1 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 text-center bg-slate-900/95 border border-slate-800/80 rounded-xl shadow-2xl text-sm text-slate-400 z-50">
          No matches found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
