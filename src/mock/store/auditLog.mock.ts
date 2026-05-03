export interface AuditEntry {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  action: string;
  module: string;
  targetId?: string;
  targetType?: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  metadata?: Record<string, unknown>;
}

const actions = [
  { action: "suspend_user", module: "M01", targetType: "user", desc: "Suspended user account" },
  { action: "approve_listing", module: "M02", targetType: "listing", desc: "Approved rental listing" },
  { action: "reject_listing", module: "M02", targetType: "listing", desc: "Rejected rental listing" },
  { action: "cancel_booking", module: "M03", targetType: "booking", desc: "Cancelled booking" },
  { action: "rule_dispute", module: "M04", targetType: "dispute", desc: "Ruled on dispute" },
  { action: "process_refund", module: "M05", targetType: "payment", desc: "Processed refund" },
  { action: "create_admin", module: "M06", targetType: "admin", desc: "Created new admin account" },
  { action: "update_config", module: "M07", targetType: "config", desc: "Updated platform configuration" },
  { action: "remove_content", module: "M08", targetType: "content", desc: "Removed flagged content" },
  { action: "ban_user", module: "M01", targetType: "user", desc: "Banned user account" },
];

const admins = [
  { id: "adm_001", name: "Nitin Kumar", role: "super_admin" },
  { id: "adm_002", name: "Priya Ops", role: "ops_sub_admin" },
  { id: "adm_003", name: "Rahul Finance", role: "finance_sub_admin" },
  { id: "adm_004", name: "Sneha Content", role: "content_sub_admin" },
];

export const mockAuditLog: AuditEntry[] = Array.from({ length: 100 }, (_, i) => {
  const actionData = actions[i % actions.length];
  const admin = admins[i % admins.length];
  return {
    id: `aud_${String(i + 1).padStart(4, "0")}`,
    adminId: admin.id,
    adminName: admin.name,
    adminRole: admin.role,
    action: actionData.action,
    module: actionData.module,
    targetId: `${actionData.targetType}_${String(i + 1).padStart(3, "0")}`,
    targetType: actionData.targetType,
    description: actionData.desc,
    timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
    ipAddress: `192.168.${Math.floor(i / 10)}.${i % 255}`,
    metadata: { reason: "Admin initiated action" },
  };
});
