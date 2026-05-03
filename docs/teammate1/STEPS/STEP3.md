# STEP 3 — Row-Level Security (RLS) Policies

**Day:** 3 | **Dependencies:** Steps 1-2 | **Estimated Time:** 4-5 hours

---

## Objectives
1. Enable RLS on ALL tables
2. Write SELECT/INSERT/UPDATE/DELETE policies for each table
3. Ensure users can only access their own data
4. Ensure admins can access data based on their role
5. Test all policies thoroughly

## Instructions

Enable RLS on every table first:
```sql
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
```

Then create policies for each table following the patterns in TECHNICAL_REFERENCE.md. Key rules:
- **users:** Read own, update own, admins read all
- **products:** Read all active (public), CRUD own (lister), admins manage all
- **bookings:** Read if renter or lister, admins read all
- **platform_config:** Read all, write super_admin only
- **admin_roles:** Read/write super_admin only

Refer to TECHNICAL_REFERENCE.md for SQL patterns.

## Testing
Use Supabase SQL editor to test policies with different user contexts. Verify access is correctly restricted.

## After Completion
Update PROGRESS.md → Step 3. Commit: `[STEP-3] - RLS policies on all tables`
