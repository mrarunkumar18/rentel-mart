"use client";

import { create } from "zustand";
import { AdminRole, CurrentAdminSession, ModuleAction, ModuleId } from "@/types/admin";
import { rbacConfig } from "@/lib/rbac.config";
import { mockAdminAccounts } from "@/mock/store/adminAccounts.mock";

// ── SWAP POINT (Phase 4b): Replace mock session with JWT decoded from Supabase Auth cookie ──
interface AdminSessionStore {
  session: CurrentAdminSession | null;
  setRole: (role: AdminRole) => void; // DEV-ONLY: role switcher
  logout: () => void;
}

// Default to super_admin for development. Phase 4b replaces this with real auth.
const defaultSession = mockAdminAccounts[0];

export const useAdminSession = create<AdminSessionStore>((set) => ({
  session: {
    id: defaultSession.id,
    name: defaultSession.name,
    email: defaultSession.email,
    role: defaultSession.role,
    customPermissions: defaultSession.customPermissions as CurrentAdminSession["customPermissions"],
  },
  setRole: (role: AdminRole) => {
    const account = mockAdminAccounts.find((a) => a.role === role) || mockAdminAccounts[0];
    set({
      session: {
        id: account.id,
        name: account.name,
        email: account.email,
        role,
        customPermissions: account.customPermissions as CurrentAdminSession["customPermissions"],
      },
    });
  },
  logout: () => set({ session: null }),
}));

// ─────────────────────────────────────────────
// useRBAC — the required hook interface
// ─────────────────────────────────────────────
export function useRBAC() {
  const session = useAdminSession((s) => s.session);

  if (!session) {
    return {
      role: null,
      modules: [] as ModuleId[],
      can: () => false,
    };
  }

  const roleDef = rbacConfig.roles[session.role];
  const effectiveModules: ModuleId[] =
    session.role === "custom"
      ? (Object.keys(session.customPermissions || {}) as ModuleId[])
      : roleDef.modules;

  const effectiveActions: Partial<Record<ModuleId, ModuleAction[]>> =
    session.role === "custom"
      ? (session.customPermissions || {})
      : roleDef.actions;

  const can = (moduleId: ModuleId, action: ModuleAction): boolean => {
    if (!effectiveModules.includes(moduleId)) return false;
    const allowed = effectiveActions[moduleId] || [];
    return allowed.includes(action);
  };

  return {
    role: session.role,
    modules: effectiveModules,
    can,
  };
}
