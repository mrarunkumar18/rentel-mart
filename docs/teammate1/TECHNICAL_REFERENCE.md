# Teammate 1 — Technical Reference

**Supabase SQL · PostgreSQL Patterns · RLS · TypeScript Types**

---

## 1. Supabase Table Creation

### Basic Table with UUID Primary Key
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table with Foreign Key
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lister_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  original_value DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### JSONB Column (for flexible data)
```sql
CREATE TABLE admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'operations', 'finance', 'content', 'custom')),
  permissions_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Adding Indexes
```sql
CREATE INDEX idx_products_lister ON products(lister_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_lister ON bookings(lister_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_product ON bookings(product_id);
```

---

## 2. Row-Level Security (RLS)

### Enable RLS on a Table
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Policy: Users Can Read Their Own Data
```sql
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### Policy: Users Can Update Their Own Data
```sql
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Policy: Anyone Can Read Active Products
```sql
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active');
```

### Policy: Listers Can Manage Their Own Products
```sql
CREATE POLICY "Listers can manage own products"
  ON products FOR ALL
  USING (auth.uid() = lister_id)
  WITH CHECK (auth.uid() = lister_id);
```

### Policy: Admins Can Read Everything
```sql
CREATE POLICY "Admins can view all records"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );
```

### Policy: Booking Parties Can View
```sql
CREATE POLICY "Booking parties can view"
  ON bookings FOR SELECT
  USING (
    auth.uid() = renter_id
    OR auth.uid() = lister_id
    OR EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );
```

---

## 3. TypeScript Type Patterns

### Table Type Definition
```typescript
// src/types/database.ts

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'user' | 'admin' | 'super_admin';
```

### Insert Type (omit auto-generated fields)
```typescript
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
```

### Update Type (all fields optional)
```typescript
export type UserUpdate = Partial<UserInsert>;
```

### Enum Types
```typescript
export type BookingStatus =
  | 'pending_approval'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type ProductStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'archived';

export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'resolved';

export type PayoutStatus =
  | 'pending'
  | 'on_hold'
  | 'released'
  | 'blocked';

export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'collected';

export type LateFeeUnit =
  | 'per_hour'
  | 'per_6_hours'
  | 'per_day';

export type PaymentPlanType =
  | 'upfront'
  | 'weekly'
  | 'monthly';

export type PlatformFeeType =
  | 'transaction_percentage'
  | 'flat_fee'
  | 'subscription';
```

---

## 4. Supabase Client Setup

### Browser Client
```typescript
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client (for API routes)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Helper Functions
```typescript
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return !!data;
}
```

---

## 5. Calculation Engine Patterns

### Pure Function Pattern
```typescript
// All engine functions should be pure — no side effects, no database calls

export function calculateSecurityDeposit(
  productOriginalValue: number,
  depositPercentage: number = 20
): number {
  return (productOriginalValue * depositPercentage) / 100;
}

export function calculatePayoutHoldPeriod(
  rentalDurationDays: number
): number {
  if (rentalDurationDays <= 3) return 2;
  if (rentalDurationDays <= 7) return 5;
  if (rentalDurationDays <= 14) return 7;
  if (rentalDurationDays <= 30) return 10;
  return 14;
}
```

---

## 6. Supabase Storage (for condition photos)

### Upload a Photo
```typescript
const { data, error } = await supabase.storage
  .from('condition-photos')
  .upload(`bookings/${bookingId}/pickup/${fileName}`, file, {
    contentType: 'image/jpeg',
    upsert: false,
  });
```

### Get Signed URL
```typescript
const { data } = await supabase.storage
  .from('condition-photos')
  .createSignedUrl(`bookings/${bookingId}/pickup/${fileName}`, 3600);
```

---

**Document Version:** 1.0  
**For:** Teammate 1 Only — Do NOT share with T2 or T3
