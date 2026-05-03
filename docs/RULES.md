# RENTIFY PROJECT RULES

**Document Status:** MANDATORY FOR ALL TEAMMATES & PHASES  
**Last Updated:** 2025-05-03  
**Applicable To:** Teammate 1, Teammate 2, Teammate 3, Phase 4 (all sub-phases)

---

## Rule 1: Clarification Before Assumption

### THE CRITICAL RULE

**If a field in the PRD is ambiguous, you MUST ask clarifying questions before proceeding.**

### DO NOT assume. DO NOT infer. DO NOT guess.

This is especially critical for:
- **Teammate 1 (Data Layer):** Database schema, field types, relationships, constraints
- **Teammate 2 (UI):** Screen layouts, user flows, edge cases, error states
- **Teammate 3 (Admin):** Permissions, module behaviors, config values, approval workflows

### How This Works:

**WHEN:** You're reading the PRD and encounter something that is unclear, missing, or could have multiple interpretations.

**ACTION:** Stop building. Ask Nitin (the project lead) clarifying questions in this format:

```
CLARIFICATION REQUEST [PHASE-STEP]: [Topic]

Context: [What part of PRD this relates to]

Question 1: [Specific question]
Question 2: [Follow-up question]
Question 3: [Related question if needed]

Expected Answer Format: [What would help you proceed]
```

**EXAMPLE:**

```
CLARIFICATION REQUEST [PHASE1-STEP2]: RLS Policies for Disputed Bookings

Context: PRD Part 2.3 says "Disputes are admin-arbitrated" but doesn't specify 
if a Lister can view the dispute after submission.

Question 1: Can a Lister view a dispute they raised after submission, or is it 
read-only until resolution?

Question 2: Can a Renter view the Lister's condition photos during the dispute, 
or only the Admin?

Question 3: Are there audit logs that both parties can access?

Expected Answer Format: [Specific yes/no or detailed behavior description]
```

**EXPECTED RESPONSE TIME:** Nitin will respond within 2 hours (async model).

### Why This Rule Exists:

Building without clarity costs more time in Phase 4 when you discover the wrong assumption was made. A 10-minute clarification now saves 2 days of rework later.

---

## Rule 2: No Shared Syntax Guides - Technical References Are Role-Specific

### Each Teammate Gets Their Own Technical Reference

**Teammate 1 (Data Layer):**
- Reference: `/docs/teammate1/TECHNICAL_REFERENCE.md`
- Contains: Supabase SQL syntax, PostgreSQL patterns, RLS examples, TypeScript type definitions
- Share with others: NO
- Own it: YES

**Teammate 2 (End-User UI):**
- Reference: `/docs/teammate2/TECHNICAL_REFERENCE.md`
- Contains: React/Next.js patterns, Tailwind CSS, shadcn/ui component usage, hooks examples
- Share with others: NO
- Own it: YES

**Teammate 3 (Admin Panel):**
- Reference: `/docs/teammate3/TECHNICAL_REFERENCE.md`
- Contains: Admin UI patterns, RBAC implementation, dashboard structures, form builders
- Share with others: NO
- Own it: YES

**Phase 4:**
- Reference: `/docs/phase4/TECHNICAL_REFERENCE.md`
- Contains: Integration patterns, API route design, auth middleware, deployment setup
- Used by: All 3 teammates during Phase 4

### DO NOT:

❌ Reference another teammate's TECHNICAL_REFERENCE.md  
❌ Ask another teammate how to implement something (ask the AI instead)  
❌ Share syntax patterns across teammates  
❌ Deviate from your assigned technical reference  

### DO:

✅ Use only your own TECHNICAL_REFERENCE.md  
✅ Ask clarifying questions in your folder if syntax is unclear  
✅ Let AI (Claude) help you with implementation details from your reference  
✅ Keep your work isolated and self-contained  

---

## Rule 3: Step-Wise Commits = Rollback Safety

### Commit Strategy (Days 1-7 for T1, T2, T3)

Each teammate works through 7 steps (one per day). **After each step, commit to your branch with a specific message format.**

### Commit Format:

```
[STEP-N] - [Task Description]

Completed:
- [What was built/implemented]
- [What was tested]
- [Progress notes]

Testing:
- [Manual tests passed]
- [Edge cases checked]
- [Known issues (if any)]
```

### Example:

```
[STEP-1] - Supabase Schema & Table Creation

Completed:
- Created 12 core tables (users, products, bookings, etc.)
- Added all required fields from PRD Part 2
- Set up primary keys and foreign keys
- Row-Level Security NOT YET implemented (Step 2)

Testing:
- Table creation verified in Supabase console
- Field types match TypeScript definitions
- No constraint violations

Known Issues:
- None
```

### Why This Matters:

