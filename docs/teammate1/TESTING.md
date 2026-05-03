# Teammate 1 — Testing Checklist

**Type:** Unit Tests + Manual Verification  
**Test after each step, before committing.**

---

## Step 1 Tests — Core Tables

- [ ] `users` table exists with all fields from PRD
- [ ] `products` table exists with all fields
- [ ] `product_pricing` table exists with flexible pricing fields
- [ ] `product_images` table exists with `is_primary` flag
- [ ] Primary keys auto-generate (UUID)
- [ ] Can insert a test user record
- [ ] Can insert a test product linked to a user
- [ ] Foreign key `products.lister_id` → `users.id` enforced

## Step 2 Tests — All Tables

- [ ] All 12+ tables created per PRD Part 2.4
- [ ] `bookings` table links renter, lister, and product correctly
- [ ] `booking_payments` links to bookings with all financial fields
- [ ] `installments` table supports payment plan tracking
- [ ] `condition_photos` has type enum (pickup/return)
- [ ] `disputes` links to bookings with verdict fields
- [ ] `payouts` links to lister and booking
- [ ] `delivery_orders` links to booking and agent
- [ ] `platform_config` has key-value structure
- [ ] `admin_roles` has `permissions_json` JSONB field
- [ ] Indexes on frequently queried fields verified

## Step 3 Tests — RLS Policies

- [ ] RLS enabled on ALL tables (verify in Supabase dashboard)
- [ ] Test as User A: Can read own profile ✓
- [ ] Test as User A: Cannot read User B's profile ✗
- [ ] Test as User A: Can read all active products ✓
- [ ] Test as Lister: Can edit own products ✓
- [ ] Test as Lister: Cannot edit another lister's products ✗
- [ ] Test as Renter: Can read own bookings ✓
- [ ] Test as Renter: Cannot read another renter's bookings ✗
- [ ] Test as Admin: Can read all users ✓
- [ ] Test as Admin: Can read all bookings ✓
- [ ] Test as Non-admin: Cannot access admin_roles ✗
- [ ] Test: platform_config readable by all, writable by super_admin only

## Step 4 Tests — TypeScript Types

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All table types defined in `/src/types/database.ts`
- [ ] Enum types cover all status values from PRD
- [ ] Insert types exclude auto-generated fields (id, created_at)
- [ ] Update types are Partial<> of insert types
- [ ] No `any` types used anywhere

## Step 5 Tests — Supabase Client

- [ ] Browser client initializes without errors
- [ ] Server client initializes without errors
- [ ] `getCurrentUser()` returns typed user or null
- [ ] `isAdmin()` correctly checks admin_roles
- [ ] Query returns typed results (no implicit any)
- [ ] Environment variables properly loaded
- [ ] No credentials exposed in client-side bundle

## Step 6 Tests — Calculation Engines

- [ ] `calculateRentalPrice`: 3-day rental uses per_day rate
- [ ] `calculateRentalPrice`: 14-day rental uses per_week rate (2 weeks)
- [ ] `calculateRentalPrice`: 45-day rental uses per_month rate
- [ ] `calculateSecurityDeposit`: 20% of ₹10,000 = ₹2,000
- [ ] `calculateSecurityDeposit`: Custom percentage works
- [ ] `calculateLateFee`: Per-hour accrual correct
- [ ] `calculateLateFee`: Per-6-hour accrual correct
- [ ] `calculateLateFee`: Per-day accrual correct
- [ ] `calculatePlatformFee`: Transaction percentage model
- [ ] `calculatePlatformFee`: Flat fee model
- [ ] `calculatePlatformFee`: Subscription model
- [ ] `calculatePlatformFee`: Multi-model (% + flat) combined
- [ ] `calculatePayoutHoldPeriod`: 1-3 day rental → 2 day hold
- [ ] `calculatePayoutHoldPeriod`: 4-7 day rental → 5 day hold
- [ ] `calculatePayoutHoldPeriod`: 8-14 day rental → 7 day hold
- [ ] `calculatePayoutHoldPeriod`: 15-30 day rental → 10 day hold
- [ ] `calculatePayoutHoldPeriod`: 30+ day rental → 14 day hold
- [ ] `determinePaymentPlan`: ≤7 days → upfront only
- [ ] `determinePaymentPlan`: 8-30 days → upfront OR weekly
- [ ] `determinePaymentPlan`: >30 days → upfront OR monthly
- [ ] All functions are pure (no side effects)

## Step 7 Tests — Mock Data + Colors

- [ ] Color constants match COLOR_THEME.md hex values exactly
- [ ] `colors.primary` === `#1886FF`
- [ ] `colors.secondary` === `#62D0FF`
- [ ] `colors.accent` === `#E4F9FF`
- [ ] Mock data includes 5+ users
- [ ] Mock data includes 10+ products
- [ ] Mock data includes 5+ bookings in various statuses
- [ ] Mock data type-checks against `/src/types/database.ts`
- [ ] All engines produce correct results with mock data input
- [ ] PROGRESS.md fully updated for all 7 steps
