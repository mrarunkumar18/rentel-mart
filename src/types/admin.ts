// ============================================================
// RENTIFY — Admin Panel Type Definitions
// Owner: Teammate 3
// ============================================================

export type AdminRole =
  | "super_admin"
  | "ops_sub_admin"
  | "finance_sub_admin"
  | "content_sub_admin"
  | "custom";

export type UserRole = "user" | "admin";

export type UserStatus = "active" | "suspended" | "pending_verify" | "banned";

export type ModuleId =
  | "M01"
  | "M02"
  | "M03"
  | "M04"
  | "M05"
  | "M06"
  | "M07"
  | "M08"
  | "M09"
  | "M10";

export type ModuleAction =
  | "view"
  | "edit"
  | "suspend"
  | "ban"
  | "verify"
  | "approve"
  | "reject"
  | "flag"
  | "remove"
  | "cancel"
  | "override"
  | "rule"
  | "escalate"
  | "refund"
  | "flag_fraud"
  | "create"
  | "delete"
  | "export";

export interface RoleDefinition {
  label: string;
  tier: number;
  modules: ModuleId[];
  actions: Partial<Record<ModuleId, ModuleAction[]>>;
}

export interface RBACConfig {
  roles: Record<AdminRole, RoleDefinition>;
}

export interface CurrentAdminSession {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  customPermissions?: Partial<Record<ModuleId, ModuleAction[]>>;
}

// Pagination helper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
