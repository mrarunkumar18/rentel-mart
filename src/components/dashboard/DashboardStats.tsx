import { DashboardStats as StatsType } from '@/mocks/dashboard';

interface StatsProps {
  stats: StatsType;
}

export function DashboardStats({ stats }: StatsProps) {
  const cards = [
    {
      label: 'Total Spent',
      value: `₹${stats.totalSpent.toLocaleString()}`,
      change: stats.rentalsChange,
      icon: (
        <svg className="w-6 h-6 text-[#1886FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Earned',
      value: `₹${stats.totalEarned.toLocaleString()}`,
      change: stats.earningsChange,
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Active Rentals',
      value: stats.activeRentals,
      icon: (
        <svg className="w-6 h-6 text-[#62D0FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: (
        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#E4F9FF] rounded-xl">
              {card.icon}
            </div>
            {card.change !== undefined && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {card.change >= 0 ? '+' : ''}{card.change}%
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#737373]">{card.label}</p>
            <p className="text-2xl font-bold text-[#171717] mt-1">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
