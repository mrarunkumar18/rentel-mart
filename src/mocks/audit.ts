import { AdminRole } from "@/types/database";

export interface AuditEntry {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  module: string;
  targetId: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

export const mockAuditLog: AuditEntry[] = Array.from({ length: 50 }, (_, i) => ({
  id: `aud_${String(i + 1).padStart(3, "0")}`,
  adminId: ["adm_001", "adm_002"][i % 2],
  adminName: ["Nitin Kumar", "Priya Ops"][i % 2],
  adminRole: ["super_admin", "ops_sub_admin"][i % 2] as AdminRole,
  action: "System Update",
  module: "M01",
  targetId: "sys_001",
  description: "Performed background maintenance",
  timestamp: new Date().toISOString(),
  ipAddress: "127.0.0.1",
}));
