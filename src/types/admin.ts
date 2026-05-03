import { AdminRole, UserRole, UserStatus, ProductStatus, BookingStatus, PayoutStatus, DisputeStatus } from "./database";

export type { AdminRole, UserRole, UserStatus };

export type ModuleId = "M01" | "M02" | "M03" | "M04" | "M05" | "M06" | "M07" | "M08" | "M09" | "M10";

export type ModuleAction = "view" | "edit" | "suspend" | "ban" | "verify" | "approve" | "reject" | "flag" | "remove" | "cancel" | "override" | "rule" | "escalate" | "refund" | "flag_fraud" | "create" | "delete" | "export";

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type DisputeVerdict = "favor_renter" | "favor_owner" | "escalate";

// UI-Specific Mock Shapes (for Admin Panel)
export interface MockUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  joinedAt: string;
}

export interface MockListing {
  id: string;
  title: string;
  ownerName: string;
  category: string;
  pricePerDay: number;
  status: ProductStatus;
  location: string;
  photos: string[];
}

export interface MockBooking {
  id: string;
  productTitle: string;
  renterName: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
}

export interface MockDispute {
  id: string;
  bookingId: string;
  status: DisputeStatus;
  listingTitle: string;
  renterName: string;
  ownerName: string;
  renterClaim: string;
  ownerClaim: string;
  depositAmount: number;
  openedAt: string;
  pickupPhotos: { url: string; timestamp: string; gps?: string }[];
  returnPhotos: { url: string; timestamp: string; gps?: string }[];
  verdict?: string;
  verdictNotes?: string;
  resolvedAt?: string;
}

export interface MockPayment {
  id: string;
  listerName: string;
  listerEmail: string;
  net_amount: number;
  status: PayoutStatus;
}

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

export interface MockContent {
  id: string;
  type: string;
  status: string;
  reportedBy: string;
  reportReason: string;
  ownerName: string;
  reportedAt: string;
  contentUrl?: string;
  contentText?: string;
}

export interface AnalyticsData {
  kpis: {
    totalUsers: number;
    totalUsersWoW: number;
    activeListings: number;
    activeListingsWoW: number;
    openDisputes: number;
    openDisputesWoW: number;
    gmv30d: number;
    gmv30dWoW: number;
  };
  revenueOverTime: { date: string; value: number }[];
  bookingsByStatus: { status: string; count: number }[];
  userGrowth: { date: string; value: number }[];
  disputeRate: { date: string; value: number }[];
}
