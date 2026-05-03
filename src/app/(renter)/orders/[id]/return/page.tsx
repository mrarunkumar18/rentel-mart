'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhotoCapture } from '@/components/shared/PhotoCapture';

interface ReturnPageProps {
  params: Promise<{ id: string }>;
}

/**
 * S-07 — Return Order
 * Route: /(renter)/orders/[id]/return
 */
export default function ReturnOrderPage({ params }: ReturnPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [photoCount, setPhotoCount] = useState(0);

  const handleComplete = () => {
    // PHASE4-SWAP: Update order status to completed, trigger refund
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
        <h1 className="text-2xl font-black text-[#171717]">Return Item</h1>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-[#E5E5E5] space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">🤝</div>
          <div>
            <h2 className="text-lg font-black text-[#171717]">Final Inspection</h2>
            <p className="text-xs text-[#737373]">Capture the current state of the item for return verification</p>
          </div>
        </div>

        <PhotoCapture 
          label="Return Condition Proof" 
          minPhotos={3} 
          onPhotosChange={(photos) => setPhotoCount(photos.length)}
        />

        <div className="space-y-4 pt-4 border-t border-[#F5F5F5]">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Any issues or damage?</label>
            <textarea 
              placeholder="If the item was damaged during your rental, please be honest and describe it here..."
              className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all resize-none"
              rows={3}
            />
          </div>
        </div>

        <button 
          onClick={handleComplete}
          disabled={photoCount < 3}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            photoCount >= 3 
              ? 'bg-[#171717] text-white shadow-lg hover:bg-[#1886FF]' 
              : 'bg-[#F5F5F5] text-[#737373] cursor-not-allowed border border-[#E5E5E5]'
          }`}
        >
          {photoCount < 3 ? `Need ${3 - photoCount} more photos` : 'Complete Return'}
        </button>
      </div>

      <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex gap-4">
        <span className="text-xl">💰</span>
        <p className="text-xs text-green-800 leading-relaxed">
          <strong>Deposit Refund:</strong> Once the lister confirms the item is in good condition, your security deposit will be initiated for refund within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
