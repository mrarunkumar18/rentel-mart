# Teammate 3 — Testing Checklist

## Step 1 — Layout + Auth Guard
- [ ] Admin sidebar renders with 10 module links
- [ ] Non-admin users redirected away from admin routes
- [ ] Responsive sidebar collapses on mobile
- [ ] Breadcrumbs show current page path

## Step 2 — Dashboard
- [ ] KPI cards show correct mock numbers
- [ ] Revenue chart renders (daily/weekly/monthly toggle)
- [ ] Order status funnel visualization works
- [ ] Recent activity feed shows timestamped entries

## Step 3 — Users + Products
- [ ] User table loads with pagination
- [ ] User search and status filter work
- [ ] Suspend/unsuspend/delete actions trigger (mock)
- [ ] Product listing table with approve/reject/suspend
- [ ] Category CRUD (create/rename/archive)

## Step 4 — Orders + Delivery
- [ ] Order table filters by status, date, delivery type
- [ ] Order detail shows pickup/return photos
- [ ] Force-cancel with reason works
- [ ] Delivery orders table with agent assignment
- [ ] Agent performance metrics display

## Step 5 — Disputes + Payouts
- [ ] Dispute queue sorted by days pending
- [ ] Side-by-side photo comparison works
- [ ] Deduction input (0-100% of deposit) validates
- [ ] Resolve dispute button triggers resolution flow
- [ ] Payout queue shows hold countdown
- [ ] Manual release and block actions work

## Step 6 — Reports + Config
- [ ] All report types render with mock data
- [ ] Period selector filters report data
- [ ] CSV export generates downloadable file
- [ ] Platform config form shows all PRD 4.3.9 params
- [ ] Config save validates and updates (mock)
- [ ] Only super_admin can access config page

## Step 7 — Roles + Final
- [ ] Sub-admin list shows all admin users
- [ ] Create sub-admin form works
- [ ] Permission toggles per module (read/write/delete)
- [ ] Audit log shows timestamped admin actions
- [ ] All 10 modules keyboard-navigable
- [ ] All modules mobile-responsive
