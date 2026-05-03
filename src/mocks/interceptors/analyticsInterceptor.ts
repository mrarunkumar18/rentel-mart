import { mockUsers, mockProducts, mockBookings, mockBookingPayments, mockDisputes } from "../seed";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsInterceptor = {
  getKPIs: async () => {
    await delay(300);
    return {
      totalUsers: mockUsers.length,
      totalUsersWoW: 12,
      activeListings: mockProducts.filter(p => p.status === 'active').length,
      activeListingsWoW: 5,
      openDisputes: mockDisputes.filter(d => d.status !== 'resolved').length,
      openDisputesWoW: -2,
      gmv30d: mockBookingPayments.reduce((sum, p) => sum + p.rent_total, 0),
      gmv30dWoW: 8,
    };
  },

  getRevenueOverTime: async (days: number) => {
    await delay(300);
    return Array.from({ length: days }, (_, i) => ({
      date: `May ${i + 1}`,
      value: Math.floor(Math.random() * 50000) + 10000,
    }));
  },

  getBookingsByStatus: async () => {
    await delay(300);
    const counts: Record<string, number> = {};
    mockBookings.forEach(b => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  },

  getUserGrowth: async (days: number) => {
    await delay(300);
    return Array.from({ length: days }, (_, i) => ({
      date: `May ${i + 1}`,
      value: Math.floor(Math.random() * 10) + 2,
    }));
  },

  getDisputeRate: async (days: number) => {
    await delay(300);
    return Array.from({ length: days }, (_, i) => ({
      date: `May ${i + 1}`,
      value: Math.random() * 5,
    }));
  },
};
