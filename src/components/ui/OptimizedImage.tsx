import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from './Skeleton';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  blurDataUrl?: string;
  aspectRatioClassName?: string;
  preload?: boolean;
}

// Elegant Jnan Store Dallah logo base64 placeholder for image loading errors
const DEFAULT_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23c4a054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%25" height="100%25"><rect width="100" height="100" fill="%231a1f16"/><circle cx="50" cy="50" r="25" stroke="%23c4a054" stroke-opacity="0.2"/><path d="M50 30v15M42 45h16M45 45c0 8 4 12 5 15 1 3 3 5 5 5s4-2 5-5c1-3 5-7 5-15M50 65c-6 0-10 4-10 10h20c0-6-4-10-10-10z"/></svg>';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src = '',
  alt,
  fallbackSrc = DEFAULT_FALLBACK_SVG,
  blurDataUrl,
  aspectRatioClassName = 'aspect-square',
  className,
  loading = 'lazy',
  preload = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  useEffect(() => {
    if (!preload || !src) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [src, preload]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    if (!error) {
      setError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  // Generate responsive mock srcset for testing resize bounds or normal URLs
  const srcSet =
    src && !src.startsWith('data:') && !src.startsWith('blob:')
      ? `${src}?w=320 320w, ${src}?w=640 640w, ${src}?w=960 960w, ${src}?w=1200 1200w`
      : undefined;

  return (
    <div
      className={twMerge(
        'relative overflow-hidden w-full h-full bg-muted/20 select-none',
        aspectRatioClassName
      )}
    >
      {/* Blurred image placeholder or shimmering skeleton */}
      {!loaded && (
        <div className="absolute inset-0 z-10 transition-opacity duration-300">
          {blurDataUrl ? (
            <img
              src={blurDataUrl}
              alt=""
              className="w-full h-full object-cover blur-xl scale-110"
              aria-hidden="true"
            />
          ) : (
            <Skeleton className="w-full h-full absolute inset-0 rounded-none bg-muted/30" />
          )}
        </div>
      )}

      {/* Main Image element */}
      <img
        src={currentSrc}
        srcSet={error ? undefined : srcSet}
        alt={alt}
        sizes={error ? undefined : sizes}
        loading={preload ? 'eager' : loading}
        fetchPriority={preload ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={twMerge(
          'w-full h-full transition-all duration-500 ease-out',
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
