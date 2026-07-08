import React, { useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface CommandProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onVoiceClick?: () => void;
  isListening?: boolean;
}

export const Command: React.FC<CommandProps> = ({
  isOpen,
  onClose,
  placeholder = 'البحث عن المنتجات، القهوة، المكسرات...',
  className,
  children,
  value,
  onChange,
  onKeyDown,
  onVoiceClick,
  isListening = false,
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

  // Handle keydown actions (Escape for closing, Tab for focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const dialog = inputRef.current?.closest('[role="dialog"]');
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => {
          return !el.hasAttribute('disabled') && el.offsetParent !== null;
        });

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
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
            <div className="flex items-center border-b px-3 justify-between">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="flex h-12 w-full bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-right font-tajawal"
              />
              {onVoiceClick && (
                <button
                  type="button"
                  onClick={onVoiceClick}
                  className={`p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer shrink-0 ${
                    isListening
                      ? 'text-red-500 animate-pulse bg-red-500/10'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  aria-label="البحث الصوتي"
                >
                  <Mic className="h-4 w-4" />
                </button>
              )}
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
