'use client';

import { useState } from 'react';
import { mockBookingRequests, BookingRequest } from '@/mocks/lister';

/**
 * S-10 — Order Requests Page
 * Route: /(lister)/requests
 */
export default function OrderRequestsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>(mockBookingRequests);

  const handleAction = (id: string, newStatus: 'accepted' | 'rejected') => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#171717] tracking-tight">Booking Requests</h1>
          <p className="text-[#737373] mt-1 text-sm">Approve or reject incoming rental requests</p>
        </div>
        <div className="flex bg-[#F5F5F5] p-1 rounded-xl">
          <button className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-[#1886FF] shadow-sm">Pending ({requests.filter(r => r.status === 'pending').length})</button>
          <button className="px-4 py-2 text-xs font-bold text-[#737373] hover:text-[#171717]">Archived</button>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div 
            key={req.id} 
            className={`bg-white rounded-[32px] border border-[#E5E5E5] p-6 flex flex-col lg:flex-row gap-8 transition-all ${
              req.status !== 'pending' ? 'opacity-50 grayscale' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-widest mb-1">Incoming Request</p>
                  <h3 className="text-xl font-black text-[#171717]">{req.productTitle}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1886FF]">₹{req.totalPrice.toLocaleString()}</p>
                  <p className="text-[10px] text-[#737373] uppercase font-bold tracking-tighter italic">potential earnings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#F5F5F5]">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-xs font-bold text-[#171717]">
                    {req.renterName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Renter</p>
                    <p className="text-xs font-black text-[#171717]">{req.renterName}</p>
                    <p className="text-[10px] text-yellow-600 font-bold">★ {req.renterRating}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Start Date</p>
                  <p className="text-xs font-black text-[#171717]">{new Date(req.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">End Date</p>
                  <p className="text-xs font-black text-[#171717]">{new Date(req.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-xs font-black text-[#171717]">5 Days</p>
                </div>
              </div>

              {req.status === 'pending' ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction(req.id, 'accepted')}
                    className="flex-1 py-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-green-600 transition-all"
                  >
                    Accept Request
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'rejected')}
                    className="px-8 py-4 bg-white border-2 border-[#EF4444] text-[#EF4444] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className={`py-3 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                  req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  Request {req.status}
                </div>
              )}
            </div>
            
            <div className="lg:w-72 bg-[#F5F5F5] rounded-3xl p-6 space-y-4">
              <h4 className="text-[10px] font-black text-[#171717] uppercase tracking-widest">Trust Metrics</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-xs text-[#737373]">
                  <span className="text-green-500">✓</span> Verified Identity
                </li>
                <li className="flex items-center gap-2 text-xs text-[#737373]">
                  <span className="text-green-500">✓</span> Payment Pre-authorized
                </li>
                <li className="flex items-center gap-2 text-xs text-[#737373]">
                  <span className="text-green-500">✓</span> No Prior Disputes
                </li>
              </ul>
              <button className="w-full mt-4 text-[10px] font-black text-[#1886FF] uppercase tracking-widest hover:underline text-left">
                View Renter Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
