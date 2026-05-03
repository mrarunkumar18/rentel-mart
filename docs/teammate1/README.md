# Teammate 1 — Data Layer

**Role:** Supabase Schema, RLS Policies, TypeScript Types, Calculation Engines  
**Branch:** `phase1Dev`  
**Duration:** Days 1-7 (7 steps, 1 per day)

---

## 🎯 Your Mission

You are responsible for the entire data foundation of Rentify. Everything the other two teammates build (UI screens, admin panels) will eventually connect to YOUR database schema, YOUR types, and YOUR calculation engines. During Days 1-7, you work independently. Your work is tested against Supabase directly.

---

## 📂 Your Workspace

```
/docs/teammate1/
├── README.md                    ← You are here
├── PROMPT_T1.md                 ← Full AI prompt for your role
├── WORK_BREAKDOWN.md            ← 7-step breakdown with dependencies
├── PROGRESS.md                  ← Update after each step
├── TESTING.md                   ← Unit test checklist
├── TECHNICAL_REFERENCE.md       ← Supabase SQL + TypeScript patterns
└── STEPS/
    ├── STEP1.md                 ← Day 1 instructions
    ├── STEP2.md                 ← Day 2 instructions
    ├── STEP3.md                 ← Day 3 instructions
    ├── STEP4.md                 ← Day 4 instructions
    ├── STEP5.md                 ← Day 5 instructions
    ├── STEP6.md                 ← Day 6 instructions
    └── STEP7.md                 ← Day 7 instructions
```

---

## 🔗 Key References

- **PRD:** `/docs/PRD.md` (especially Parts 2, 4.3.9, 5)
- **Color Theme:** `/docs/COLOR_THEME.md`
- **Rules:** `/docs/RULES.md` (especially Rules 1, 3, 4, 8, 11)
- **Your Technical Reference:** `/docs/teammate1/TECHNICAL_REFERENCE.md`

---

## 📦 Your Deliverables (by end of Day 7)

| Deliverable | Location | Description |
|-------------|----------|-------------|
| Database tables | Supabase console | 12+ tables with all fields from PRD Part 2.4 |
| RLS policies | Supabase console | Row-Level Security on ALL tables |
| TypeScript types | `/src/types/database.ts` | Strict types matching every table |
| Supabase client | `/src/lib/supabase.ts` | Client + server helpers |
| Calculation engines | `/src/lib/engines.ts` | Pricing, deposits, late fees, payouts |
| Color tokens | `/src/lib/colors.ts` | Exported color constants from COLOR_THEME.md |
| Mock data seeds | `/src/mocks/seed.ts` | Seed data for development testing |

---

## 🚀 Quick Start

1. Read this README fully
2. Read `/docs/RULES.md` — all 15 rules apply to you
3. Read `PROMPT_T1.md` for your full role definition
4. Read `WORK_BREAKDOWN.md` for the 7-step plan
5. Start with `STEPS/STEP1.md`
6. Update `PROGRESS.md` after each step
7. Commit after each step: `[STEP-N] - Description`

---

## ⚠️ Rules That Matter Most to You

- **Rule 1:** If the PRD is ambiguous about a field type or constraint, ASK Nitin
- **Rule 3:** One commit per step, with the exact format from RULES.md
- **Rule 7:** T2 and T3 don't wait for you — they use mock data
- **Rule 11:** Your types and schema ARE the contract — T2/T3 adapt to you in Phase 4
- **Rule 13:** Use exact PRD terminology (Booking, not Order; Product, not Item)
