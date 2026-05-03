// ============================================================================
// Rentify — Complete TypeScript Type Definitions
// Reference: PRD Part 2.4, Supabase Schema (001-003 SQL files)
// All types match the PostgreSQL schema exactly — strict mode, zero `any`
// ============================================================================

// ============================================================================
// ENUM TYPES
// ============================================================================

/** User role — PRD 1.3: single account, role determines access level */
export type UserRole = 'user' | 'admin' | 'super_admin';

/** Product listing status — PRD 3.6.1: lifecycle from creation to archival */
export type ProductStatus = 'pending' | 'active' | 'suspended' | 'archived';

/** Product condition at time of listing */
export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair' | 'worn';

/** Delivery option set by lister — PRD 3.6.1 */
export type DeliveryOption = 'platform' | 'self_pickup' | 'both';

/** Booking status lifecycle — PRD 3.5: pending → confirmed → active → completed */
export type BookingStatus =
  | 'pending_approval'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

/** Delivery method chosen by renter at booking — PRD 3.8 */
export type DeliveryMethod = 'platform' | 'self_pickup';

/** Payment plan type — PRD 3.4.1: rules based on rental duration */
export type PaymentPlanType = 'upfront' | 'weekly' | 'monthly';

/** Installment payment status */
export type InstallmentStatus = 'pending' | 'paid' | 'overdue';

/** Condition photo type — PRD 3.7: mandatory at pickup and return */
export type ConditionPhotoType = 'pickup' | 'return';

/** Dispute status — PRD 3.10: lifecycle from claim to resolution */
export type DisputeStatus = 'open' | 'under_review' | 'resolved';

/** Payout status — PRD 3.9: hold period then release */
export type PayoutStatus = 'pending' | 'on_hold' | 'released' | 'blocked';

/** Delivery order type — PRD 3.8: outbound or inbound */
export type DeliveryOrderType = 'deliver' | 'collect';

/** Delivery order status lifecycle — PRD 3.8 */
export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'collected';

/** Late fee accrual unit — PRD 3.11: configured per product by lister */
export type LateFeeUnit = 'per_hour' | 'per_6_hours' | 'per_day';

/** Platform fee model — PRD 5.2: transaction %, flat fee, or subscription */
export type PlatformFeeType = 'transaction_percentage' | 'flat_fee' | 'subscription';

/** Admin role type — PRD 4.2: RBAC with granular permissions */
export type AdminRole = 'super_admin' | 'operations' | 'finance' | 'content' | 'custom';

// ============================================================================
// TABLE INTERFACES
// ============================================================================

/**
 * users — Single table for all user types
 * PRD 1.3: One account handles both listing and renting
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * products — Listed items available for rent
 * PRD 3.6.1: Lister creates with title, description, category, value
 */
