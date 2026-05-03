-- ============================================================================
-- STEP 3 — Row-Level Security (RLS) Policies
-- Rentify P2P Rental Marketplace
-- Reference: PRD 7.2, STEP3.md, TECHNICAL_REFERENCE.md Section 2
-- Dependencies: 001_core_tables.sql + 002_remaining_tables.sql
-- ============================================================================

-- ============================================================================
-- 0. Enable RLS on ALL tables
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. users — Policies
-- Rules: Read own profile, update own profile, admins read all
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all user profiles
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow new user rows to be inserted during auth signup
-- (Supabase Auth creates the auth.users row; this allows the public.users insert)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Only admins can delete user accounts
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 2. products — Policies
-- Rules: Anyone reads active, lister manages own, admins manage all
-- ============================================================================

-- Anyone (authenticated) can view active products — public browse
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Listers can view ALL their own products (including pending/suspended/archived)
CREATE POLICY "Listers can view own products"
  ON products FOR SELECT
  USING (auth.uid() = lister_id);

-- Admins can view all products regardless of status
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Listers can create new product listings
CREATE POLICY "Listers can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = lister_id);

-- Listers can update their own products
CREATE POLICY "Listers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = lister_id)
  WITH CHECK (auth.uid() = lister_id);

-- Admins can update any product (approve, suspend, override pricing)
CREATE POLICY "Admins can update all products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Listers can delete (archive) their own products
CREATE POLICY "Listers can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = lister_id);

-- Admins can delete any product
CREATE POLICY "Admins can delete any product"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. product_pricing — Policies
-- Rules: Readable with product, writable by product's lister
-- ============================================================================

-- Anyone can read pricing for active products
CREATE POLICY "Anyone can view pricing for active products"
  ON product_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_pricing.product_id
      AND (products.status = 'active' OR products.lister_id = auth.uid())
    )
  );

-- Admins can view all pricing
CREATE POLICY "Admins can view all pricing"
  ON product_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Listers can insert pricing for their own products
CREATE POLICY "Listers can insert own product pricing"
  ON product_pricing FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_pricing.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- Listers can update pricing for their own products
CREATE POLICY "Listers can update own product pricing"
  ON product_pricing FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_pricing.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- Admins can update any pricing (override in exceptional cases per PRD 4.3.3)
CREATE POLICY "Admins can update any pricing"
  ON product_pricing FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Listers can delete pricing for their own products
CREATE POLICY "Listers can delete own product pricing"
  ON product_pricing FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_pricing.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. product_images — Policies
-- Rules: Readable with product, writable by product's lister
-- ============================================================================

-- Anyone can view images for active products
CREATE POLICY "Anyone can view images for active products"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND (products.status = 'active' OR products.lister_id = auth.uid())
    )
  );

-- Admins can view all images
CREATE POLICY "Admins can view all images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Listers can insert images for their own products
CREATE POLICY "Listers can insert own product images"
  ON product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- Listers can update images for their own products
CREATE POLICY "Listers can update own product images"
  ON product_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- Listers can delete images for their own products
CREATE POLICY "Listers can delete own product images"
  ON product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.lister_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. bookings — Policies
-- Rules: Renter and lister of a booking can read, admins read all
-- ============================================================================

-- Booking parties (renter or lister) can view their bookings
CREATE POLICY "Booking parties can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = renter_id
    OR auth.uid() = lister_id
  );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Authenticated users can create bookings (as renter)
CREATE POLICY "Renters can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

-- Booking parties can update booking status (lister approves/rejects, renter cancels)
CREATE POLICY "Booking parties can update own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = renter_id
    OR auth.uid() = lister_id
  );

-- Admins can update any booking (force-cancel per PRD 4.3.4)
CREATE POLICY "Admins can update any booking"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. booking_payments — Policies
-- Rules: Booking parties can read, system/admin creates/updates
-- ============================================================================

-- Booking parties can view payment details
CREATE POLICY "Booking parties can view payments"
  ON booking_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_payments.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON booking_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Renters can create payment records when booking
CREATE POLICY "Renters can insert payments"
  ON booking_payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_payments.booking_id
      AND bookings.renter_id = auth.uid()
    )
  );

-- Admins can update payment records
CREATE POLICY "Admins can update payments"
  ON booking_payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. installments — Policies
-- Rules: Booking parties can read, system handles status updates
-- ============================================================================

-- Booking parties can view their installments
CREATE POLICY "Booking parties can view installments"
  ON installments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = installments.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can view all installments
CREATE POLICY "Admins can view all installments"
  ON installments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- System/renter can create installment records
CREATE POLICY "Renters can insert installments"
  ON installments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = installments.booking_id
      AND bookings.renter_id = auth.uid()
    )
  );

-- Renters can update installments (mark as paid)
CREATE POLICY "Renters can update own installments"
  ON installments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = installments.booking_id
      AND bookings.renter_id = auth.uid()
    )
  );

