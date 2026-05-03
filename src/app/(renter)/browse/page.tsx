'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductFilter } from '@/components/shared/ProductFilter';
import { mockProducts } from '@/mocks/products';

/**
 * S-02 — Browse Products Page
 * Route: /(renter)/browse
 */
export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // PHASE4-SWAP: Replace with real filtered data fetch
  const products = mockProducts;

  return (
    <div className="space-y-8">
      {/* Search and Sort Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm">
        <div className="relative flex-1 max-w-2xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search for cameras, laptops, camping gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#62D0FF] focus:border-[#1886FF] transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-[#737373] uppercase whitespace-nowrap">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-4 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#62D0FF] appearance-none cursor-pointer relative"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Desktop */}
        <aside className="hidden lg:block">
          <ProductFilter />
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#171717]">
              {products.length} Products Found
            </h2>
            <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="p-2 rounded-lg border border-[#E5E5E5] disabled:opacity-30" disabled>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1886FF] text-white font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-lg border border-[#E5E5E5] text-[#737373] font-bold text-sm hover:bg-[#F5F5F5]">2</button>
            <button className="w-10 h-10 rounded-lg border border-[#E5E5E5] text-[#737373] font-bold text-sm hover:bg-[#F5F5F5]">3</button>
            <button className="p-2 rounded-lg border border-[#E5E5E5]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
