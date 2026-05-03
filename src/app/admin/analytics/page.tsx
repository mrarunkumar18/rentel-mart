"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, PageHeader } from "@/components/admin/ui";
import { analyticsInterceptor } from "@/mocks/interceptors/analyticsInterceptor";
import { AnalyticsData } from "@/types/admin";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

export default function AnalyticsPage() {
  return <RouteGuard moduleId="M09"><AnalyticsContent /></RouteGuard>;
}

function AnalyticsContent() {
  const [kpis, setKpis] = useState<AnalyticsData["kpis"] | null>(null);
  const [revenue, setRevenue] = useState<{ date: string; value: number }[]>([]);
  const [bookingStatus, setBookingStatus] = useState<{ status: string; count: number }[]>([]);
  const [userGrowth, setUserGrowth] = useState<{ date: string; value: number }[]>([]);
  const [disputeRate, setDisputeRate] = useState<{ date: string; value: number }[]>([]);
  const [range, setRange] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadAll = useCallback(async () => {
    setRefreshing(true);
    const [k, r, b, u, d] = await Promise.all([
      analyticsInterceptor.getKPIs(),
      analyticsInterceptor.getRevenueOverTime(range),
      analyticsInterceptor.getBookingsByStatus(),
      analyticsInterceptor.getUserGrowth(range),
      analyticsInterceptor.getDisputeRate(range),
    ]);
    setKpis(k); setRevenue(r); setBookingStatus(b); setUserGrowth(u); setDisputeRate(d);
    setLastUpdated(new Date());
    setRefreshing(false);
  }, [range]);

  useEffect(() => {
    loadAll();
    timerRef.current = setInterval(loadAll, 30000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loadAll]);

  // Inline SVG chart helpers
  const LineChart = ({ data, color = "#1886FF", height = 80 }: { data: { date: string; value: number }[]; color?: string; height?: number }) => {
    if (!data.length) return null;
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const w = 100, h = height;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.value - min) / (max - min || 1)) * (h - 10) - 5;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg viewBox={`0 0 100 ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
        <polyline points={`0,${h} ${points} 100,${h}`} fill={color} fillOpacity="0.08" stroke="none" />
      </svg>
    );
  };

  const BarChart = ({ data }: { data: { status: string; count: number }[] }) => {
    const max = Math.max(...data.map(d => d.count));
    const colors: Record<string, string> = { confirmed: "#1886FF", active: "#22C55E", returned: "#94A3B8", cancelled: "#EF4444", disputed: "#F59E0B" };
    return (
      <div className="flex items-end gap-2 h-28 px-2">
        {data.map((d) => (
          <div key={d.status} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500">{d.count}</span>
            <div
              style={{ height: `${(d.count / max) * 80}px`, backgroundColor: colors[d.status] || "#94A3B8" }}
              className="w-full rounded-t-md transition-all"
            />
            <span className="text-xs text-slate-400 capitalize">{d.status}</span>
          </div>
        ))}
      </div>
    );
  };

  const formatIndian = (n: number) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`;

  const KPICard = ({ label, value, wow, prefix = "" }: { label: string; value: string | number; wow: number; prefix?: string }) => (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${wow >= 0 ? "text-green-600" : "text-red-500"}`}>
        {wow >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(wow)}% WoW
      </div>
      <p className="text-xs text-slate-300 mt-1">Updated: {lastUpdated.toLocaleTimeString("en-IN")}</p>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Platform performance overview"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {RANGE_OPTIONS.map(({ label, days }) => (
                <button key={days} onClick={() => setRange(days)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${range === days ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-accent"}`}>
                  {label}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={loadAll}>
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard label="Total Users" value={kpis.totalUsers} wow={kpis.totalUsersWoW} />
          <KPICard label="Active Listings" value={kpis.activeListings} wow={kpis.activeListingsWoW} />
          <KPICard label="Open Disputes" value={kpis.openDisputes} wow={kpis.openDisputesWoW} />
          <KPICard label={`GMV (${range}d)`} value={formatIndian(kpis.gmv30d)} wow={kpis.gmv30dWoW} />
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue over time */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">Revenue Over Time</h3>
          {revenue.length > 0 ? (
            <>
              <LineChart data={revenue} color="#1886FF" height={100} />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>{revenue[0]?.date}</span>
                <span>{revenue[revenue.length - 1]?.date}</span>
              </div>
            </>
          ) : <div className="h-24 bg-slate-50 rounded-lg animate-pulse" />}
        </div>

        {/* Bookings by status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">Bookings by Status</h3>
          {bookingStatus.length > 0 ? <BarChart data={bookingStatus} /> : <div className="h-24 bg-slate-50 rounded-lg animate-pulse" />}
        </div>

        {/* User growth */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">User Growth (new signups/day)</h3>
          {userGrowth.length > 0 ? (
            <>
              <LineChart data={userGrowth} color="#22C55E" height={100} />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>{userGrowth[0]?.date}</span>
                <span>{userGrowth[userGrowth.length - 1]?.date}</span>
              </div>
            </>
          ) : <div className="h-24 bg-slate-50 rounded-lg animate-pulse" />}
        </div>

        {/* Dispute rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 text-sm mb-4">Dispute Rate (% of bookings)</h3>
          {disputeRate.length > 0 ? (
            <>
              <LineChart data={disputeRate} color="#F59E0B" height={100} />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>{disputeRate[0]?.date}</span>
                <span>{disputeRate[disputeRate.length - 1]?.date}</span>
              </div>
            </>
          ) : <div className="h-24 bg-slate-50 rounded-lg animate-pulse" />}
        </div>
      </div>
    </>
  );
}
