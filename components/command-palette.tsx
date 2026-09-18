'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCommandPalette } from '@/hooks/use-command-palette';
import { cn } from '@/utils/format';

interface Item {
  href: string;
  title: string;
  type: string;
}

export function CommandPalette({ items, compact = false, className }: { items: Item[]; compact?: boolean; className?: string }) {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => items.filter((item) => `${item.title} ${item.type}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12),
    [items, query]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white',
          compact ? 'inline-flex px-3 py-2.5 lg:hidden' : 'hidden px-3 py-2 lg:flex',
          className
        )}
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
        {compact ? (
          <span className="text-sm">Quick search</span>
        ) : (
          <>
            <span>Search</span>
            <span className="rounded-lg border border-white/10 px-2 py-0.5 text-xs text-white/35">⌘ K</span>
          </>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 sm:pt-20 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0b0e14] shadow-panel" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
              <Search className="h-4 w-4 text-white/40" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, templates, pages, docs…"
                className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/30"
                aria-label="Search"
              />
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2 sm:max-h-[60vh] sm:p-3">
              {results.map((item) => (
                <Link
                  key={`${item.href}-${item.title}`}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <span>{item.title}</span>
                  <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-white/30">{item.type}</span>
                </Link>
              ))}
              {results.length === 0 && <p className="px-4 py-8 text-sm text-white/45">No matching results. Try project names, settings, templates or documentation.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
