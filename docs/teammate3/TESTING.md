# Teammate 3 Manual Test Checklist

All tests have been run locally against the mock data store and passed.

## M01 User Management
- [x] PASS: Search by name/email updates list.
- [x] PASS: Filter by status (active, suspended, etc.) updates list.
- [x] PASS: Suspend user (requires reason). Verified status updates and audit logs.
- [x] PASS: Ban user. Verified status updates and audit logs.
- [x] PASS: Verify user. Verified status updates to 'active'.
- [x] PASS: Actions are correctly hidden/disabled based on RBAC tier.

## M02 Listing Management
- [x] PASS: Approve listing.
- [x] PASS: Reject listing (requires reason).
- [x] PASS: Flag listing.
- [x] PASS: Remove listing.

## M03 Booking Management
- [x] PASS: Cancel booking (requires reason).
- [x] PASS: Bookings list filters correctly.

## M04 Dispute Resolution
- [x] PASS: View side-by-side pickup vs. return photos.
- [x] PASS: Click photo to open lightbox preview.
- [x] PASS: Submit verdict form (requires minimum 20 chars of notes).
- [x] PASS: Auto-logs to Audit Log upon ruling submission.

## M05 Finance & Payments
- [x] PASS: KPI strip shows total GMV and fees correctly.
- [x] PASS: Process refund (requires reason).
- [x] PASS: Flag fraud transaction.

## M06 RBAC Management
- [x] PASS: Create new sub-admin account with selected tier.
- [x] PASS: Delete sub-admin account.
- [x] PASS: Super Admin (Tier 1) accounts cannot be deleted or demoted.

## M07 Platform Configuration
- [x] PASS: All 18 settings grouped correctly.
- [x] PASS: Editing a setting enables the "Save Changes" button.
- [x] PASS: Validation enforces min/max limits and email format before save.
- [x] PASS: "Revert All" properly drops unsaved draft changes.

## M08 Content Moderation
- [x] PASS: Preview flagged content/images in a modal.
- [x] PASS: Approve content (dismiss report).
- [x] PASS: Remove content.

## M09 Reports & Analytics
- [x] PASS: 4 KPI cards render values with WoW percentages.
- [x] PASS: Charts render using mock time-series data.
- [x] PASS: Date range filter updates the charts.

## M10 Audit Log
- [x] PASS: View read-only log of admin actions.
- [x] PASS: Filter by module.

## RBAC Enforcement (Global)
- [x] PASS: Nav shell correctly shows/hides module links based on active role.
- [x] PASS: RouteGuard correctly prevents direct URL access to unauthorized modules (redirects to 403).
- [x] PASS: DEV role switcher works correctly for testing.