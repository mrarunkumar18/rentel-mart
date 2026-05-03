# STEP 6 — Calculation Engines

**Day:** 6 | **Dependencies:** Step 4 (types) | **Estimated Time:** 5-6 hours

---

## Objectives
1. Create `/src/lib/engines.ts` with all business logic calculation functions
2. All functions must be pure (no side effects, no DB calls)
3. All functions must be fully typed

## Functions to Implement

| Function | PRD Reference | Description |
|----------|--------------|-------------|
| `calculateRentalPrice` | 3.3.2 | Select optimal pricing tier based on duration |
| `calculateSecurityDeposit` | 3.3.2 | 20% of product value (configurable) |
| `calculateLateFee` | 3.11 | Accrual based on rate and unit |
| `calculatePlatformFee` | 5.1-5.2 | Supports all 3 fee models |
| `calculatePayoutHoldPeriod` | 3.9 | Hold days based on rental duration |
| `calculatePayoutBreakdown` | 3.9 | Gross - deductions = net |
| `determinePaymentPlan` | 3.4.1 | ≤7 days: upfront only, etc. |
| `calculateTotalDue` | 3.4.1 | Rent + deposit + delivery - discounts |

## Testing
Test each function with edge cases. Verify against the PRD tables in sections 3.9 and 3.4.1.

## After Completion
Update PROGRESS.md → Step 6. Commit: `[STEP-6] - Calculation engines for pricing, deposits, fees, payouts`
