import React from 'react';
import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  // Generate initials for avatar fallback if no image is provided
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md shadow-sm select-none text-right">
      <div>
        {/* Rating Stars */}
        <div className="flex items-center justify-start gap-0.5 text-gold mb-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`h-4 w-4 ${
                idx < Math.floor(testimonial.rating) ? 'fill-gold text-gold' : 'text-muted/40'
              }`}
            />
          ))}
        </div>

        {/* Review Comment */}
        <p className="text-sm text-primary/95 dark:text-foreground/90 italic font-tajawal leading-relaxed mb-6 select-text">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      {/* Customer Info Row */}
      <div className="flex items-center gap-3 justify-start border-t border-border/20 pt-4 mt-auto">
        <Avatar
          src={testimonial.avatarUrl}
          alt={testimonial.name}
          fallbackText={getInitials(testimonial.name)}
          className="border border-gold/10"
        />
        <div className="text-right">
          <h4 className="text-xs sm:text-sm font-bold text-primary dark:text-foreground font-tajawal">
            {testimonial.name}
          </h4>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium font-tajawal">
            {testimonial.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
