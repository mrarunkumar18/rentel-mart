'use client';

import Link from 'next/link';

/**
 * S-06 — Payment Success / Booking Confirmed
 * Route: /(renter)/checkout/success
 */
export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">Booking Confirmed!</h1>
        <p className="text-[#737373] max-w-md mx-auto">
          Your request has been sent to the lister. You will receive a notification once they confirm the availability.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-sm max-w-sm w-full space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#737373]">Order ID:</span>
          <span className="font-bold text-[#171717]">#RT-99482</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#737373]">Total Amount:</span>
          <span className="font-bold text-[#1886FF]">₹10,250</span>
        </div>
        <div className="pt-4 border-t border-[#E5E5E5]">
          <p className="text-[10px] text-[#737373] uppercase font-bold tracking-widest mb-2">Next Steps</p>
          <ul className="text-left space-y-3">
            <li className="flex gap-3 text-xs text-[#171717]">
              <span className="text-green-500">●</span>
              Lister confirms request (within 24h)
            </li>
            <li className="flex gap-3 text-xs text-[#171717]">
              <span className="text-[#E5E5E5]">●</span>
              Coordinate pickup/delivery
            </li>
            <li className="flex gap-3 text-xs text-[#171717]">
              <span className="text-[#E5E5E5]">●</span>
              Start your rental!
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          href="/(renter)/dashboard"
          className="flex-1 py-4 bg-[#1886FF] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-[#62D0FF] transition-all"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/(renter)/browse"
          className="flex-1 py-4 bg-white border-2 border-[#171717] text-[#171717] rounded-2xl font-black uppercase tracking-widest hover:bg-[#171717] hover:text-white transition-all"
        >
          Keep Browsing
        </Link>
      </div>
    </div>
  );
}
