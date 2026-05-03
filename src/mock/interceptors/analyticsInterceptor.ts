// ── SWAP POINT: replace with → GET /api/v1/admin/stats + /api/v1/admin/reports/* ──
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockAnalytics } from "../store/analytics.mock";

export const analyticsInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/stats ──
  getKPIs: async () => {
    await delay(250);
    return mockAnalytics.kpis;
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/reports/revenue?range=30d ──
  getRevenueOverTime: async (days: number = 30) => {
    await delay(300);
    return mockAnalytics.revenueOverTime.slice(-days);
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/reports/bookings ──
  getBookingsByStatus: async () => {
    await delay(200);
    return mockAnalytics.bookingsByStatus;
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/reports/user-growth?range=30d ──
  getUserGrowth: async (days: number = 30) => {
    await delay(250);
    return mockAnalytics.userGrowth.slice(-days);
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/reports/dispute-rate ──
  getDisputeRate: async (days: number = 30) => {
    await delay(200);
    return mockAnalytics.disputeRate.slice(-days);
  },
};
