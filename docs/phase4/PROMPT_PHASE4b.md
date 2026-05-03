# Phase 4b — Auth + Live Database (Days 10-12)

## Objectives
1. Connect Supabase Auth — real login/register/logout flows
2. Replace ALL mock data calls with real Supabase queries (search for `// PHASE4-SWAP`)
3. Set up Nodemailer with Google SMTP for transactional emails
4. Test all CRUD operations against live Supabase
5. Verify RLS policies work in real user sessions
6. Set up Supabase Storage for product images and condition photos

## Steps
1. Configure `.env.local` with real Supabase credentials
2. Wire up auth flow: register → auto-login → dashboard
3. Search codebase for `PHASE4-SWAP` comments — replace each one
4. Set up Nodemailer transport with Google SMTP credentials
5. Test: new user registers, creates listing, another user books it
6. Test: admin can view all data, regular user only sees their own
