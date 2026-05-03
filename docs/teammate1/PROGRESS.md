# Teammate 1 — Progress Tracker

**Update this file after completing each step.**

---

## Step 1 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- SQL migration file: `/supabase/schema/001_core_tables.sql`
- `users` table — UUID PK, email (UNIQUE), full_name, phone, role (CHECK: user/admin/super_admin), avatar_url, address, city, timestamps
- `products` table — UUID PK, FK → users(id) ON DELETE CASCADE, title, description, category, original_value, condition, delivery_option (CHECK), status (CHECK), timestamps
- `product_pricing` table — UUID PK, FK → products(id) ON DELETE CASCADE, per_day/week/month/year rates, late_fee_rate, late_fee_unit (CHECK), UNIQUE(product_id)
- `product_images` table — UUID PK, FK → products(id) ON DELETE CASCADE, url, is_primary, created_at
- `update_updated_at_column()` trigger function for auto-updating `updated_at` columns
- Triggers applied on `users` and `products` tables

**Time Spent:** ~30 minutes

**Issues Encountered:**
- None

**Next Step:** Step 2 — Remaining tables + indexes

**Notes:** SQL file ready to execute in Supabase SQL Editor. Verification queries included as comments at the bottom of the file. The `update_updated_at_column()` trigger function is reusable for future tables in Step 2.

---

## Step 2 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- SQL migration file: `/supabase/schema/002_remaining_tables.sql` — 9 tables
  - `bookings` — FK → products, users (renter + lister), status lifecycle, delivery_method
  - `booking_payments` — FK → bookings (UNIQUE), rent, deposit, fees, payment_plan, total_due
  - `installments` — FK → bookings, due_date, amount, status, paid_at
  - `condition_photos` — FK → bookings + users (captured_by), type CHECK (pickup/return)
  - `disputes` — FK → bookings + users (raised_by, admin_id), verdict, deduction_amount
  - `payouts` — FK → users (lister) + bookings, gross/deductions/net, hold_until
  - `delivery_orders` — FK → bookings + users (agent_id), type CHECK (deliver/collect), status lifecycle
  - `platform_config` — key-value store, FK → users (updated_by)
  - `admin_roles` — FK → users (UNIQUE), role CHECK, permissions_json JSONB
- SQL migration file: `/supabase/schema/003_indexes.sql` — 12 performance indexes
  - bookings: renter_id, lister_id, status, product_id
  - products: lister_id, status, category
  - disputes: booking_id, status
  - payouts: lister_id, status
  - delivery_orders: booking_id
- Auto-update triggers on `bookings` and `delivery_orders` tables

**Time Spent:** ~30 minutes

**Issues Encountered:**
- None

**Next Step:** Step 3 — RLS policies

**Notes:** All 13 tables now complete (4 from Step 1 + 9 from Step 2). Reused `update_updated_at_column()` trigger from Step 1. Run files in order: 001 → 002 → 003 in Supabase SQL Editor.

---

## Step 3 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- SQL migration file: `/supabase/schema/004_rls_policies.sql`
  - RLS enabled on all 13 tables
  - 50+ granular policies covering SELECT/INSERT/UPDATE/DELETE per table
  - **users:** own profile CRUD + admin read/delete
  - **products:** public read (active), lister CRUD (own), admin full access
  - **product_pricing / product_images:** inherit from product ownership
  - **bookings:** renter + lister party read/update, admin full access
  - **booking_payments:** booking parties read, renter insert, admin update
  - **installments:** booking parties read, renter insert/update, admin update
  - **condition_photos:** booking parties read, captured_by insert, admin delete
  - **disputes:** involved parties + admin read/update, raised_by insert
  - **payouts:** lister read own, admin full CRUD
  - **delivery_orders:** agent + booking parties read, agent update, admin full CRUD
  - **platform_config:** public read, super_admin-only write
  - **admin_roles:** super_admin-only CRUD + users read own role
- SQL migration file: `/supabase/schema/005_storage_buckets.sql`
  - `product-images` bucket — public read, auth upload, 5MB limit, image MIME types
  - `condition-photos` bucket — private (signed URLs only), auth upload, 5MB limit
  - Storage-level RLS policies on both buckets

**Time Spent:** ~30 minutes

**Issues Encountered:**
- None

**Next Step:** Step 4 — TypeScript types

**Notes:** Storage bucket SQL uses `storage.buckets` insert — if this doesn't work in the SQL Editor, create buckets manually via Dashboard → Storage. Run order: 001 → 002 → 003 → 004 → 005.

---

