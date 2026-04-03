'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
  selectedImageIndex: number;
}

export default function ProductGallery({
  images,
  title,
  selectedImageIndex,
}: ProductGalleryProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const mainImgRef = useRef<HTMLImageElement | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);

  // Loading states
  const [mainLoaded, setMainLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState<Record<number, boolean>>({});

  // Error states
  const [mainError, setMainError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});

  const placeholderImage = "/placeholder-image.png";

  const validImages = images.filter((img) => typeof img === 'string' && img.trim() !== "");
  const imagesToShow = validImages.length ? validImages : [placeholderImage];
  const primaryImage = imagesToShow[currentImageIndex] || placeholderImage;

  // Update current image index when selectedImageIndex prop changes
  useEffect(() => {
    setCurrentImageIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  // Reset main image states when the primary image URL changes
  useEffect(() => {
    setMainLoaded(false);
    setMainError(false);

    const img = mainImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      // Image already loaded by the browser cache
      setMainLoaded(true);
    }
  }, [primaryImage]);

  return (
    <section className="rounded-lg shadow-xs overflow-hidden w-full">
      {/* Main Image with skeleton only */}
      <div className="relative flex items-center justify-center bg-gray-50 h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px]">
        {/* Skeleton */}
        {!mainLoaded && !mainError && (
          <div
            className="absolute inset-3 sm:inset-4 animate-pulse bg-gray-200/70 pointer-events-none rounded"
            aria-hidden="true"
          />
        )}
        <Image
          ref={mainImgRef as any}
          src={mainError ? placeholderImage : primaryImage}
          alt={title}
          unoptimized={typeof primaryImage === 'string' && (primaryImage.includes('jijistatic.net') || primaryImage.includes('unsplash.com') || primaryImage.includes('localhost') || primaryImage.includes('127.0.0.1'))}
          fill
          className="object-contain p-3 sm:p-4"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setMainLoaded(true)}
          onError={() => {
            setMainError(true);
            setMainLoaded(true);
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="px-2 sm:px-4 py-3 border-t border-gray-200">
        <div
          ref={carouselRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {imagesToShow.map((src, idx) => (
            <button
              key={idx}
              data-idx={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 border-2 ${idx === currentImageIndex
                ? "hover:scale-105 border-gray-400 ring-2 ring-gray-300"
                : "border-gray-200 hover:border-gray-300"
                } w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20`}
            >
              {!thumbLoaded[idx] && !thumbErrors[idx] && (
                <div className="absolute inset-0 animate-pulse bg-gray-200/70" />
              )}
              <Image
                src={thumbErrors[idx] ? placeholderImage : src}
                alt={`${title} ${idx + 1}`}
                unoptimized={typeof src === 'string' && (src.includes('jijistatic.net') || src.includes('unsplash.com') || src.includes('localhost') || src.includes('127.0.0.1'))}
                fill
                className="object-cover"
                sizes="80px"
                onLoad={() => setThumbLoaded((m) => ({ ...m, [idx]: true }))}
                onError={() => {
                  setThumbErrors((prev) => ({ ...prev, [idx]: true }));
                  setThumbLoaded((m) => ({ ...m, [idx]: true }));
                }}
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
