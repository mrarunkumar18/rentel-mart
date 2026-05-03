'use client';

import { mockCategories } from '@/mocks/products';

export function ProductFilter() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#171717]">Filters</h2>
        <button className="text-xs font-semibold text-[#1886FF] hover:text-[#62D0FF]">Reset All</button>
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <section>
          <h3 className="text-sm font-bold text-[#171717] mb-4">Category</h3>
          <div className="space-y-3">
            {mockCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#E5E5E5] text-[#1886FF] focus:ring-[#62D0FF] transition-all"
                />
                <span className="text-sm text-[#737373] group-hover:text-[#171717] transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <h3 className="text-sm font-bold text-[#171717] mb-4">Price Range (Day)</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#737373] uppercase">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#737373]">₹</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full pl-6 pr-3 py-2 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#62D0FF] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#737373] uppercase">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#737373]">₹</span>
                  <input 
                    type="number" 
                    placeholder="10000"
                    className="w-full pl-6 pr-3 py-2 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#62D0FF] transition-all"
                  />
                </div>
              </div>
            </div>
            {/* Simple slider placeholder */}
            <div className="h-1.5 bg-[#F5F5F5] rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 right-1/4 bg-[#1886FF]" />
            </div>
          </div>
        </section>

        {/* Condition */}
        <section>
          <h3 className="text-sm font-bold text-[#171717] mb-4">Condition</h3>
          <div className="space-y-3">
            {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#E5E5E5] text-[#1886FF] focus:ring-[#62D0FF] transition-all"
                />
                <span className="text-sm text-[#737373] group-hover:text-[#171717] transition-colors">{cond}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section>
          <h3 className="text-sm font-bold text-[#171717] mb-4">Availability</h3>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-[#E5E5E5] text-[#1886FF] focus:ring-[#62D0FF] transition-all"
            />
            <span className="text-sm text-[#737373] group-hover:text-[#171717] transition-colors">Available Now</span>
          </label>
        </section>
      </div>
      
      <button className="w-full mt-8 bg-[#1886FF] text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-[#62D0FF] transition-all active:scale-[0.98]">
        Apply Filters
      </button>
    </div>
  );
}
