'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockListerListings, mockListerStats } from '@/mocks/lister';

/**
 * S-08 — My Listings Page
 * Route: /(lister)/listings
 */
export default function MyListingsPage() {
  const [listings] = useState(mockListerListings);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">My Listings</h1>
        <Link 
          href="/listings/new"
          className="px-8 py-3 bg-[#1886FF] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-[#62D0FF] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Listings', value: mockListerStats.activeListings, color: 'text-[#1886FF]' },
          { label: 'Total Earnings', value: `₹${mockListerStats.totalEarnings.toLocaleString()}`, color: 'text-green-600' },
          { label: 'Pending Requests', value: mockListerStats.pendingRequests, color: 'text-yellow-600' },
          { label: 'Total Rentals', value: mockListerStats.totalRentals, color: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-[#E5E5E5] shadow-sm">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={item.images[0].url} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                  item.status === 'active' ? 'bg-green-500 text-white' : 
                  item.status === 'rented' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-widest">{item.category}</p>
                <h3 className="text-lg font-black text-[#171717] truncate">{item.title}</h3>
              </div>

              <div className="flex justify-between items-end border-t border-[#F5F5F5] pt-4">
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-tighter">Earnings/Day</p>
                  <p className="text-lg font-black text-[#171717]">₹{item.pricing.perDay.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/listings/${item.id}/edit`}
                    className="p-2 bg-[#F5F5F5] text-[#171717] rounded-lg hover:bg-[#E5E5E5] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button className="p-2 bg-[#F5F5F5] text-[#737373] rounded-lg hover:bg-red-50 hover:text-red-500 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
