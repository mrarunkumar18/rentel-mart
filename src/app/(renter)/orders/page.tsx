'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockOrders, OrderStatus } from '@/mocks/orders';

/**
 * S-04 — My Orders Page
 * Route: /(renter)/orders
 */
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700';
      case 'awaiting_pickup': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'disputed': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_approval', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">My Orders</h1>
        <div className="flex bg-[#F5F5F5] p-1 rounded-xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-[#1886FF] shadow-sm' 
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl border border-[#E5E5E5] p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group"
            >
              <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                <img 
                  src={order.product.images[0].url} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">#{order.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#171717]">{order.product.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#1886FF]">₹{order.pricing.total.toLocaleString()}</p>
                    <p className="text-[10px] text-[#737373] uppercase font-bold tracking-tighter">{order.paymentPlan} plan</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#F5F5F5]">
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Start Date</p>
                    <p className="text-xs font-black text-[#171717]">{new Date(order.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">End Date</p>
                    <p className="text-xs font-black text-[#171717]">{new Date(order.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xs font-black text-[#171717]">{order.totalDays} Days</p>
                  </div>
                  <div className="flex items-end justify-end">
                    <Link 
                      href={`/orders/${order.id}`}
                      className="px-6 py-2 bg-[#171717] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1886FF] transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-[#F5F5F5]/50 rounded-3xl border border-dashed border-[#E5E5E5]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#737373]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#171717]">No orders found</h2>
            <p className="text-xs text-[#737373] mt-1">Try switching to a different category or start browsing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
