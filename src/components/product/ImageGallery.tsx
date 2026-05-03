'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: { url: string; isPrimary: boolean }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-3xl border border-[#E5E5E5] overflow-hidden bg-[#F5F5F5]">
        <img
          src={images[activeIdx]?.url || images[0].url}
          alt="Product detail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                activeIdx === idx ? 'border-[#1886FF]' : 'border-transparent hover:border-[#E5E5E5]'
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {activeIdx === idx && (
                <div className="absolute inset-0 bg-[#1886FF]/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
