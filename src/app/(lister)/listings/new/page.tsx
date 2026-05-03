'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * S-09 — Create New Listing
 * Route: /(lister)/listings/new
 */
export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">List a New Product</h1>
        <p className="text-[#737373] mt-2">Earn passive income by sharing your unused gear</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
              step === s ? 'bg-[#1886FF] text-white shadow-xl scale-110' : 
              step > s ? 'bg-green-500 text-white' : 'bg-[#E5E5E5] text-[#737373]'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-green-500' : 'bg-[#E5E5E5]'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-[#E5E5E5] shadow-sm">
        {/* STEP 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-[#171717]">Basic Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Canon EOS R5 Mirrorless Camera"
                  className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Category</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all appearance-none bg-white">
                    <option>Electronics</option>
                    <option>Outdoor</option>
                    <option>Home & Garden</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Condition</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all appearance-none bg-white">
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your product, its features, and any specific rental terms..."
                  className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Photos & Value */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-[#171717]">Photos & Valuation</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="aspect-square rounded-3xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center gap-2 hover:border-[#1886FF] hover:bg-[#E4F9FF]/30 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center group-hover:bg-[#1886FF] group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Add Photo</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Original Purchase Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="340000"
                  className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all"
                />
                <p className="text-[10px] text-[#737373] italic">* This helps us calculate the appropriate security deposit.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Rules */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-[#171717]">Pricing & Rental Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Daily Rate (₹)</label>
                <input type="number" placeholder="2500" className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Security Deposit (₹)</label>
                <input type="number" placeholder="20000" className="w-full px-5 py-4 rounded-2xl border border-[#E5E5E5] text-sm focus:ring-4 focus:ring-[#62D0FF]/20 outline-none transition-all" />
              </div>
            </div>
            <div className="p-6 bg-[#F5F5F5] rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#171717]">Offer Weekly Discount</p>
                  <p className="text-[10px] text-[#737373]">Recommend: 15% off for 7+ days</p>
                </div>
                <div className="w-12 h-6 bg-[#1886FF] rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between opacity-50">
                <div>
                  <p className="text-sm font-bold text-[#171717]">Offer Monthly Discount</p>
                  <p className="text-[10px] text-[#737373]">Recommend: 30% off for 30+ days</p>
                </div>
                <div className="w-12 h-6 bg-[#E5E5E5] rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#F5F5F5]">
          {step > 1 ? (
            <button onClick={prevStep} className="text-sm font-black text-[#171717] uppercase tracking-widest hover:underline">Back</button>
          ) : (
            <button onClick={() => router.back()} className="text-sm font-black text-[#737373] uppercase tracking-widest hover:underline">Cancel</button>
          )}
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="px-10 py-4 bg-[#1886FF] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-[#62D0FF] transition-all active:scale-[0.98]"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={() => router.push('/listings')}
              className="px-12 py-4 bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-green-600 transition-all active:scale-[0.98]"
            >
              Publish Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
