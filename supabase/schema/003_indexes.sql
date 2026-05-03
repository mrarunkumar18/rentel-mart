-- ============================================================================
-- STEP 2 (continued) — Performance Indexes
-- Rentify P2P Rental Marketplace
-- Dependencies: 001_core_tables.sql + 002_remaining_tables.sql
-- ============================================================================
-- These indexes target frequently queried columns identified from:
-- - PRD 7.1: "Supabase queries must include proper indexes on booking status,
--   user ID, and product ID fields"
-- - STEP2.md: Explicit index list
-- ============================================================================

-- Bookings — queried by status, renter, lister, product on nearly every screen
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_lister ON bookings(lister_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_product ON bookings(product_id);

-- Products — browsed by category, filtered by status, listed per user
CREATE INDEX idx_products_lister ON products(lister_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);

-- Disputes — queried by booking and status in admin panel
CREATE INDEX idx_disputes_booking ON disputes(booking_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Payouts — filtered by lister and status in admin/lister dashboards
CREATE INDEX idx_payouts_lister ON payouts(lister_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- Delivery orders — looked up by booking for order tracking
CREATE INDEX idx_delivery_booking ON delivery_orders(booking_id);

-- ============================================================================
-- Verification Query
-- ============================================================================

-- List all custom indexes:
-- SELECT indexname, tablename
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;
