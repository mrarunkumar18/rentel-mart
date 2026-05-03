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
  adminId: ["adm_001", "adm_002", "adm_003", "adm_004"][i % 4],
  adminName: ["Nitin Kumar", "Priya Ops", "Rahul Finance", "Sneha Content"][i % 4],
  adminRole: ["super_admin", "ops_sub_admin", "finance_sub_admin", "content_sub_admin"][i % 4] as AdminRole,
  action: ["Update Config", "Suspend User", "Approve Listing", "Resolve Dispute", "Export Report"][i % 5],
  module: ["M07", "M01", "M02", "M04", "M09"][i % 5],
  targetId: `target_${100 + i}`,
  description: `Admin performed action ${i + 1} on the system.`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  ipAddress: `192.168.1.${10 + i}`,
}));
