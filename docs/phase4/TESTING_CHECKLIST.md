# Phase 4 — E2E Testing Checklist

## Renter Flows
- [ ] Register new account → auto-login → dashboard
- [ ] Browse products → apply filters → sort results
- [ ] View product detail → select dates → see price calculation
- [ ] Book product → 3-step checkout → order confirmation
- [ ] View order list → filter by status → view order detail
- [ ] Pickup flow → photo capture → confirm receipt
- [ ] Return flow → photo capture → confirm return
- [ ] Late return → late fee accrual → notification

## Lister Flows
- [ ] Create listing → multi-step form → submit for review
- [ ] View incoming booking requests → approve/reject
- [ ] View active rentals → track return status
- [ ] Raise damage claim → upload evidence → track dispute
- [ ] View earnings dashboard → see payout breakdown

## Admin Flows
- [ ] Login as admin → see admin dashboard
- [ ] Manage users → suspend/unsuspend account
- [ ] Approve/reject product listings
- [ ] View orders → force-cancel → reassign delivery
- [ ] Resolve dispute → set deduction → release funds
- [ ] Release/block payouts
- [ ] Generate financial reports → export CSV
- [ ] Update platform configuration
- [ ] Create sub-admin → assign permissions

## Edge Cases
- [ ] Booking product that's already booked (date conflict)
- [ ] Payment plan selection for different durations
- [ ] Dispute after 24-hour window expired
- [ ] Multiple fee models active simultaneously
- [ ] Admin suspends account mid-rental

## Performance
- [ ] All pages load in < 2 seconds
- [ ] Image uploads show progress
- [ ] No console errors in production build

## Accessibility
- [ ] Keyboard navigation on all pages
- [ ] Screen reader compatibility
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus rings visible
