import React, { useState } from 'react';
import { ProductImage } from '@/types/domain';
import { twMerge } from 'tailwind-merge';

interface ImageGalleryProps {
  images: ProductImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: 'center' });

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted/40 border flex items-center justify-center text-muted-foreground text-xs select-none">
        لا توجد صور للمنتج
      </div>
    );
  }

  const activeImage = images[activeIdx] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.6)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center',
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Viewport with Zoom */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/40 cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label={activeImage.altAr || 'صورة المنتج'}
      >
        <img
          src={activeImage.url}
          alt={activeImage.altAr || 'صورة المنتج'}
          className="h-full w-full object-cover transition-transform duration-150 ease-out"
          style={zoomStyle}
          loading="lazy"
        />

        {/* Subtle border overlay */}
        <div className="absolute inset-0 rounded-2xl border border-black/5 pointer-events-none" />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto pb-1"
          role="listbox"
          aria-label="معرض صور المنتج"
        >
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={img.id}
                onClick={() => setActiveIdx(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
                className={twMerge(
                  'relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted/10 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  isActive
                    ? 'border-gold ring-1 ring-gold shadow-sm'
                    : 'border-border/60 hover:border-gold/40'
                )}
                role="option"
                aria-selected={isActive}
                aria-label={`عرض الصورة ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.altAr || `تصغير صورة ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
