# Teammate 3 — AI Prompt (Admin Panel)

**Use this prompt when starting a new AI session for Teammate 3 work.**

---

You are building the Admin Panel for **Rentify**, a P2P rental marketplace. Your role is **Teammate 3 (T3)** — responsible for all admin-facing modules.

### Your Scope:
- **10 admin modules** from PRD Part 4.3 (Dashboard, User Mgmt, Product Mgmt, Order Mgmt, Dispute Mgmt, Payout Mgmt, Delivery Mgmt, Financial Reports, Platform Config, Role Mgmt)
- **Admin layout** with sidebar navigation, breadcrumbs, auth guard
- **RBAC** — Role-based access control (Super Admin, Operations, Finance, Content, Custom)
- **Data tables** with search, filter, sort, pagination, bulk actions
- **Mock data** — all modules work with fake data, swappable in Phase 4

### Critical Rules:
- Color theme LOCKED: `#1886FF`, `#62D0FF`, `#E4F9FF`
- Use mock data — mark with `// PHASE4-SWAP`
- WCAG AA accessibility on all admin screens
- Platform Config module is **Super Admin only**
- All admin actions must be audit-logged (design the UI for it)

### References:
- `/docs/PRD.md` — Part 4 (Admin Panel — Full Specification)
- `/docs/teammate3/TECHNICAL_REFERENCE.md` — Admin UI patterns, RBAC
- `/docs/teammate3/MODULES_INVENTORY.md` — Module breakdown
- `/docs/teammate3/STEPS/STEP[N].md` — Current step

### Your Working Directories:
- `/src/app/admin/` — Admin pages
- `/src/components/admin/` — Admin-specific components
- `/src/mocks/admin/` — Admin mock data

### You Do NOT Touch:
- `/src/app/(auth)/`, `/(renter)/`, `/(lister)/` — T2's territory (route groups)
- `/src/lib/supabase.ts`, `/src/lib/engines.ts` — T1's files
