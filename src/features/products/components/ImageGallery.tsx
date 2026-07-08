import React, { useState, useEffect } from 'react';
import { ProductImage } from '@/types/domain';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ImageGalleryProps {
  images: ProductImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: 'center' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIdx, setFullscreenIdx] = useState(0);

  // 1. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowLeft') {
        if (isFullscreen) {
          setFullscreenIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        } else {
          setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (isFullscreen) {
          setFullscreenIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        } else {
          setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted/40 border flex items-center justify-center text-muted-foreground text-xs select-none">
        لا توجد صور للمنتج
      </div>
    );
  }

  const activeImage = images[activeIdx] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only zoom on non-mobile devices
    if (window.innerWidth < 768) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.5)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center',
    });
  };

  const openFullscreen = () => {
    setFullscreenIdx(activeIdx);
    setIsFullscreen(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Viewport with Zoom */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/40 cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label={activeImage.altAr || 'صورة المنتج'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipeThreshold = 50;
              if (info.offset.x > swipeThreshold) {
                // Swipe left (depending on direction, let's decrement idx)
                setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              } else if (info.offset.x < -swipeThreshold) {
                // Swipe right
                setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              }
            }}
          >
            <OptimizedImage
              src={activeImage.url}
              alt={activeImage.altAr || 'صورة المنتج'}
              aspectRatioClassName="w-full h-full"
              className="h-full w-full object-cover transition-transform duration-100 ease-out"
              style={zoomStyle}
              preload={activeIdx === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Fullscreen Expansion Shortcut button */}
        <button
          onClick={openFullscreen}
          className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-card/85 dark:bg-card/75 border border-border/30 text-muted-foreground hover:text-gold hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="توسيع الصورة"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Subtle border overlay */}
        <div className="absolute inset-0 rounded-2xl border border-black/5 pointer-events-none" />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none"
          role="listbox"
          aria-label="معرض صور المنتج"
        >
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={img.id}
                onClick={() => setActiveIdx(idx)}
                className={twMerge(
                  'relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted/10 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer',
                  isActive
                    ? 'border-gold ring-1 ring-gold shadow-sm'
                    : 'border-border/60 hover:border-gold/45'
                )}
                role="option"
                aria-selected={isActive}
                aria-label={`عرض الصورة ${idx + 1}`}
              >
                <OptimizedImage
                  src={img.url}
                  alt={img.altAr || `تصغير صورة ${idx + 1}`}
                  aspectRatioClassName="w-full h-full"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Overlay Viewer Portal */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-6 font-tajawal">
            {/* Header controls row */}
            <div className="flex items-center justify-between text-white select-none">
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="إغلاق التكبير"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-sm font-bold font-sans">
                {fullscreenIdx + 1} / {images.length}
              </div>
              <div className="w-10 h-10" /> {/* Spacer alignment */}
            </div>

            {/* Main Slider Area */}
            <div className="flex-1 flex items-center justify-between gap-4 max-w-5xl mx-auto w-full">
              {/* Previous Button */}
              <button
                onClick={() =>
                  setFullscreenIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Viewport */}
              <div className="flex-1 flex items-center justify-center h-full max-h-[70vh] relative overflow-hidden">
                <motion.img
                  key={fullscreenIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={images[fullscreenIdx]?.url}
                  alt="عرض ملء الشاشة"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setFullscreenIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                }
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Navigation */}
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none max-w-xl mx-auto w-full">
              {images.map((img, idx) => {
                const isActive = idx === fullscreenIdx;
                return (
                  <button
                    key={img.id}
                    onClick={() => setFullscreenIdx(idx)}
                    className={twMerge(
                      'relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer',
                      isActive
                        ? 'border-gold scale-105 shadow-md'
                        : 'border-white/20 hover:border-white/40'
                    )}
                  >
                    <OptimizedImage
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      aspectRatioClassName="w-full h-full"
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
