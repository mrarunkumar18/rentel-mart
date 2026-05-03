import { AdminRole, UserStatus } from "@/types/database";

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
  {
    id: "adm_003",
    name: "Rahul Finance",
    email: "rahul.finance@rentify.in",
    role: "finance_sub_admin",
    tier: 3,
    createdAt: new Date("2024-04-01").toISOString(),
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "adm_004",
    name: "Sneha Content",
    email: "sneha.content@rentify.in",
    role: "content_sub_admin",
    tier: 4,
    createdAt: new Date("2024-05-01").toISOString(),
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "adm_005",
    name: "Vikram Custom",
    email: "vikram.custom@rentify.in",
    role: "custom",
    tier: 5,
    createdAt: new Date("2024-06-01").toISOString(),
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    customPermissions: {
      M01: ["view"],
      M03: ["view"],
    },
  },
];
