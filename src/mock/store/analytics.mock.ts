export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface AnalyticsData {
  kpis: {
    totalUsers: number;
    totalUsersWoW: number;
    activeListings: number;
    activeListingsWoW: number;
    openDisputes: number;
    openDisputesWoW: number;
    gmv30d: number;
    gmv30dWoW: number;
  };
  revenueOverTime: TimeSeriesPoint[];
  bookingsByStatus: { status: string; count: number }[];
  userGrowth: TimeSeriesPoint[];
  disputeRate: TimeSeriesPoint[];
}

function generateTimeSeries(days: number, base: number, variance: number): TimeSeriesPoint[] {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }));
}

export const mockAnalytics: AnalyticsData = {
  kpis: {
    totalUsers: 12482,
    totalUsersWoW: 8,
    activeListings: 3204,
    activeListingsWoW: 3,
    openDisputes: 47,
    openDisputesWoW: -12,
    gmv30d: 4830000,
    gmv30dWoW: 15,
  },
  revenueOverTime: generateTimeSeries(90, 150000, 80000),
  bookingsByStatus: [
    { status: "confirmed", count: 842 },
    { status: "active", count: 619 },
    { status: "returned", count: 2341 },
    { status: "cancelled", count: 287 },
    { status: "disputed", count: 103 },
  ],
  userGrowth: generateTimeSeries(90, 120, 60),
  disputeRate: generateTimeSeries(90, 3.2, 1.5),
};
