'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhotoCapture } from '@/components/shared/PhotoCapture';

interface PickupPageProps {
  params: Promise<{ id: string }>;
}

/**
 * S-06 — Pickup Order
 * Route: /(renter)/orders/[id]/pickup
 */
export default function PickupOrderPage({ params }: PickupPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [photoCount, setPhotoCount] = useState(0);

  const handleComplete = () => {
    // PHASE4-SWAP: Update order status to active
    router.push(`/orders/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href={`/orders/${id}`} className="p-2 hover:bg-[#F5F5F5] rounded-xl transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-[#171717]">Confirm Pickup</h1>
      </div>

      <div className="bg-[#171717] p-8 rounded-[40px] text-white space-y-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1886FF] rounded-2xl flex items-center justify-center text-xl">📸</div>
          <div>
            <h2 className="text-lg font-bold">Inspect & Capture</h2>
            <p className="text-xs text-gray-400">Take at least 3 photos of the item before accepting</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <PhotoCapture 
            label="Condition Evidence" 
            minPhotos={3} 
            onPhotosChange={(photos) => setPhotoCount(photos.length)}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#1886FF] focus:ring-[#1886FF]" />
            <p className="text-xs text-gray-300">I have inspected the item and confirmed it matches the description.</p>
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#1886FF] focus:ring-[#1886FF]" />
            <p className="text-xs text-gray-300">I agree that any damage not captured in these photos will be my responsibility.</p>
          </div>
        </div>

        <button 
          onClick={handleComplete}
          disabled={photoCount < 3}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            photoCount >= 3 
              ? 'bg-[#1886FF] text-white shadow-lg hover:bg-[#62D0FF]' 
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {photoCount < 3 ? `Need ${3 - photoCount} more photos` : 'Confirm & Start Rental'}
        </button>
      </div>

      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
        <span className="text-xl">💡</span>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Tip:</strong> Take clear photos from all angles. Focus on existing scratches, dents, or wear and tear to protect yourself from future claims.
        </p>
      </div>
    </div>
  );
}