-- Admins can update any installment
CREATE POLICY "Admins can update any installment"
  ON installments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. condition_photos — Policies
-- Rules: Booking parties + admins can view, captured_by user inserts
-- ============================================================================

-- Booking parties can view condition photos
CREATE POLICY "Booking parties can view condition photos"
  ON condition_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = condition_photos.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can view all condition photos (dispute review per PRD 4.3.5)
CREATE POLICY "Admins can view all condition photos"
  ON condition_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Users can insert photos they captured
CREATE POLICY "Users can insert own condition photos"
  ON condition_photos FOR INSERT
  WITH CHECK (auth.uid() = captured_by);

-- Only admins can delete condition photos
CREATE POLICY "Admins can delete condition photos"
  ON condition_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. disputes — Policies
-- Rules: Involved parties + admins can access
-- ============================================================================

-- Involved parties can view disputes (raiser + other booking party)
CREATE POLICY "Involved parties can view disputes"
  ON disputes FOR SELECT
  USING (
    auth.uid() = raised_by
    OR EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = disputes.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can view all disputes
CREATE POLICY "Admins can view all disputes"
  ON disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Users can raise disputes (lister raises damage claim per PRD 3.10)
CREATE POLICY "Users can raise disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = raised_by);

-- Involved parties can update disputes (renter submits response per PRD 3.10)
CREATE POLICY "Involved parties can update disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = disputes.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can update disputes (set verdict, deduction per PRD 3.10)
CREATE POLICY "Admins can resolve disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. payouts — Policies
-- Rules: Lister views own, admins manage all
-- ============================================================================

-- Listers can view their own payouts
CREATE POLICY "Listers can view own payouts"
  ON payouts FOR SELECT
  USING (auth.uid() = lister_id);

-- Admins can view all payouts
CREATE POLICY "Admins can view all payouts"
  ON payouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Only admins/system can create payout records
CREATE POLICY "Admins can insert payouts"
  ON payouts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Only admins can update payouts (release, block per PRD 4.3.6)
CREATE POLICY "Admins can update payouts"
  ON payouts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 11. delivery_orders — Policies
-- Rules: Agent + booking parties + admins can access
-- ============================================================================

-- Delivery agents can view their assigned orders
CREATE POLICY "Agents can view assigned deliveries"
  ON delivery_orders FOR SELECT
  USING (auth.uid() = agent_id);

-- Booking parties can view delivery orders for their bookings
CREATE POLICY "Booking parties can view delivery orders"
  ON delivery_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = delivery_orders.booking_id
      AND (bookings.renter_id = auth.uid() OR bookings.lister_id = auth.uid())
    )
  );

-- Admins can view all delivery orders
CREATE POLICY "Admins can view all delivery orders"
  ON delivery_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Only admins can create delivery orders (assign agents per PRD 4.3.7)
CREATE POLICY "Admins can insert delivery orders"
  ON delivery_orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Agents can update their assigned delivery orders (status changes)
CREATE POLICY "Agents can update assigned deliveries"
  ON delivery_orders FOR UPDATE
  USING (auth.uid() = agent_id);

-- Admins can update any delivery order (reassign agent per PRD 4.3.4)
CREATE POLICY "Admins can update any delivery order"
  ON delivery_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Only admins can delete delivery orders
CREATE POLICY "Admins can delete delivery orders"
  ON delivery_orders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 12. platform_config — Policies
-- Rules: Anyone can read, only super_admin can write
-- PRD 4.3.9: "Super Admin Only" — most critical module
-- ============================================================================

-- All authenticated users can read platform config
CREATE POLICY "Anyone can read platform config"
  ON platform_config FOR SELECT
  USING (true);

-- Only super_admins can insert config entries
CREATE POLICY "Super admins can insert config"
  ON platform_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'super_admin'
    )
  );

-- Only super_admins can update config entries
CREATE POLICY "Super admins can update config"
  ON platform_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'super_admin'
    )
  );

-- Only super_admins can delete config entries
CREATE POLICY "Super admins can delete config"
  ON platform_config FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'super_admin'
    )
  );

-- ============================================================================
-- 13. admin_roles — Policies
-- Rules: Only super_admin can read/write
-- PRD 4.3.10: "Super Admin Only" — role & permission management
-- ============================================================================

-- Super admins can view all admin roles
CREATE POLICY "Super admins can view admin roles"
  ON admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles AS ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- Users can view their own admin role (so they can check their permissions)
CREATE POLICY "Users can view own admin role"
  ON admin_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Only super admins can create admin roles
CREATE POLICY "Super admins can insert admin roles"
  ON admin_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles AS ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- Only super admins can update admin roles (edit permissions per PRD 4.3.10)
CREATE POLICY "Super admins can update admin roles"
  ON admin_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles AS ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- Only super admins can delete admin roles
CREATE POLICY "Super admins can delete admin roles"
  ON admin_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles AS ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check RLS is enabled on all tables:
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