If **STEP-5** fails during implementation:
- You revert to **STEP-4** (git revert commit)
- You only lose 1 day of work, not 5
- No restart needed, just continue from STEP-4 commit

### Branch Names:

- Teammate 1: `phase1Dev`
- Teammate 2: `phase2Dev`
- Teammate 3: `phase3Dev`
- Phase 4: merge all 3 to `main`, then work on `main`

### Commit Frequency:

✅ ONE commit per step  
✅ After testing is complete  
✅ Before moving to the next step  
❌ NO multiple commits per step  
❌ NO committing without testing  

---

## Rule 4: Mandatory Progress Tracking

### Every Teammate Must Update Their PROGRESS.md

**When:** After each step is completed and committed

**Format:** Update `/docs/[teammate]/PROGRESS.md` with:

```markdown
## Step [N] - [Date] - [Status]

**Status:** ✅ COMPLETE / 🚧 IN PROGRESS / ❌ BLOCKED

**What Was Built:**
- [List deliverables]
- [List what works]
- [List what's tested]

**Time Spent:** [H hours, M minutes]

**Issues Encountered:**
- [Issue 1 and resolution]
- [Issue 2 and resolution]

**Next Step:** [What's coming in Step N+1]

**Notes:** [Any important context for Phase 4 integration]
```

### Example Progress Entry:

```markdown
## Step 2 - 2025-05-05 - ✅ COMPLETE

**Status:** COMPLETE

**What Was Built:**
- All 12 Supabase tables created with constraints
- Row-Level Security policies written for 8 tables
- Tested RLS: Users can only access their own bookings ✓
- Tested RLS: Admins can see all bookings ✓

**Time Spent:** 4.5 hours

**Issues Encountered:**
- RLS policy on `disputes` table was too restrictive initially
  (Fixed: Added exception for admins with read-all permission)

**Next Step:** TypeScript types definition and validation

**Notes:** RLS is working as expected. T2 and T3 will be able to 
start mock data layering without waiting for live DB.
```

### Why This Matters:

- **For Nitin (You):** Track overall progress at a glance
- **For Phase 4:** Other teammates understand what each person built
- **For Debugging:** If something breaks later, you have context about what changed when

---

## Rule 5: Color Theme is LOCKED

### FINAL DECISION - NO CHANGES

**Primary:** `#1886FF` (Dark Vibrant Blue)  
**Secondary:** `#62D0FF` (Medium-Light Sky Blue)  
**Accent:** `#E4F9FF` (Lightest Blue)

### Enforcement:

✅ T2 must use these exact colors on all 27 screens  
✅ T3 must use these exact colors on all 10 admin modules  
✅ All buttons, links, backgrounds, borders must match the color theme  
✅ No deviations, no "but this looks better", no exceptions  

### What This Means:

- Every primary button: `#1886FF`
- Every hover state: `#62D0FF`
- Every card/panel background: `#E4F9FF`
- Every link: `#1886FF`
- Every focus ring: `#62D0FF`

Reference `/docs/COLOR_THEME.md` for the complete color implementation guide.

---

## Rule 6: Tech Stack is LOCKED

### YOU CANNOT CHANGE THE FOLLOWING:

**Frontend:**
- ✅ Next.js 14
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS
- ✅ shadcn/ui components
- ✅ React 18+

**Backend:**
- ✅ Next.js API Routes (no Express, no separate backend)
- ✅ Supabase (PostgreSQL only)
- ✅ Supabase Auth (email/password only, no OAuth)

**Database:**
- ✅ PostgreSQL (Supabase)
- ✅ Row-Level Security enabled
- ✅ Supabase Storage for images

**Email:**
- ✅ Nodemailer
- ✅ Google SMTP (provided credentials)

**Deployment:**
- ✅ Vercel (or self-hosted on stable networkless environment)
- ✅ No external CDNs
- ✅ No third-party image optimization services

### If You Need Something Different:

**ASK NITIN FIRST.** Do not substitute libraries, frameworks, or services without explicit approval.

---

## Rule 7: No Blocking Dependencies During Days 1-7

### T1, T2, T3 Must Work Independently

**What This Means:**

- **T1** doesn't wait for T2 or T3
- **T2** doesn't wait for T1 or T3 (uses mock data)
- **T3** doesn't wait for T1 or T2 (uses mock data)
- All three can start simultaneously on Day 1

### If You Get Stuck:

**DON'T WAIT** for another teammate.

1. **Ask Nitin** (the project lead) - not another teammate
2. **Find a workaround** using mock data or assumptions
3. **Document the blocker** in your PROGRESS.md
4. **Move forward** - solve it in Phase 4

### Blocking = Rule Violation:

If T2 says "I can't start without T1's types", that violates this rule.  
**Solution:** T1 can share a draft types file early, or T2 creates temporary types and swaps them in Phase 4.

