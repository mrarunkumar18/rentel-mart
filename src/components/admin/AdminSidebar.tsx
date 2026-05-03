"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRBAC, useAdminSession } from "@/hooks/useRBAC";
import { AdminRole, ModuleId } from "@/types/admin";
import {
  Users, LayoutGrid, CalendarCheck, ShieldAlert, CreditCard,
  ShieldCheck, Settings, FileImage, BarChart3, ScrollText,
  ChevronDown, LogOut, Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string; moduleId: ModuleId; icon: React.ElementType }[] = [
  { label: "User Management",     href: "/admin/users",    moduleId: "M01", icon: Users },
  { label: "Listing Management",  href: "/admin/listings", moduleId: "M02", icon: LayoutGrid },
  { label: "Booking Management",  href: "/admin/bookings", moduleId: "M03", icon: CalendarCheck },
  { label: "Dispute Resolution",  href: "/admin/disputes", moduleId: "M04", icon: ShieldAlert },
  { label: "Finance & Payments",  href: "/admin/finance",  moduleId: "M05", icon: CreditCard },
  { label: "RBAC Management",     href: "/admin/rbac",     moduleId: "M06", icon: ShieldCheck },
  { label: "Platform Config",     href: "/admin/config",   moduleId: "M07", icon: Settings },
  { label: "Content Moderation",  href: "/admin/content",  moduleId: "M08", icon: FileImage },
  { label: "Reports & Analytics", href: "/admin/analytics",moduleId: "M09", icon: BarChart3 },
  { label: "Audit Log",           href: "/admin/audit",    moduleId: "M10", icon: ScrollText },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  ops_sub_admin: "Ops Sub-Admin",
  finance_sub_admin: "Finance Sub-Admin",
  content_sub_admin: "Content Sub-Admin",
  custom: "Custom",
};

export function AdminSidebar() {
  const { modules, role } = useRBAC();
  const { session, setRole } = useAdminSession();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => modules.includes(item.moduleId));

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-xl font-bold" style={{ color: "#1886FF" }}>Rentify</span>
        <span className="ml-2 text-xs font-medium bg-accent text-primary rounded-full px-2 py-0.5">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Modules</p>
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.moduleId}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-accent hover:text-primary"
                  )}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* DEV: Role Switcher */}
      <div className="border-t border-slate-200 p-3">
        <p className="text-xs text-slate-400 mb-1 px-1">DEV: Switch Role</p>
        <select
          className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-600 bg-white"
          value={role || ""}
          onChange={(e) => setRole(e.target.value as AdminRole)}
        >
          {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>

        {/* Session info */}
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm">
            {session?.name?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate">{session?.name}</p>
            <p className="text-xs text-slate-400 truncate">{ROLE_LABELS[session?.role || "custom"]}</p>
          </div>
          <button className="text-slate-400 hover:text-error transition-colors" title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
