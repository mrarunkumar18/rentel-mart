import { RBACConfig } from "@/types/admin";

// ── SWAP POINT: In Phase 4b replace with JWT-decoded role from Supabase Auth ──
export const rbacConfig: RBACConfig = {
  roles: {
    super_admin: {
      label: "Super Admin",
      tier: 1,
      modules: ["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10"],
      actions: {
        M01: ["view","edit","suspend","ban","verify"],
        M02: ["view","approve","reject","flag","remove"],
        M03: ["view","cancel","override"],
        M04: ["view","rule","escalate"],
        M05: ["view","refund","flag_fraud"],
        M06: ["view","create","edit","delete"],
        M07: ["view","edit"],
        M08: ["view","approve","remove"],
        M09: ["view","export"],
        M10: ["view"],
      },
    },
    ops_sub_admin: {
      label: "Ops Sub-Admin",
      tier: 2,
      modules: ["M01","M02","M03","M08"],
      actions: {
        M01: ["view","suspend"],
        M02: ["view","approve","reject","flag"],
        M03: ["view"],
        M08: ["view","approve","remove"],
      },
    },
    finance_sub_admin: {
      label: "Finance Sub-Admin",
      tier: 3,
      modules: ["M03","M05","M09"],
      actions: {
        M03: ["view"],
        M05: ["view","refund"],
        M09: ["view","export"],
      },
    },
    content_sub_admin: {
      label: "Content Sub-Admin",
      tier: 4,
      modules: ["M02","M08"],
      actions: {
        M02: ["view"],
        M08: ["view","approve","remove"],
      },
    },
    custom: {
      label: "Custom",
      tier: 5,
      modules: [],
      actions: {},
    },
  },
};
