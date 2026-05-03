'use client';

import { useState, useRef } from 'react';

interface PhotoCaptureProps {
  label: string;
  minPhotos?: number;
  onPhotosChange?: (photos: string[]) => void;
}

/**
 * Shared Component for Pickup/Return/Dispute Photo Evidence
 * Uses input type="file" with capture="environment" for mobile camera access.
 */
export function PhotoCapture({ label, minPhotos = 3, onPhotosChange }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosChange?.(updatedPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange?.(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-[#171717] uppercase tracking-widest">{label}</label>
        <span className="text-[10px] font-bold text-[#737373]">
          {photos.length} / {minPhotos} photos min.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-[#E5E5E5]">
            <img src={photo} alt="" className="w-full h-full object-cover" />
            <button 
              onClick={() => removePhoto(idx)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {photos.length < 6 && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-2 hover:border-[#1886FF] hover:bg-[#E4F9FF]/30 transition-all group"
          >
            <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center group-hover:bg-[#1886FF] group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Take Photo</span>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
              multiple
            />
          </button>
        )}
      </div>
    </div>
  );
}
