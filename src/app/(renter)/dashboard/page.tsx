'use client';

import { useState } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockDashboardData } from '@/mocks/dashboard';

/**
 * S-01 — Dashboard Page
 * Route: /(renter)/dashboard
 */
export default function DashboardPage() {
  const [period, setPeriod] = useState('30');
  const data = mockDashboardData; // PHASE4-SWAP: Replace with real data fetch

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171717]">Dashboard</h1>
          <p className="text-[#737373] text-sm mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your rentals.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-[#F5F5F5] p-1 rounded-lg border border-[#E5E5E5]">
          {[
            { label: '7D', value: '7' },
            { label: '30D', value: '30' },
            { label: '90D', value: '90' },
            { label: 'All', value: 'all' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriod(item.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                period === item.value
                  ? 'bg-white text-[#1886FF] shadow-sm'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={data.stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications */}
        <div className="lg:col-span-2">
          <NotificationsPanel notifications={data.notifications} />
        </div>

        {/* Sidebar Actions & More */}
        <div className="space-y-8">
          <QuickActions actions={data.quickActions} />
          
          {/* Active Rentals Summary Card (Mini) */}
          <div className="bg-[#1886FF] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Active Rentals</h3>
              <p className="text-white/80 text-sm mb-4">
                You have {data.stats.activeRentals} items currently being rented.
              </p>
              <button className="bg-white text-[#1886FF] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#62D0FF] hover:text-white transition-all shadow-sm">
                Manage Rentals
              </button>
            </div>
            {/* Background Accent */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
