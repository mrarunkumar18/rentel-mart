-- ============================================================================
-- STEP 1 — Core Tables: users, products, product_pricing, product_images
-- Rentify P2P Rental Marketplace
-- Reference: PRD Part 2.4 — Database Schema (Core Tables)
-- ============================================================================

-- ============================================================================
-- 0. Utility: Auto-update trigger for updated_at columns
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. users
-- Single table for all user types (Renter, Lister, Admin, Super Admin)
-- PRD 1.3: Any registered user can list AND rent — single account, dual roles
-- ============================================================================

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row modification
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. products
-- Listed items available for rent
-- PRD 3.6.1: Lister creates listing with title, description, category, value
-- PRD 3.3.2: original_value used to calculate 20% security deposit
-- ============================================================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lister_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  original_value DECIMAL(10,2) NOT NULL,
  condition TEXT DEFAULT 'good',
  delivery_option TEXT DEFAULT 'both' CHECK (delivery_option IN ('platform', 'self_pickup', 'both')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row modification
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. product_pricing
-- Flexible pricing per product: per day / week / month / year
-- PRD 3.6.1: Lister enables applicable pricing tiers and sets rates
-- PRD 3.11: Late return fee rate and unit configured per product
-- ============================================================================

CREATE TABLE product_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  per_day DECIMAL(10,2),
  per_week DECIMAL(10,2),
  per_month DECIMAL(10,2),
  per_year DECIMAL(10,2),
  late_fee_rate DECIMAL(10,2) DEFAULT 0,
  late_fee_unit TEXT DEFAULT 'per_day' CHECK (late_fee_unit IN ('per_hour', 'per_6_hours', 'per_day')),
  UNIQUE(product_id)
);

-- ============================================================================
-- 4. product_images
-- Product listing photos stored in Supabase Storage
-- PRD 3.6.1: 3 minimum, 10 maximum images per listing
-- ============================================================================

CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Verification Queries (run after executing the above)
-- ============================================================================

-- Check all 4 tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('users', 'products', 'product_pricing', 'product_images');

-- Test: Insert a user
-- INSERT INTO users (email, full_name, phone)
-- VALUES ('test@rentify.com', 'Test User', '+91-9876543210');

-- Test: Insert a product linked to that user
-- INSERT INTO products (lister_id, title, category, original_value)
-- VALUES ((SELECT id FROM users LIMIT 1), 'Test Camera', 'Electronics', 50000.00);

-- Test: FK constraint — should FAIL with non-existent lister_id
-- INSERT INTO products (lister_id, title, category, original_value)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Bad Product', 'Test', 100.00);

-- Test: CHECK constraint — should FAIL with invalid status
-- INSERT INTO products (lister_id, title, category, original_value, status)
-- VALUES ((SELECT id FROM users LIMIT 1), 'Bad Status', 'Test', 100.00, 'invalid');
