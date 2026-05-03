-- ============================================================================
-- STEP 2 — Remaining Tables + Foreign Keys
-- Rentify P2P Rental Marketplace
-- Reference: PRD Part 2.4 — Database Schema
-- Dependencies: 001_core_tables.sql must be executed first
-- ============================================================================

-- ============================================================================
-- 1. bookings
-- Core rental record linking product, renter, and lister
-- PRD 3.4: Booking flow — renter selects dates, delivery method
-- PRD 3.5: Status lifecycle — pending → confirmed → active → completed
-- ============================================================================

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

-- Auto-update updated_at on row modification
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. booking_payments
-- Financial record per booking: rent, deposit, fees, payment plan
-- PRD 3.4.1: Cost breakdown — rent total, deposit (20%), delivery, platform fee
-- PRD 3.4.1: Payment plan rules based on duration
-- ============================================================================

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

-- ============================================================================
-- 3. installments
-- Payment plan tracking for weekly/monthly installments
-- PRD 3.4.1: Duration ≤7d → upfront, 8-30d → weekly, >30d → monthly
-- ============================================================================

CREATE TABLE installments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ
);

-- ============================================================================
-- 4. condition_photos
-- Mandatory evidence photos at pickup and return
-- PRD 3.7: Minimum 3 photos at each stage, auto-tagged with metadata
-- PRD 7.2: Stored in private Supabase Storage, accessed via signed URLs
-- ============================================================================

CREATE TABLE condition_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'return')),
  url TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  captured_by UUID NOT NULL REFERENCES users(id)
);

-- ============================================================================
-- 5. disputes
-- Damage claims raised by lister within 24 hours of return
-- PRD 3.10: Admin-arbitrated using pickup vs return photo evidence
-- PRD 3.10: Deduction 0-100% of deposit, verdict stored
-- ============================================================================

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

-- ============================================================================
-- 6. payouts
-- Lister earnings with hold period based on rental duration
-- PRD 3.9: Hold period — 2/5/7/10/14 days based on rental duration tier
-- PRD 5.3: Gross − Platform Fee = Net Payout
-- ============================================================================

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

-- ============================================================================
-- 7. delivery_orders
-- Platform delivery management — outbound (deliver) and inbound (collect)
-- PRD 3.8: Agent assigned by admin, captures photos, marks delivered/collected
-- ============================================================================

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

-- Auto-update updated_at on row modification
CREATE TRIGGER set_delivery_orders_updated_at
  BEFORE UPDATE ON delivery_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. platform_config
-- Admin-controlled key-value settings — all platform parameters
-- PRD 4.3.9: No values hardcoded — all fees, deposits, limits set here
-- ============================================================================

CREATE TABLE platform_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. admin_roles
-- RBAC for admin panel access
-- PRD 4.2: Super admin, operations, finance, content, custom roles
-- PRD 4.2: Permissions stored as JSON — toggled per module by super admin
-- ============================================================================

CREATE TABLE admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'operations', 'finance', 'content', 'custom')),
  permissions_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- Verification Queries (run after executing the above)
-- ============================================================================

-- Check all 13 tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- Test: FK constraint on bookings — should FAIL with non-existent product_id
-- INSERT INTO bookings (product_id, renter_id, lister_id, start_date, end_date)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   '00000000-0000-0000-0000-000000000000',
--   '00000000-0000-0000-0000-000000000000',
--   '2026-06-01', '2026-06-07'
-- );

-- Test: CHECK constraint on bookings — should FAIL with invalid status
-- INSERT INTO bookings (product_id, renter_id, lister_id, start_date, end_date, status)
-- VALUES (
--   (SELECT id FROM products LIMIT 1),
--   (SELECT id FROM users LIMIT 1),
--   (SELECT id FROM users LIMIT 1),
--   '2026-06-01', '2026-06-07', 'invalid_status'
-- );

-- Test: UNIQUE constraint on admin_roles — should FAIL on duplicate user_id
-- (insert same user_id twice)

-- Test: JSONB field on admin_roles
-- INSERT INTO admin_roles (user_id, role, permissions_json)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'operations',
--   '{"orders": true, "deliveries": true, "returns": true, "disputes": true}'::JSONB
-- );
