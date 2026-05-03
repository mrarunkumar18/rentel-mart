# Teammate 3 — Technical Reference

**Admin UI Patterns · RBAC · Dashboard Components · Data Tables**

## 1. Admin Data Table Pattern
```tsx
'use client';
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({ data, columns, onRowClick }: {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Sort + filter + paginate logic here
  return (
    <div>
      <input type="search" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search..." className="mb-4 px-4 py-2 border rounded-lg" />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-accent">
            {columns.map(col => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{/* rows */}</tbody>
      </table>
      {/* Pagination */}
    </div>
  );
}
```

## 2. RBAC Permission Check
```tsx
type Permission = 'read' | 'write' | 'delete';
type Module = 'users' | 'products' | 'orders' | 'disputes' | 'payouts' | 'delivery' | 'reports' | 'config' | 'roles';

interface AdminPermissions {
  [module: string]: Permission[];
}

export function hasPermission(permissions: AdminPermissions, module: Module, action: Permission): boolean {
  if (!permissions[module]) return false;
  return permissions[module].includes(action);
}

// Usage in component
function ProtectedAction({ permissions, module, action, children }) {
  if (!hasPermission(permissions, module, action)) return null;
  return <>{children}</>;
}
```

## 3. KPI Card Pattern
```tsx
interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change
  icon: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  );
}
```

## 4. Admin Sidebar Pattern
```tsx
const adminModules = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Users', path: '/admin/users', icon: '👥' },
  { name: 'Products', path: '/admin/products', icon: '📦' },
  { name: 'Orders', path: '/admin/orders', icon: '🛒' },
  { name: 'Disputes', path: '/admin/disputes', icon: '⚖️' },
  { name: 'Payouts', path: '/admin/payouts', icon: '💰' },
  { name: 'Delivery', path: '/admin/delivery', icon: '🚚' },
  { name: 'Reports', path: '/admin/reports', icon: '📈' },
  { name: 'Config', path: '/admin/config', icon: '⚙️', superAdminOnly: true },
  { name: 'Roles', path: '/admin/roles', icon: '🔐', superAdminOnly: true },
];
```

---

**For:** Teammate 3 Only — Do NOT share with T1 or T2
