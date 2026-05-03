# RENTIFY — Project Index

**Platform:** Rentify — Peer-to-Peer Rental Marketplace  
**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Nodemailer  
**Status:** Setup Complete — Ready for Phase 1-3 Parallel Development

---

## 📋 Core Documents

| Document | Description | Status |
|----------|-------------|--------|
| [PRD.md](./PRD.md) | Full Product Requirements Document (Parts 1-9) | ✅ FINAL |
| [COLOR_THEME.md](./COLOR_THEME.md) | Locked color palette — Primary `#1886FF`, Secondary `#62D0FF`, Accent `#E4F9FF` | 🔒 LOCKED |
| [RULES.md](./RULES.md) | 15 mandatory rules for all teammates and phases | ✅ FINAL |
| [WIREFRAME.svg](./WIREFRAME.svg) | Excalidraw wireframe — all screens referenced in PRD Part 6 | ✅ FINAL |
| [GUIDELINES.md](./GUIDELINES.md) | Optional code style, naming conventions, and best practices | 📘 Reference |
| [WORKFLOW.md](./WORKFLOW.md) | Timeline (7-7-7-10), phase descriptions, sync model, commit strategy | ✅ FINAL |

---

## 👥 Teammate Workspaces

### 🔷 [Teammate 1 — Data Layer](./teammate1/README.md)
**Scope:** Supabase schema, RLS policies, TypeScript types, calculation engines, mock data  
**Branch:** `phase1Dev`  
**Duration:** Days 1-7  
**Key Deliverables:** Database tables, RLS, `/src/types/database.ts`, `/src/lib/supabase.ts`, `/src/lib/engines.ts`

### 🔷 [Teammate 2 — End-User UI](./teammate2/README.md)
**Scope:** All renter/lister facing screens (19 screens from PRD Part 6)  
**Branch:** `phase2Dev`  
**Duration:** Days 1-7  
**Key Deliverables:** Auth screens, dashboard, browse, booking flow, order management, lister screens

### 🔷 [Teammate 3 — Admin Panel](./teammate3/README.md)
**Scope:** All admin modules (10 modules from PRD Part 4)  
**Branch:** `phase3Dev`  
**Duration:** Days 1-7  
**Key Deliverables:** Admin dashboard, user/product/order management, disputes, payouts, config

### 🔷 [Phase 4 — Integration & Deployment](./phase4/README.md)
**Scope:** Merge all 3 branches, connect live Supabase, E2E testing, deployment  
**Branch:** `main`  
**Duration:** Days 8-17  
**Key Deliverables:** Working integrated platform, deployed to Vercel/self-hosted

---

## 🚀 Quick Start

### For Teammate 1 (Data Layer):
```bash
git checkout -b phase1Dev
# Read: /docs/teammate1/README.md
# Follow: /docs/teammate1/STEPS/STEP1.md
```

### For Teammate 2 (End-User UI):
```bash
git checkout -b phase2Dev
# Read: /docs/teammate2/README.md
# Follow: /docs/teammate2/STEPS/STEP1.md
```

### For Teammate 3 (Admin Panel):
```bash
git checkout -b phase3Dev
# Read: /docs/teammate3/README.md
# Follow: /docs/teammate3/STEPS/STEP1.md
```

### For Phase 4 (All Together):
```bash
# Wait for all 3 branches to complete
# Read: /docs/phase4/README.md
# Follow: /docs/phase4/PROMPT_PHASE4a.md
```

---

## ⚠️ Critical Rules Reminder

1. **Rule 1:** Ask clarifying questions — NEVER assume
2. **Rule 5:** Color theme is LOCKED (`#1886FF`, `#62D0FF`, `#E4F9FF`)
3. **Rule 6:** Tech stack is LOCKED
4. **Rule 7:** No blocking dependencies — use mock data
5. **Rule 11:** Mock data must be swappable in Phase 4

See [RULES.md](./RULES.md) for all 15 rules.

---

**Project Lead:** Nitin  
**AI Assistant:** Claude  
**Created:** 2025-05-03
