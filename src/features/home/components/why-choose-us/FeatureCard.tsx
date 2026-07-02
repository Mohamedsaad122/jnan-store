import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delayIndex?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delayIndex = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: delayIndex * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative flex flex-col items-start text-right p-6 rounded-2xl border border-border/50 bg-card hover:bg-cardamom/5 dark:hover:bg-cardamom/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-gold/30 focus-within:ring-2 focus-within:ring-ring select-none"
    >
      {/* Decorative organic background shape */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 via-transparent to-transparent rounded-tr-2xl pointer-events-none" />

      {/* Premium Icon Circle */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary text-gold transition-theme shadow-inner mb-5">
        <Icon className="h-5.5 w-5.5" />
      </div>

      {/* Feature Title */}
      <h3 className="text-base sm:text-lg font-bold text-primary dark:text-foreground group-hover:text-gold transition-colors font-tajawal mb-2 select-text">
        {title}
      </h3>

      {/* Feature Description */}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed select-text font-tajawal">
        {description}
      </p>

      {/* Subtle border outline decoration */}
      <div className="absolute inset-0 border border-transparent group-hover:border-gold/20 rounded-2xl pointer-events-none transition-theme" />
    </motion.div>
  );
};

export default FeatureCard;
