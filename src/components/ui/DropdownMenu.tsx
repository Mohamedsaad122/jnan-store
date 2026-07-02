/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface DropdownContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownContext.Provider value={{ isOpen, setOpen, triggerRef }}>
      <div className="relative inline-block text-right">{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<{ children: React.ReactElement<any> }> = ({ children }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used inside DropdownMenu');

  return React.cloneElement(children, {
    ref: context.triggerRef,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      context.setOpen(!context.isOpen);
      if (children.props && typeof children.props === 'object' && 'onClick' in children.props) {
        (children.props as any).onClick(e);
      }
    },
  } as any);
};

export const DropdownMenuContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be used inside DropdownMenu');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        context.isOpen &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        context.triggerRef.current &&
        !context.triggerRef.current.contains(e.target as Node)
      ) {
        context.setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [context]);

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={twMerge(
            'absolute left-0 mt-2 w-56 origin-top-left rounded-lg border bg-card p-1 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50 text-card-foreground',
            className
          )}
        >
          <div onClick={() => context.setOpen(false)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DropdownMenuItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex w-full items-center rounded-md px-3 py-2 text-right text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground',
        className
      )}
    >
      {children}
    </button>
  );
};
export default DropdownMenu;
