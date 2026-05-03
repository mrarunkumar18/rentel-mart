# Teammate 1 — Work Breakdown

**7 Steps | 1 per Day | Dependencies Tracked**

---

## Step 1 — Supabase Project Setup + Core Tables
**Day:** 1  
**Dependencies:** None  
**Deliverables:**
- Supabase project created and configured
- Core tables created: `users`, `products`, `product_pricing`, `product_images`
- All fields, data types, and primary keys set per PRD Part 2.4
- Foreign key relationships established

**Testing:**
- [ ] Tables visible in Supabase dashboard
- [ ] Field types match PRD specification
- [ ] Primary keys auto-generate
- [ ] No constraint violations on test inserts

---

## Step 2 — Remaining Tables + Foreign Keys + Indexes
**Day:** 2  
**Dependencies:** Step 1  
**Deliverables:**
- Remaining tables: `bookings`, `booking_payments`, `installments`, `condition_photos`, `disputes`, `payouts`, `delivery_orders`, `platform_config`, `admin_roles`
- All foreign key relationships between tables
- Indexes on: `bookings.status`, `bookings.renter_id`, `bookings.lister_id`, `products.lister_id`, `products.category`, `products.status`

**Testing:**
- [ ] All 12+ tables created
- [ ] Foreign keys enforce referential integrity
- [ ] Indexes created and verified
- [ ] Test data insertions respect constraints

---

## Step 3 — RLS Policies
**Day:** 3  
**Dependencies:** Steps 1-2  
**Deliverables:**
- RLS enabled on ALL tables
- User policies: users can only read/write their own data
- Product policies: anyone can read active products, only lister can edit their own
- Booking policies: renter and lister of a booking can read it, only system creates
- Admin policies: admin roles can read all data based on permissions
- Dispute policies: involved parties + admins can access
- Platform config: only super_admin can write, anyone can read

**Testing:**
- [ ] RLS enabled confirmed on all tables
- [ ] Test: Regular user cannot access another user's bookings
- [ ] Test: Lister can only edit their own products
- [ ] Test: Admin can view all bookings
- [ ] Test: Non-admin cannot access admin_roles table

---

## Step 4 — TypeScript Strict Types
**Day:** 4  
**Dependencies:** Steps 1-2 (schema finalized)  
**Deliverables:**
- `/src/types/database.ts` — Complete type definitions for all tables
- Enum types for all status fields (booking_status, product_status, dispute_status, etc.)
- Insert types (fields required for creation)
- Update types (partial fields for updates)
- Join types (common query result shapes)

**Testing:**
- [ ] TypeScript compiles with `strict: true`
- [ ] No `any` types used
- [ ] All enum values match PRD specifications
- [ ] Types match Supabase table schema exactly

---

## Step 5 — Supabase Client Setup
**Day:** 5  
**Dependencies:** Steps 1-4  
**Deliverables:**
- `/src/lib/supabase.ts` — Browser client (for client components)
- Server client setup (for API routes and server components)
- Helper functions: `getCurrentUser()`, `isAdmin()`, `getUserRole()`
- Type-safe query builders using generated types

**Testing:**
- [ ] Browser client connects to Supabase
- [ ] Server client connects to Supabase
- [ ] `getCurrentUser()` returns typed user object
- [ ] RLS policies work through client queries
- [ ] No credentials exposed to client-side code

---

## Step 6 — Calculation Engines
**Day:** 6  
**Dependencies:** Step 4 (types needed)  
**Deliverables:**
- `/src/lib/engines.ts` — All calculation functions:
  - `calculateRentalPrice(productPricing, startDate, endDate)` — optimal pricing tier
  - `calculateSecurityDeposit(productValue, depositPct)` — 20% default
  - `calculateLateFee(lateFeeRate, lateFeeUnit, hoursOverdue)` — accrual calculation
  - `calculatePlatformFee(rentalValue, feeConfig)` — supports all 3 models
  - `calculatePayoutHoldPeriod(rentalDuration)` — hold days per PRD 3.9
  - `calculatePayoutBreakdown(booking, config)` — gross, deductions, net
  - `determinePaymentPlan(durationDays)` — upfront vs installments rules
- All functions are pure (no side effects), fully typed, and tested

**Testing:**
- [ ] Each function returns correct values for sample inputs
- [ ] Edge cases: 0-day rental, 365-day rental, multiple fee models active
- [ ] Late fee accrual matches per-hour / per-6-hours / per-day units
- [ ] Payment plan rules match PRD 3.4.1 exactly

---

## Step 7 — Mock Data Seeding + Color Tokens + Final Testing
**Day:** 7  
**Dependencies:** Steps 1-6  
**Deliverables:**
- `/src/lib/colors.ts` — Exported color constants matching COLOR_THEME.md
- `/src/mocks/seed.ts` — Comprehensive mock data:
  - 5+ users (mix of renters and listers)
  - 10+ products across multiple categories
  - 5+ bookings in various statuses
  - Sample disputes, payouts, delivery orders
  - Platform config with default values
- All mock data uses the exact types from Step 4
- Final end-to-end testing of all engines with mock data

**Testing:**
- [ ] Color tokens match COLOR_THEME.md exactly
- [ ] Mock data passes TypeScript type checking
- [ ] All engines produce correct results with mock data
- [ ] RLS policies work correctly with mock user sessions
- [ ] Full PROGRESS.md updated for all 7 steps
- [ ] Ready for Phase 4 integration

---

## Summary

| Step | Day | Focus | Output Files |
|------|-----|-------|-------------|
| 1 | 1 | Core tables | Supabase schema |
| 2 | 2 | All tables + indexes | Supabase schema |
| 3 | 3 | RLS policies | Supabase policies |
| 4 | 4 | TypeScript types | `/src/types/database.ts` |
| 5 | 5 | Supabase client | `/src/lib/supabase.ts` |
| 6 | 6 | Calculation engines | `/src/lib/engines.ts` |
| 7 | 7 | Mock data + colors | `/src/lib/colors.ts`, `/src/mocks/seed.ts` |