---

## Rule 8: Testing Before Committing

### No Commit Without Testing

Before you commit a step, you MUST:

1. **Build** - Ensure the code compiles/runs
2. **Test** - Run the test checklist for that step
3. **Verify** - Confirm deliverables match the step description
4. **Document** - Update PROGRESS.md with test results
5. **Commit** - Only then commit to your branch

### Checklist Example:

```
[ ] Code compiles without errors
[ ] All unit tests pass (T1 only)
[ ] Manual test checklist complete (T2/T3)
[ ] No TypeScript errors (strict mode)
[ ] No console warnings
[ ] Database queries tested (T1)
[ ] UI renders correctly (T2/T3)
[ ] Accessibility checked (WCAG AA minimum)
[ ] Performance acceptable (no console lag)
[ ] Ready to commit: YES
```

### If Tests Fail:

- **FIX BEFORE COMMITTING** - do not skip failing tests
- **IF BLOCKED** - document in PROGRESS.md and ask Nitin
- **IF TIME BOUND** - commit with `[BLOCKED]` prefix and explain why

Example: `[STEP-3-BLOCKED] - Photo upload integration pending T1 storage setup`

---

## Rule 9: Documentation is Part of the Deliverable

### Every Step Must Include Documentation

### What to Document:

1. **Code Comments** - Explain complex logic, not obvious code
   ```typescript
   // Calculate late fee with exponential backoff (not linear)
   // Formula: baseFee * (1.2 ^ dayOverdue)
   const lateFee = calculateLateFee(returnedLate);
   ```

2. **Inline Notes** - In your PROGRESS.md or STEPS file
   ```
   NOTE: The `disputes` table uses JSONB for flexibility because 
   we don't know all fields admins might need upfront.
   ```

3. **API Documentation** (Phase 4) - Every route needs docs
   ```
   POST /api/bookings
   - Purpose: Create a new booking
   - Auth: Required (user must be logged in)
   - RLS: User can only create bookings for themselves
   - Body: { product_id, renter_id, start_date, end_date, ... }
   - Returns: { booking_id, status, total_price, ... }
   - Errors: 400 (missing fields), 403 (RLS violation), 500 (DB error)
   ```

4. **Assumptions** - If you had to make an assumption despite Rule 1
   ```
   ASSUMPTION: Late fees accrue daily (not hourly) based on PRD ambiguity
   If this is wrong, Phase 4 will catch it during E2E testing
   ```

---

## Rule 10: Phase 4 Sequencing is Mandatory

### All 3 Phases Must Finish Before Phase 4 Starts

**Days 1-7:** Teams work independently ✅  
**Day 8 (END OF DAY 7):** All 3 must commit their STEP-7 work  
**Day 8 (START):** Nitin merges all 3 branches to `main`  
**Days 8-9:** Phase 4a begins (integration review)  
**Days 10-12:** Phase 4b (auth + live DB)  
**Days 13-16:** Phase 4c (E2E testing)  
**Day 17:** Phase 4d (deployment)

### If a Teammate is Behind:

**On Day 7:** If T1/T2/T3 hasn't finished STEP-7:
- **Option 1:** Extend by 1-2 days (Phase 4 starts Days 9-10 instead)
- **Option 2:** Merge incomplete work and fix in Phase 4a

**DO NOT:** Skip steps to "catch up" - that breaks everything in Phase 4.

---

## Rule 11: Mock Data Must Be Swappable in Phase 4

### T2 & T3: Use Mock Data That's Easy to Replace

**During Days 1-7:**
- All data comes from mock stores (not real Supabase)
- API calls are intercepted and return mock data
- Everything works perfectly with fake data

**During Phase 4b:**
- Remove mock interceptor
- Replace with real Supabase API calls
- Should take <30 minutes per teammate

### How to Structure Mock Data:

```typescript
// mocks/bookings.ts
export const mockBookings = [
  {
    id: 'BK001',
    product_id: 'PROD001',
    renter_id: 'USR001',
    status: 'active',
    rental_start: '2025-05-10',
    rental_end: '2025-05-15',
    // ... all fields matching real schema
  }
];

// Before Phase 4: use mocks
// const bookings = mockBookings;

// After Phase 4: swap to real
// const bookings = await fetch('/api/bookings').then(r => r.json());
```

### During Phase 4:

Mark every mock call with a comment:
```typescript
// PHASE4-SWAP: Replace this mock call with real API
const data = mockBookings; // → await fetch('/api/bookings')
```

This makes the swap obvious and fast.

---

## Rule 12: Nitin Has Final Authority

### Decision Making Authority

