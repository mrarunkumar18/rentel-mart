'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { mockOrders, OrderStatus } from '@/mocks/orders';

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

/**
 * S-05 — Order Detail Page
 * Route: /(renter)/orders/[id]
 */
export default function OrderDetailPage({ params }: OrderDetailProps) {
  const { id } = use(params);
  const order = mockOrders.find(o => o.id === id) || mockOrders[0];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/(renter)/orders"
            className="p-2 hover:bg-[#F5F5F5] rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#171717]">Order Detail</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-xs text-[#737373] mt-0.5 uppercase tracking-widest font-bold">Order ID: #{order.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {order.status === 'active' && (
            <button className="px-6 py-2.5 bg-[#EF4444] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-red-600 transition-all">
              Initiate Return
            </button>
          )}
          <button className="px-6 py-2.5 bg-[#F5F5F5] text-[#171717] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#E5E5E5] transition-all">
            Download Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Product Overview */}
          <section className="bg-white p-6 rounded-3xl border border-[#E5E5E5] flex gap-6">
            <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0 bg-[#F5F5F5]">
              <img src={order.product.images[0].url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-widest">{order.product.category}</p>
                <h2 className="text-xl font-black text-[#171717]">{order.product.title}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#F5F5F5]">
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase mb-1">Rental Period</p>
                  <p className="text-xs font-black text-[#171717]">
                    {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase mb-1">Duration</p>
                  <p className="text-xs font-black text-[#171717]">{order.totalDays} Days</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1886FF] flex items-center justify-center text-white text-xs font-bold">
                    {order.product.lister.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase">Lister</p>
                    <p className="text-xs font-black text-[#171717]">{order.product.lister.name}</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-[#1886FF] uppercase tracking-widest hover:underline">
                  Message Lister
                </button>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="bg-white p-8 rounded-3xl border border-[#E5E5E5]">
            <h2 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-8">Order Timeline</h2>
            <div className="space-y-8">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative flex gap-6">
                  {idx < order.timeline.length - 1 && (
                    <div className="absolute left-3 top-6 bottom-[-32px] w-[2px] bg-[#E5E5E5]" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-[#1886FF] border-4 border-[#E4F9FF] shrink-0 z-10" />
                  <div>
                    <p className="text-sm font-black text-[#171717]">{event.status}</p>
                    <p className="text-xs text-[#737373] mt-0.5">{event.description}</p>
                    <p className="text-[10px] font-bold text-[#1886FF] uppercase mt-2">
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Plan & Installments */}
          {order.installments && (
            <section className="bg-white p-8 rounded-3xl border border-[#E5E5E5]">
              <h2 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-8">Installment Schedule</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F5F5F5]">
                      <th className="pb-4 text-[10px] font-black text-[#737373] uppercase tracking-widest">Installment</th>
                      <th className="pb-4 text-[10px] font-black text-[#737373] uppercase tracking-widest">Due Date</th>
                      <th className="pb-4 text-[10px] font-black text-[#737373] uppercase tracking-widest">Amount</th>
                      <th className="pb-4 text-[10px] font-black text-[#737373] uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F5]">
                    {order.installments.map((inst, idx) => (
                      <tr key={idx} className="group hover:bg-[#F5F5F5]/50 transition-all">
                        <td className="py-4 text-xs font-black text-[#171717]">#0{idx + 1}</td>
                        <td className="py-4 text-xs font-medium text-[#737373]">{new Date(inst.dueDate).toLocaleDateString()}</td>
                        <td className="py-4 text-sm font-black text-[#171717]">₹{inst.amount.toLocaleString()}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inst.status === 'paid' ? 'bg-green-50 text-green-600' :
                            inst.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm">
            <h2 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-6">Cost Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-[#737373]">
                <span>Rent ({order.totalDays} Days)</span>
                <span className="font-semibold text-[#171717]">₹{order.pricing.rent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#737373]">
                <span>Security Deposit</span>
                <span className="font-semibold text-[#171717]">₹{order.pricing.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#737373]">
                <span>Delivery Fee</span>
                <span className="font-semibold text-[#171717]">₹{order.pricing.delivery.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-[#F5F5F5] flex justify-between items-baseline">
                <span className="font-bold text-[#171717]">Total Paid</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1886FF]">₹{order.pricing.total.toLocaleString()}</p>
                  <p className="text-[10px] text-[#737373] italic">via UPI</p>
                </div>
              </div>
            </div>
            
            {order.status === 'completed' && (
              <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-[10px] text-green-800 font-medium">
                  <strong>₹{order.pricing.deposit.toLocaleString()}</strong> security deposit has been successfully refunded to your original payment method.
                </p>
              </div>
            )}
          </section>

          <section className="bg-[#171717] p-6 rounded-3xl text-white">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Need Help?</h3>
            <p className="text-xs text-gray-400 mb-6">Have issues with the product or lister? Raise a dispute within 24 hours of delivery.</p>
            <button className="w-full py-3 bg-white text-[#171717] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#62D0FF] hover:text-white transition-all">
              Raise a Dispute
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
