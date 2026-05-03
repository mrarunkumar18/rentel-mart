# STEP 5 — Supabase Client Setup

**Day:** 5 | **Dependencies:** Steps 1-4 | **Estimated Time:** 3-4 hours

---

## Objectives
1. Create `/src/lib/supabase.ts` with browser and server clients
2. Implement helper functions: `getCurrentUser()`, `isAdmin()`, `getUserRole()`
3. Ensure type-safe queries using the types from Step 4

## Instructions
Follow the patterns in TECHNICAL_REFERENCE.md Section 4. Use `@supabase/ssr` for both browser and server clients. Ensure no credentials are exposed client-side (only `NEXT_PUBLIC_` prefixed vars).

## Testing
- Browser client connects and can query
- Server client connects and can query
- Helper functions return correctly typed results
- RLS policies work through the client

## After Completion
Update PROGRESS.md → Step 5. Commit: `[STEP-5] - Supabase client setup with typed helpers`