**During Days 1-7:**
- If T1, T2, T3 disagree on approach → Nitin decides
- If implementation conflicts with PRD interpretation → Nitin decides
- If technical debate happens → Nitin decides

**During Phase 4:**
- All 3 together + Nitin + AI (Claude)
- Consensus preferred, but Nitin is the tie-breaker

### How to Escalate:

```
DECISION REQUEST: [Topic]

Context: [What's the conflict]
Option A: [Pro/Con]
Option B: [Pro/Con]

Recommendation: [What you think is best]
Awaiting decision: [Nitin only]
```

### Response Time:

Nitin will respond within 4 hours during working hours.

---

## Rule 13: Definitions & Terminology

### Use Exact Terms from the PRD

**Do NOT use:**
- "User" (use "Renter" or "Lister" or "User" depending on context)
- "Item" (use "Product")
- "Order" (use "Booking" for rental transactions)
- "Customer" (use "Renter" or "Lister")

**Do use:**
- **Renter** - User booking a product
- **Lister** - User listing a product
- **Booking** - A rental transaction
- **Product** - Any item available for rent
- **Security Deposit** - 20% of product value held in escrow
- **Payout** - Payment to lister after rental completes
- **Dispute** - Damage claim raised by lister

### Why This Matters:

Consistent terminology = less confusion in Phase 4 integration.

---

## Rule 14: Accessibility Requirements (WCAG AA Minimum)

### All UI Must Meet Accessibility Standards

**T2 (End-User UI) and T3 (Admin Panel) MUST:**

✅ Use semantic HTML (`<button>`, `<input>`, `<label>`, not `<div>`)  
✅ All buttons/links have descriptive text (not "click here")  
✅ Color contrast ≥ 4.5:1 for text (WCAG AA)  
✅ Focus rings visible (2px outline on tab navigation)  
✅ Form labels associated with inputs (`<label for="id">`)  
✅ Images have `alt` text (decorative images: `alt=""`)  
✅ Keyboard navigation works (no mouse-only interactions)  
✅ Error messages are associated with form fields  
✅ Loading states announced to screen readers  

### Testing:

Before Phase 4, run:
- WAVE (Web Accessibility Evaluation Tool)
- Axe DevTools
- Keyboard navigation test (Tab through entire UI)

### If You Fail:

Document in PROGRESS.md and fix in Phase 4c (testing phase).

---

## Rule 15: No Surprises in Phase 4

### What Phase 4 is NOT:

❌ Time to refactor architecture  
❌ Time to redesign screens  
❌ Time to change database schema  
❌ Time to introduce new features  
❌ Time to fix major bugs  

### What Phase 4 IS:

✅ Integration of 3 independent pieces  
✅ Connecting to live Supabase  
✅ Testing all flows end-to-end  
✅ Fixing bugs and edge cases  
✅ Deployment  

### During Days 1-7:

If you discover the architecture is wrong, **ask Nitin** - don't hide it until Phase 4.

---

## Summary: The 15 Rules in One Line Each

| # | Rule | Consequence of Breaking |
|---|------|------------------------|
| 1 | Ask clarifying questions, don't assume | Wrong implementation, 2+ days of rework |
| 2 | Use only your own technical reference | Inconsistency, conflicting patterns |
| 3 | Commit after each step for rollback safety | Lose entire phase on failure |
| 4 | Update PROGRESS.md after each step | Can't track status, blame game in Phase 4 |
| 5 | Color theme is locked (3 colors only) | Inconsistent visual experience, rework |
| 6 | Tech stack is locked | Integration failures, Phase 4 blocked |
| 7 | No blocking dependencies (work isolated) | Serial work instead of parallel (lose 2 weeks) |
| 8 | Test before committing | Untested code merged, Phase 4 debugging nightmare |
| 9 | Document as you build | Can't understand code in Phase 4, redo it |
| 10 | Phase 4 sequencing is mandatory | Miss deployment deadline |
| 11 | Mock data must be swappable | Can't integrate in Phase 4, rewrite UI |
| 12 | Nitin has final authority | Debate paralyzes project, miss deadlines |
| 13 | Use exact PRD terminology | Confusion, miscommunication, wrong impl |
| 14 | Meet WCAG AA accessibility | Legally risky, bad user experience, rework |
| 15 | No surprises in Phase 4 | Project scope creep, miss deadline |

---

## Acknowledgment

**By reading this document, you agree to follow all 15 rules without exception.**

If you find a rule unclear or believe it should be different, **ask Nitin to clarify or modify it BEFORE starting work.**

Once Day 1 begins, these rules are binding.

---

**Document Version:** 1.0  
**Status:** FINAL  
**Applicable Date:** 2025-05-03 onwards  
**For:** Rentify P2P Rental Marketplace Project  
**Enforced By:** Nitin (Project Lead) + Claude (AI)
