import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface CommandProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Command: React.FC<CommandProps> = ({
  isOpen,
  onClose,
  placeholder = 'البحث عن المنتجات، القهوة، المكسرات...',
  className,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2 }}
            role="combobox"
            aria-expanded="true"
            aria-haspopup="listbox"
            className={twMerge(
              'relative z-10 w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-lg text-card-foreground',
              className
            )}
          >
            {/* Search Input */}
            <div className="flex items-center border-b px-3">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className="flex h-12 w-full rounded-md bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-right font-tajawal"
              />
            </div>

            {/* List Items wrapper */}
            <div className="max-h-[300px] overflow-y-auto p-2 text-right">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Command;