export interface Product {
  id: string;
  lister_id: string;
  title: string;
  description: string | null;
  category: string;
  original_value: number;
  condition: string;
  delivery_option: DeliveryOption;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

/**
 * product_pricing — Flexible pricing tiers per product
 * PRD 3.6.1: Lister enables per_day/week/month/year rates
 * PRD 3.11: Late return fee rate and unit
 */
export interface ProductPricing {
  id: string;
  product_id: string;
  per_day: number | null;
  per_week: number | null;
  per_month: number | null;
  per_year: number | null;
  late_fee_rate: number;
  late_fee_unit: LateFeeUnit;
}

/**
 * product_images — Product listing photos
 * PRD 3.6.1: 3 minimum, 10 maximum images
 */
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

/**
 * bookings — Core rental record
 * PRD 3.4: Booking flow linking product, renter, lister
 */
export interface Booking {
  id: string;
  product_id: string;
  renter_id: string;
  lister_id: string;
  start_date: string;
  end_date: string;
  delivery_method: DeliveryMethod;
  status: BookingStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * booking_payments — Financial record per booking
 * PRD 3.4.1: Rent total, deposit (20%), delivery fee, platform fee
 */
export interface BookingPayment {
  id: string;
  booking_id: string;
  rent_total: number;
  deposit_amount: number;
  delivery_fee: number;
  platform_fee: number;
  payment_plan: PaymentPlanType;
  total_due: number;
  created_at: string;
}

/**
 * installments — Payment plan tracking
 * PRD 3.4.1: Weekly or monthly installments for longer rentals
 */
export interface Installment {
  id: string;
  booking_id: string;
  due_date: string;
  amount: number;
  status: InstallmentStatus;
  paid_at: string | null;
}

/**
 * condition_photos — Mandatory evidence at pickup and return
 * PRD 3.7: Minimum 3 photos, auto-tagged with metadata
 */
export interface ConditionPhoto {
  id: string;
  booking_id: string;
  type: ConditionPhotoType;
  url: string;
  captured_at: string;
  captured_by: string;
}

/**
 * disputes — Damage claims and resolution
 * PRD 3.10: Lister raises within 24h, admin arbitrates
 */
export interface Dispute {
  id: string;
  booking_id: string;
  raised_by: string;
  admin_id: string | null;
  status: DisputeStatus;
  claim_notes: string | null;
  renter_response: string | null;
  verdict: string | null;
  deduction_amount: number;
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

/**
 * payouts — Lister earnings with hold period
 * PRD 3.9: 5-tier hold based on rental duration
 */
export interface Payout {
  id: string;
  lister_id: string;
  booking_id: string;
  gross_amount: number;
  deductions: number;
  net_amount: number;
  status: PayoutStatus;
  hold_until: string | null;
  released_at: string | null;
  created_at: string;
}

/**
 * delivery_orders — Platform delivery management
 * PRD 3.8: Outbound (deliver) and inbound (collect) orders
 */
export interface DeliveryOrder {
  id: string;
  booking_id: string;
  agent_id: string | null;
  type: DeliveryOrderType;
  status: DeliveryStatus;
  pickup_address: string | null;
  delivery_address: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * platform_config — Admin-controlled key-value settings
 * PRD 4.3.9: All financial and operational parameters
 */
export interface PlatformConfig {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

/**
 * admin_roles — RBAC for admin panel
 * PRD 4.2: Super admin + sub-admin with JSON permissions
 */
export interface AdminRoleEntry {
  id: string;
  user_id: string;
  role: AdminRole;
  permissions_json: Record<string, boolean>;
  created_at: string;
}

// ============================================================================
// INSERT TYPES — Omit auto-generated fields (id, created_at, updated_at)
// ============================================================================

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductPricingInsert = Omit<ProductPricing, 'id'>;
export type ProductImageInsert = Omit<ProductImage, 'id' | 'created_at'>;
export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
export type BookingPaymentInsert = Omit<BookingPayment, 'id' | 'created_at'>;
export type InstallmentInsert = Omit<Installment, 'id'>;
export type ConditionPhotoInsert = Omit<ConditionPhoto, 'id' | 'captured_at'>;
export type DisputeInsert = Omit<Dispute, 'id' | 'created_at' | 'resolved_at'>;
export type PayoutInsert = Omit<Payout, 'id' | 'released_at' | 'created_at'>;
export type DeliveryOrderInsert = Omit<DeliveryOrder, 'id' | 'created_at' | 'updated_at'>;
export type PlatformConfigInsert = Omit<PlatformConfig, 'id' | 'updated_at'>;
export type AdminRoleEntryInsert = Omit<AdminRoleEntry, 'id' | 'created_at'>;

// ============================================================================
// UPDATE TYPES — All insertable fields become optional
// ============================================================================

export type UserUpdate = Partial<UserInsert>;
export type ProductUpdate = Partial<ProductInsert>;
export type ProductPricingUpdate = Partial<ProductPricingInsert>;
export type ProductImageUpdate = Partial<ProductImageInsert>;
export type BookingUpdate = Partial<BookingInsert>;
export type BookingPaymentUpdate = Partial<BookingPaymentInsert>;
export type InstallmentUpdate = Partial<InstallmentInsert>;
export type ConditionPhotoUpdate = Partial<ConditionPhotoInsert>;
export type DisputeUpdate = Partial<DisputeInsert>;
export type PayoutUpdate = Partial<PayoutInsert>;
export type DeliveryOrderUpdate = Partial<DeliveryOrderInsert>;
export type PlatformConfigUpdate = Partial<PlatformConfigInsert>;
export type AdminRoleEntryUpdate = Partial<AdminRoleEntryInsert>;

// ============================================================================
// JOIN TYPES — Common query result shapes
// ============================================================================

/** Product with its pricing and images — used on product detail screen */
export interface ProductWithDetails extends Product {
  pricing: ProductPricing | null;
  images: ProductImage[];
}

/** Product with just pricing — used in browse/search results */
export interface ProductWithPricing extends Product {
  pricing: ProductPricing | null;
}

/** Product with images only — used in listing management */
export interface ProductWithImages extends Product {
  images: ProductImage[];
}

/** Booking with full related data — used on order detail screen */
export interface BookingWithDetails extends Booking {
  product: Product;
  renter: User;
  lister: User;
  payment: BookingPayment | null;
  installments: Installment[];
  condition_photos: ConditionPhoto[];
  delivery_order: DeliveryOrder | null;
  dispute: Dispute | null;
  payout: Payout | null;
}

/** Booking with product info — used in order list views */
export interface BookingWithProduct extends Booking {
  product: Product;
}

/** Dispute with booking and user context — used in admin dispute review */
export interface DisputeWithContext extends Dispute {
  booking: BookingWithDetails;
  raised_by_user: User;
  admin: User | null;
}

/** Payout with booking and lister info — used in admin payout management */
export interface PayoutWithContext extends Payout {
  booking: Booking;
  lister: User;
}

/** User with their admin role — used for permission checks */
export interface UserWithAdminRole extends User {
  admin_role: AdminRoleEntry | null;
}

// ============================================================================
// PLATFORM CONFIG KEYS — Type-safe config key constants
// PRD 4.3.9: All configurable platform parameters
// ============================================================================

export type PlatformConfigKey =
  | 'security_deposit_pct'
  | 'platform_fee_type'
  | 'platform_fee_pct'
  | 'platform_flat_fee'
  | 'subscription_monthly_fee'
  | 'fee_model_active'
  | 'delivery_fee_outbound'
  | 'delivery_fee_inbound'
  | 'payout_hold_short'
  | 'payout_hold_medium'
  | 'payout_hold_long'
  | 'payout_hold_extended'
  | 'payout_hold_max'
  | 'damage_claim_window_hours'
  | 'deposit_auto_release_days'
  | 'min_rental_duration_days'
  | 'max_rental_duration_days'
  | 'listing_auto_approve'
  | 'smtp_from_email'
  | 'platform_name';

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Database table names for type-safe table references */
export type TableName =
  | 'users'
  | 'products'
  | 'product_pricing'
  | 'product_images'
  | 'bookings'
  | 'booking_payments'
  | 'installments'
  | 'condition_photos'
  | 'disputes'
  | 'payouts'
  | 'delivery_orders'
  | 'platform_config'
  | 'admin_roles';

/** Product categories — extensible via admin panel (PRD 4.3.3) */
export type ProductCategory =
  | 'Electronics'
  | 'Furniture'
  | 'Sports'
  | 'Tools'
  | 'Vehicles'
  | 'Appliances'
  | 'Fashion'
  | 'Books'
  | 'Music'
  | 'Outdoor'
  | string; // Allows admin-defined categories
