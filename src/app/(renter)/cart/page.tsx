'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockCart, getCartSummary, CartItem as CartItemType } from '@/mocks/cart';

/**
 * S-14 — Cart Page
 * Route: /(renter)/cart
 */
export default function CartPage() {
  const [items, setItems] = useState<CartItemType[]>(mockCart);
  const summary = getCartSummary(items);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center text-[#737373]">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#171717]">Your cart is empty</h1>
        <p className="text-[#737373] text-center max-w-md">
          Looks like you haven&apos;t added any rentals yet. Go back to browse and find something you need!
        </p>
        <Link 
          href="/(renter)/browse"
          className="px-8 py-3 bg-[#1886FF] text-white rounded-xl font-bold shadow-lg hover:bg-[#62D0FF] transition-all"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-[#171717] tracking-tight">Your Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex gap-4 hover:shadow-md transition-all">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                <img 
                  src={item.product.images[0].url} 
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-widest">{item.product.category}</p>
                    <h3 className="font-bold text-[#171717] truncate">{item.product.title}</h3>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-[#737373] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </div>
                  <span className="text-[10px] font-bold text-[#1886FF] uppercase bg-[#E4F9FF] px-2 py-0.5 rounded-full">
                    {item.totalDays} Days
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-black text-[#171717]">₹{item.totalPrice.toLocaleString()}</span>
                  <span className="text-[10px] text-[#737373]">total rent</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#171717] mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-[#737373]">
                <span>Rent Subtotal</span>
                <span className="font-semibold text-[#171717]">₹{summary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#737373]">
                <span>Security Deposit</span>
                <span className="font-semibold text-[#171717]">₹{summary.totalDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#737373]">
                <span>Delivery Fee</span>
                <span className="font-semibold text-[#171717]">₹{summary.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-[#E5E5E5] flex justify-between items-baseline">
                <span className="font-bold text-[#171717]">Estimated Total</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1886FF]">₹{summary.total.toLocaleString()}</p>
                  <p className="text-[10px] text-[#737373]">Incl. taxes & deposits</p>
                </div>
              </div>
            </div>
            <Link 
              href="/(renter)/checkout"
              className="w-full mt-8 py-4 bg-[#1886FF] text-white rounded-2xl font-black uppercase tracking-widest text-center block shadow-lg hover:bg-[#62D0FF] transition-all active:scale-[0.98]"
            >
              Checkout
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-dashed border-[#E5E5E5] bg-[#F5F5F5]/50">
            <p className="text-xs text-[#737373] text-center italic">
              &quot;Renting instead of buying saves you an average of ₹12,000 per year!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
