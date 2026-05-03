# STEP 2 — Remaining Tables + Foreign Keys + Indexes

**Day:** 2 | **Dependencies:** Step 1 | **Estimated Time:** 4-6 hours

---

## Objectives
1. Create remaining 8+ tables: `bookings`, `booking_payments`, `installments`, `condition_photos`, `disputes`, `payouts`, `delivery_orders`, `platform_config`, `admin_roles`
2. Establish all foreign key relationships
3. Add performance indexes on frequently queried columns

## Instructions

### 2.1 — `bookings` Table
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id),
  renter_id UUID NOT NULL REFERENCES users(id),
  lister_id UUID NOT NULL REFERENCES users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  delivery_method TEXT DEFAULT 'self_pickup' CHECK (delivery_method IN ('platform', 'self_pickup')),
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'confirmed', 'active', 'completed', 'cancelled', 'disputed')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 — `booking_payments` Table
```sql
CREATE TABLE booking_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rent_total DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  payment_plan TEXT DEFAULT 'upfront' CHECK (payment_plan IN ('upfront', 'weekly', 'monthly')),
  total_due DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);
```

### 2.3 — `installments` Table
```sql
CREATE TABLE installments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ
);
```

### 2.4 — `condition_photos` Table
```sql
CREATE TABLE condition_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'return')),
  url TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  captured_by UUID NOT NULL REFERENCES users(id)
);
```

### 2.5 — `disputes` Table
```sql
CREATE TABLE disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id),
  raised_by UUID NOT NULL REFERENCES users(id),
  admin_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved')),
  claim_notes TEXT,
  renter_response TEXT,
  verdict TEXT,
  deduction_amount DECIMAL(10,2) DEFAULT 0,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

### 2.6 — `payouts` Table
```sql
CREATE TABLE payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lister_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  gross_amount DECIMAL(10,2) NOT NULL,
  deductions DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'on_hold', 'released', 'blocked')),
  hold_until DATE,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.7 — `delivery_orders` Table
```sql
CREATE TABLE delivery_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id),
  agent_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('deliver', 'collect')),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'delivered', 'collected')),
  pickup_address TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.8 — `platform_config` Table
```sql
CREATE TABLE platform_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.9 — `admin_roles` Table
```sql
CREATE TABLE admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'operations', 'finance', 'content', 'custom')),
  permissions_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### 2.10 — Performance Indexes
```sql
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_lister ON bookings(lister_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_product ON bookings(product_id);
CREATE INDEX idx_products_lister ON products(lister_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_disputes_booking ON disputes(booking_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_payouts_lister ON payouts(lister_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_delivery_booking ON delivery_orders(booking_id);
```

## Testing
- Verify all 12+ tables exist in Supabase
- Test FK constraints: insert booking with non-existent product → should fail
- Test CHECK constraints: insert booking with invalid status → should fail
- Verify indexes exist via Supabase SQL editor

## After Completion
Update PROGRESS.md → Step 2. Commit: `[STEP-2] - Remaining tables, foreign keys, and indexes`
