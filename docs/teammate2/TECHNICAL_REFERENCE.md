# Teammate 2 — Technical Reference

**React/Next.js 14 · Tailwind CSS · shadcn/ui · Hooks · Forms**

---

## 1. Next.js App Router Patterns

### Page Component (Server Component by default)
```tsx
// src/app/(renter)/dashboard/page.tsx
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { mockDashboardData } from '@/mocks/dashboard';

export default function DashboardPage() {
  // PHASE4-SWAP: Replace mock with real data fetch
  const data = mockDashboardData;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardStats data={data} />
    </main>
  );
}
```

### Client Component (for interactivity)
```tsx
'use client';

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
      className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
      aria-label="Search products"
    />
  );
}
```

### Route Group Layout
```tsx
// src/app/(renter)/layout.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

## 2. Tailwind CSS with Rentify Colors

### Using Theme Colors
```tsx
// Primary CTA button
<button className="bg-primary hover:bg-secondary active:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors">
  Book Now
</button>

// Secondary button
<button className="bg-accent text-primary hover:bg-secondary/20 px-6 py-2 rounded-lg border border-primary/20">
  Cancel
</button>

// Card with accent background
<div className="bg-accent rounded-xl p-6 shadow-sm">
  {/* card content */}
</div>

// Focus ring (accessibility)
<input className="focus:ring-2 focus:ring-secondary focus:outline-none" />
```

### Status Badge Pattern
```tsx
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-orange-100 text-orange-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
}
```

---

## 3. shadcn/ui Component Usage

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
```

### Form Input
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Dialog/Modal
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Booking</DialogTitle>
    </DialogHeader>
    {/* modal content */}
  </DialogContent>
</Dialog>
```

---

## 4. Mock Data Pattern

```typescript
// src/mocks/products.ts
// PHASE4-SWAP: Replace this entire file with real API calls

export const mockProducts = [
  {
    id: 'PROD001',
    title: 'Canon EOS R5 Camera',
    category: 'Electronics',
    original_value: 250000,
    status: 'active',
    pricing: { per_day: 2500, per_week: 15000, per_month: 50000 },
    images: [{ url: '/placeholder-camera.jpg', is_primary: true }],
    lister: { full_name: 'Rahul Sharma', id: 'USR002' },
  },
  // ... more products
];
```

---

## 5. Form Validation Pattern

```tsx
'use client';
import { useState } from 'react';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (email: string, password: string): boolean => {
    const newErrors: FormErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ...
}
```

---

**Document Version:** 1.0  
**For:** Teammate 2 Only — Do NOT share with T1 or T3
