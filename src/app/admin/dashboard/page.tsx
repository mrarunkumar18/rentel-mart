"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { PageHeader } from "@/components/admin/ui";
import { analyticsInterceptor } from "@/mocks/interceptors/analyticsInterceptor";
import { AnalyticsData } from "@/types/admin";
import { mockDisputes, mockUsers, mockBookings } from "@/mocks/seed";
import { TrendingUp, TrendingDown, Users, LayoutGrid, ShieldAlert, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return <RouteGuard moduleId="M09"><DashboardContent /></RouteGuard>;
}

function DashboardContent() {
  const [kpis, setKpis] = useState<AnalyticsData["kpis"] | null>(null);

  useEffect(() => {
    analyticsInterceptor.getKPIs().then(setKpis);
    const timer = setInterval(() => analyticsInterceptor.getKPIs().then(setKpis), 30000);
    return () => clearInterval(timer);
  }, []);

  const openDisputesCount = mockDisputes.filter(d => d.status !== "resolved").length;
  const activeUsersCount = mockUsers.filter(u => u.status === "active").length;
  const activeBookingsCount = mockBookings.filter(b => b.status === "active").length;

  const quickStats = [
    { label: "Active Users", value: activeUsersCount, icon: Users, href: "/admin/users", color: "text-primary", bg: "bg-accent" },
    { label: "Active Bookings", value: activeBookingsCount, icon: LayoutGrid, href: "/admin/bookings", color: "text-green-600", bg: "bg-green-50" },
    { label: "Open Disputes", value: openDisputesCount, icon: ShieldAlert, href: "/admin/disputes", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "GMV (30d)", value: kpis ? `₹${(kpis.gmv30d / 100000).toFixed(1)}L` : "…", icon: CreditCard, href: "/admin/analytics", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back, Admin. Here's what's happening." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-secondary transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
              <span className="text-xs text-secondary group-hover:text-primary transition-colors">View →</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "User Management", href: "/admin/users", desc: "View and manage all users" },
          { label: "Listing Review", href: "/admin/listings", desc: "Approve or reject listings" },
          { label: "Dispute Queue", href: "/admin/disputes", desc: "Open disputes awaiting ruling" },
          { label: "Finance", href: "/admin/finance", desc: "Transactions and refunds" },
          { label: "Content Moderation", href: "/admin/content", desc: "Flagged content review" },
          { label: "Audit Log", href: "/admin/audit", desc: "Full admin action history" },
        ].map(({ label, href, desc }) => (
          <Link key={href} href={href}
            className="bg-white rounded-xl p-4 border border-slate-200 hover:border-primary hover:shadow-sm transition-all">
            <p className="font-medium text-slate-800 text-sm">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
