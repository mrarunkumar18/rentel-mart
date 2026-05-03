# /src/mocks — Mock Data for Development

## Purpose
Mock data used by T2 and T3 during Days 1-7 before real Supabase is connected.

## Rules (from RULES.md Rule 11)
- All mock data must match the real database schema exactly
- Mark every mock call with: `// PHASE4-SWAP: Replace with real API`
- Mock data must include edge cases (empty lists, error states)
- Minimum 5 entries per mock data file

## Files
- `seed.ts` — T1's mock data seed (Step 7)
- `products.ts` — Mock products for T2
- `bookings.ts` — Mock bookings for T2
- `dashboard.ts` — Mock dashboard data for T2
- `auth.ts` — Mock auth state for T2
- `admin/` — Admin mock data directory for T3
