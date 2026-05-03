'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/mocks/products';

interface BookingCTAProps {
  product: Product;
}

export function BookingCTA({ product }: BookingCTAProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDays(diffDays);

      // Simple calculation logic: use daily rate for now
      // PHASE4-SWAP: Use dynamic pricing calculator module
      let total = 0;
      if (diffDays >= 30) {
        total = Math.floor(diffDays / 30) * product.pricing.perMonth + (diffDays % 30) * product.pricing.perDay;
      } else if (diffDays >= 7) {
        total = Math.floor(diffDays / 7) * product.pricing.perWeek + (diffDays % 7) * product.pricing.perDay;
      } else {
        total = diffDays * product.pricing.perDay;
      }
      setTotalPrice(total);
    }
  }, [startDate, endDate, product.pricing]);

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-xl sticky top-24">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-black text-[#171717]">₹{product.pricing.perDay}</span>
        <span className="text-[#737373] font-medium">/ day</span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5E5] text-xs focus:ring-2 focus:ring-[#62D0FF] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5E5] text-xs focus:ring-2 focus:ring-[#62D0FF] outline-none"
            />
          </div>
        </div>

        {days > 0 && (
          <div className="p-4 bg-[#F5F5F5] rounded-2xl space-y-2">
            <div className="flex justify-between text-xs text-[#737373]">
              <span>₹{product.pricing.perDay} x {days} days</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-[#737373]">
              <span>Security Deposit (Refundable)</span>
              <span>₹{product.pricing.deposit.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] flex justify-between font-bold text-[#171717]">
              <span>Total</span>
              <span>₹{(totalPrice + product.pricing.deposit).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <button 
        disabled={!startDate || !endDate}
        className="w-full py-4 rounded-2xl bg-[#1886FF] text-white font-black uppercase tracking-widest shadow-lg hover:bg-[#62D0FF] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book Now
      </button>
      
      <p className="text-center text-[10px] text-[#737373] mt-4">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}
