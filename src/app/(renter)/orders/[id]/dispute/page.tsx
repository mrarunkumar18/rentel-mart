'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhotoCapture } from '@/components/shared/PhotoCapture';

interface DisputePageProps {
  params: Promise<{ id: string }>;
}

/**
 * S-19 — Dispute/Damage Claim
 * Route: /(renter)/orders/[id]/dispute
 */
export default function DisputePage({ params }: DisputePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [photoCount, setPhotoCount] = useState(0);

  const handleSubmit = () => {
    // PHASE4-SWAP: Create dispute record
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
        <h1 className="text-2xl font-black text-[#171717]">Raise a Dispute</h1>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-[#E5E5E5] space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl">⚠️</div>
          <div>
            <h2 className="text-lg font-black text-[#171717]">Issue Details</h2>
            <p className="text-xs text-[#737373]">Provide clear evidence to help us resolve the issue fairly</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Type of Issue</label>
            <select className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all appearance-none bg-white">
              <option>Item not as described</option>
              <option>Item arrived damaged</option>
              <option>Item stopped working</option>
              <option>Safety concern</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Detailed Description</label>
            <textarea 
              placeholder="Describe exactly what is wrong..."
              className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all resize-none"
              rows={4}
            />
          </div>
        </div>

        <PhotoCapture 
          label="Evidence Photos" 
          minPhotos={1} 
          onPhotosChange={(photos) => setPhotoCount(photos.length)}
        />

        <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
          <p className="text-[10px] text-red-800 font-medium">
            <strong>Important:</strong> Our Trust & Safety team will review your claim and the lister&apos;s response within 24 hours. The security deposit will remain on hold until the dispute is resolved.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={photoCount < 1}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            photoCount >= 1 
              ? 'bg-[#EF4444] text-white shadow-lg hover:bg-red-600' 
              : 'bg-[#F5F5F5] text-[#737373] cursor-not-allowed border border-[#E5E5E5]'
          }`}
        >
          Submit Dispute Claim
        </button>
      </div>
    </div>
  );
}