## Step 4 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- `/src/types/database.ts` — Complete type definitions for all 13 tables
  - **15 enum types:** UserRole, ProductStatus, ProductCondition, DeliveryOption, BookingStatus, DeliveryMethod, PaymentPlanType, InstallmentStatus, ConditionPhotoType, DisputeStatus, PayoutStatus, DeliveryOrderType, DeliveryStatus, LateFeeUnit, PlatformFeeType, AdminRole
  - **13 table interfaces:** User, Product, ProductPricing, ProductImage, Booking, BookingPayment, Installment, ConditionPhoto, Dispute, Payout, DeliveryOrder, PlatformConfig, AdminRoleEntry
  - **13 insert types:** Omit auto-generated fields (id, created_at, updated_at)
  - **13 update types:** Partial of insert types
  - **7 join types:** ProductWithDetails, ProductWithPricing, ProductWithImages, BookingWithDetails, BookingWithProduct, DisputeWithContext, PayoutWithContext, UserWithAdminRole
  - **PlatformConfigKey** union type — all 20 config keys from PRD 4.3.9
  - **TableName** union type, **ProductCategory** union type
  - Zero `any` types, all fields match Supabase schema exactly

**Time Spent:** ~20 minutes

**Issues Encountered:**
- None — `npx tsc --noEmit --strict` passes with zero errors

**Next Step:** Step 5 — Supabase client

**Notes:** All types use string unions (not TypeScript enums) for Supabase compatibility. Join types model common query result shapes for T2/T3 consumption. PRD 3.9 payout hold tiers expanded with `payout_hold_extended` and `payout_hold_max` config keys for the 5-tier system.

---

## Step 5 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- `/src/lib/supabase.ts` — Complete Supabase client setup
  - **3 client types:**
    - `createClient()` — Browser client for client components (uses anon key, goes through RLS)
    - `createServerSupabaseClient(cookieStore)` — Server client for server components/API routes (async cookies pattern for Next.js 16)
    - `createServiceRoleClient()` — Admin client that bypasses RLS (server-only, throws if key missing)
  - **8 helper functions:**
    - `getCurrentUser()` — Browser-side: returns typed `User | null`
    - `getServerCurrentUser(cookieStore)` — Server-side: returns typed `User | null`
    - `isAdmin(userId)` — Browser-side: checks admin_roles table
    - `isServerAdmin(cookieStore, userId)` — Server-side admin check
    - `getUserRole(userId)` — Browser-side: returns `AdminRole | null`
    - `getServerUserRole(cookieStore, userId)` — Server-side role check
    - `getAdminPermissions(userId)` — Returns full `AdminRoleEntry` with permissions_json
  - All functions type-safe against `/src/types/database.ts`
  - No credentials exposed client-side (only `NEXT_PUBLIC_` vars)

**Time Spent:** ~20 minutes

**Issues Encountered:**
- None — `npx tsc --noEmit` passes with zero errors

**Next Step:** Step 6 — Calculation engines

**Notes:** Server client uses Next.js 16 async `cookies()` pattern (pass awaited cookieStore). Service role client is for admin operations only — never import in client components. Both browser and server helpers provided for each function to support both rendering contexts.

---

## Step 6 - 2026-05-03 - [x] COMPLETED

**Status:** ✅ COMPLETED

**What Was Built:**
- `/src/lib/engines.ts` — 9 pure calculation engine functions:
  1. `calculateRentalPrice(pricing, startDate, endDate)` — Optimal tier selection (day/week/month/year) with fallback
  2. `calculateSecurityDeposit(productValue, pct=20)` — Configurable deposit percentage
  3. `calculateLateFee(rate, unit, hoursOverdue)` — Accrual by per_hour/per_6_hours/per_day
  4. `calculatePlatformFee(rentalValue, feeConfig)` — Supports all 3 fee models simultaneously
  5. `calculatePayoutHoldPeriod(durationDays)` — 5-tier: 2/5/7/10/14 days
  6. `calculatePayoutBreakdown(gross, platformFee, deductions)` — Net = gross - fees - deductions
  7. `determinePaymentPlan(durationDays)` — ≤7d: upfront, 8-30d: +weekly, >30d: +monthly
  8. `splitInstallments(total, plan, startDate, endDate)` — Equal split with remainder on first
  9. `calculateTotalDue(rent, deposit, deliveryFee)` — Renter's total at booking
- Result type interfaces: `RentalPriceResult`, `PlatformFeeResult`, `FeeConfig`, `PayoutBreakdownResult`, `InstallmentBreakdown`
- `/src/lib/__tests__/engines.test.ts` — 70 unit tests + 1 integration test
- `vitest.config.ts` — Vitest configuration with path aliases
- Test scripts added to `package.json`: `test`, `test:watch`, `test:coverage`

**Time Spent:** ~30 minutes

**Issues Encountered:**
- None — all 70 tests pass, 100% coverage achieved

**Test Coverage:**
```
Statements : 100% (81/81)
Branches   : 100% (55/55)
Functions  : 100% (9/9)
Lines      : 100% (71/71)
```

**Next Step:** Step 7 — Mock data + colors + final testing

**Notes:** All engine functions are pure — zero side effects, zero DB calls. FeeConfig interface allows runtime configuration from platform_config table. All monetary calculations use `Math.round(x * 100) / 100` for INR precision.

---

## Step 7 - [DATE] - [ ] NOT STARTED

**Status:** ⬜ NOT STARTED

**What Was Built:**
- [List deliverables]

**Time Spent:** [H hours, M minutes]

**Issues Encountered:**
- [Issue and resolution]

**Next Step:** Phase 4 integration

**Notes:** [Context for Phase 4]
