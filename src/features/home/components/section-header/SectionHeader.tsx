import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import { motion } from 'framer-motion';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionLink?: string;
  children?: React.ReactNode; // Optional place for countdown timers or selectors
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionLink,
  children,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 select-none">
      {/* Title & Subtitle Group */}
      <div className="space-y-2 text-right md:text-right w-full md:w-auto">
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 justify-start items-start"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-gold font-tajawal">
            {title}
          </h2>
          {children}
        </motion.div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-muted-foreground font-tajawal leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* CTA action link */}
      {actionLabel && actionLink && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center self-end md:self-auto"
        >
          <Link
            to={actionLink}
            className="group flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold/80 transition-colors font-tajawal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            <span>{actionLabel}</span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default SectionHeader;
