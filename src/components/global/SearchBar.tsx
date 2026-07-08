import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdvancedSearch from '@/components/global/AdvancedSearch';

export const SearchBar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-ring max-w-[240px] md:max-w-[280px] cursor-pointer"
        aria-label="البحث عن المنتجات"
      >
        <span className="flex items-center">
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          <span className="font-tajawal text-[11px] md:text-xs">البحث عن المنتجات...</span>
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[9px] font-medium opacity-80">
          <span>⌘</span>K
        </kbd>
      </button>

      <AdvancedSearch isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
};

export default SearchBar;
