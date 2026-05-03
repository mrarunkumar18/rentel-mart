# Teammate 2 — End-User UI

**Role:** All Renter/Lister Facing Screens (19 screens from PRD Part 6)  
**Branch:** `phase2Dev`  
**Duration:** Days 1-7 (7 steps, 1 per day)

---

## 🎯 Your Mission

You are responsible for every screen a Renter or Lister sees. This includes authentication, browsing, booking, order management, listing creation, and dispute flows. You build with **mock data** during Days 1-7 — the real database connection happens in Phase 4.

---

## 📂 Your Workspace

```
/docs/teammate2/
├── README.md                    ← You are here
├── PROMPT_T2.md                 ← Full AI prompt for your role
├── WORK_BREAKDOWN.md            ← 7-step breakdown with screen assignments
├── PROGRESS.md                  ← Update after each step
├── TESTING.md                   ← Manual test checklist per screen
├── TECHNICAL_REFERENCE.md       ← React/Next.js + Tailwind + shadcn/ui patterns
├── SCREEN_INVENTORY.md          ← Full list of 19 screens with component breakdown
└── STEPS/
    ├── STEP1.md through STEP7.md
```

---

## 🔗 Key References

- **PRD:** `/docs/PRD.md` (especially Part 3 — Screens & Flows, Part 6 — Screen Inventory)
- **Color Theme:** `/docs/COLOR_THEME.md` — LOCKED, use these exact colors
- **Wireframe:** `/docs/WIREFRAME.svg` — Visual reference
- **Rules:** `/docs/RULES.md` (especially Rules 5, 7, 11, 14)

---

## 📦 Your Deliverables (by end of Day 7)

| Deliverable | Location | Description |
|-------------|----------|-------------|
| Auth screens (3) | `/src/app/(auth)/` | Login, Register, Forgot Password |
| Dashboard | `/src/app/(renter)/dashboard/` | Stats, notifications, quick actions |
| Browse screens (3) | `/src/app/(renter)/browse/` | Product grid, detail, categories |
| Booking flow (3) | `/src/app/(renter)/checkout/` | 3-step checkout + cart |
| Order management (2) | `/src/app/(renter)/orders/` | Order list + order detail |
| Lister screens (3) | `/src/app/(lister)/` | My listings, create listing, order requests |
| Operations screens (3) | Various | Pickup, return, dispute |
| Mock data | `/src/mocks/` | Mock data for all screens |
| UI components | `/src/components/` | Reusable components used across screens |

---

## ⚠️ Rules That Matter Most to You

- **Rule 5:** Color theme LOCKED — `#1886FF`, `#62D0FF`, `#E4F9FF` everywhere
- **Rule 7:** Don't wait for T1 — use mock data
- **Rule 11:** Mock data must be swappable — mark with `// PHASE4-SWAP`
- **Rule 14:** All UI must meet WCAG AA accessibility standards
