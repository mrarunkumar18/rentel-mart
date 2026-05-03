# Teammate 3 — Admin Panel

**Role:** All Admin-Facing Modules (10 modules from PRD Part 4)  
**Branch:** `phase3Dev`  
**Duration:** Days 1-7

---

## 🎯 Your Mission

You are responsible for the entire Admin Panel — a separate, secured section of the application accessible only to users with admin roles. This includes dashboards, user/product/order management, disputes, payouts, delivery, reports, configuration, and role management. You build with **mock data** during Days 1-7.

## 📂 Your Workspace
```
/docs/teammate3/
├── README.md, PROMPT_T3.md, WORK_BREAKDOWN.md, PROGRESS.md
├── TESTING.md, TECHNICAL_REFERENCE.md, MODULES_INVENTORY.md
└── STEPS/STEP1.md through STEP7.md
```

## 📦 Key Deliverables
- Admin layout shell with sidebar + auth guard
- 10 admin modules as separate pages under `/(admin)/`
- RBAC permission checks on all modules
- All modules using mock data (swappable in Phase 4)
- Data tables with search, filter, sort, pagination
- Export functionality (CSV) for reports

## ⚠️ Key Rules
- Color theme LOCKED: `#1886FF`, `#62D0FF`, `#E4F9FF`
- Don't wait for T1/T2 — use mock data
- Admin routes protected by role-based middleware
- PRD Part 4 is your bible — read every module spec carefully
