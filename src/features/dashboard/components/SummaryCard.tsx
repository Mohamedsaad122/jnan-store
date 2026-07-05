import React from 'react';
import { Link } from 'react-router-dom';

import { useLanguageStore } from '@/store/language.store';
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Heart,
  Bell,
  ShieldAlert,
  Settings,
  LifeBuoy,
  LayoutDashboard,
  User,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { twMerge } from 'tailwind-merge';

interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  iconName?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  linkText?: string;
  linkPath?: string;
}

const getIcon = (name: string, className?: string) => {
  const props = { className: className || 'h-5 w-5 text-gold' };
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'User':
      return <User {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'MapPin':
      return <MapPin {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Bell':
      return <Bell {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'LifeBuoy':
      return <LifeBuoy {...props} />;
    default:
      return null;
  }
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  iconName,
  change,
  trend,
  linkText,
  linkPath,
  className,
  ...props
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  return (
    <Card
      className={twMerge(
        'p-5 border-border/40 hover:border-gold/30 shadow-xs flex flex-col justify-between transition-all group relative overflow-hidden bg-card/60 backdrop-blur-xs select-none',
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        {/* Header containing title & icon */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-tajawal">
            {title}
          </span>
          {iconName && (
            <div className="h-9 w-9 rounded-xl bg-gold/10 flex items-center justify-center transition-all group-hover:bg-gold/20">
              {getIcon(iconName, 'h-4.5 w-4.5 text-gold')}
            </div>
          )}
        </div>

        {/* Content containing value & trend stats */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 justify-start">
            <span className="text-xl md:text-2xl font-black text-primary tracking-tight font-sans">
              {value}
            </span>
            {trend && trend !== 'neutral' && (
              <span
                className={twMerge(
                  'flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md font-sans',
                  trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                )}
                dir="ltr"
              >
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 shrink-0" />
                )}
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-muted-foreground leading-normal">{description}</p>
          )}
        </div>
      </div>

      {/* Link action if path is configured */}
      {linkText && linkPath && (
        <div className="border-t border-border/10 pt-3 mt-4">
          <Link
            to={linkPath}
            className="text-xs font-bold text-primary hover:text-gold transition-colors flex items-center gap-1 w-fit justify-start"
          >
            <span>{linkText}</span>
            {isRtl ? (
              <ChevronLeft className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Link>
        </div>
      )}
    </Card>
  );
};

export default SummaryCard;
