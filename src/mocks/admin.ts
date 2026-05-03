import { AdminRole } from "@/types/database";

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  tier: number;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  customPermissions?: Record<string, string[]>;
}

export const mockAdminAccounts: AdminAccount[] = [
  {
    id: "adm_001",
    name: "Nitin Kumar",
    email: "nitin@rentify.in",
    role: "super_admin",
    tier: 1,
    createdAt: new Date("2024-01-01").toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "adm_002",
    name: "Priya Ops",
    email: "priya.ops@rentify.in",
    role: "ops_sub_admin",
    tier: 2,
    createdAt: new Date("2024-03-15").toISOString(),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];
