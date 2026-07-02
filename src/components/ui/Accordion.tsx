/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface AccordionContextType {
  activeValue: string | null;
  toggleValue: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const Accordion: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const toggleValue = (value: string) => {
    setActiveValue(activeValue === value ? null : value);
  };

  return (
    <AccordionContext.Provider value={{ activeValue, toggleValue }}>
      <div className={twMerge('w-full border-y', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  return (
    <div className={twMerge('border-b border-border py-1 last:border-0', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger: React.FC<{
  value?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used inside Accordion');

  const isOpen = context.activeValue === value;

  return (
    <button
      onClick={() => value && context.toggleValue(value)}
      className={twMerge(
        'flex w-full items-center justify-between py-4 font-tajawal font-medium transition-all hover:underline text-right',
        className
      )}
    >
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </motion.div>
      <span className="text-sm">{children}</span>
    </button>
  );
};

export const AccordionContent: React.FC<{
  value?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used inside Accordion');

  const isOpen = context.activeValue === value;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={twMerge('pb-4 pt-0 text-sm text-muted-foreground text-right', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Accordion;
