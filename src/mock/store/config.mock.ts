export interface PlatformConfig {
  // GROUP 1: Fees & Pricing
  platform_fee_percentage: number;
  late_return_fee_per_hour: number;
  security_deposit_multiplier: number;
  minimum_rental_duration_hours: number;
  maximum_rental_duration_days: number;

  // GROUP 2: User Policies
  require_id_verification: boolean;
  require_phone_verification: boolean;
  max_active_bookings_per_user: number;
  auto_suspend_after_disputes: number;
  guest_checkout_enabled: boolean;

  // GROUP 3: Listing Rules
  max_photos_per_listing: number;
  require_pickup_photos: boolean;
  require_return_photos: boolean;
  listing_approval_required: boolean;

  // GROUP 4: Notifications
  send_booking_email: boolean;
  send_dispute_email: boolean;
  admin_alert_email: string;

  // GROUP 5: Operational
  maintenance_mode: boolean;
}

export const mockConfig: PlatformConfig = {
  platform_fee_percentage: 10,
  late_return_fee_per_hour: 100,
  security_deposit_multiplier: 1.2,
  minimum_rental_duration_hours: 24,
  maximum_rental_duration_days: 30,

  require_id_verification: true,
  require_phone_verification: true,
  max_active_bookings_per_user: 5,
  auto_suspend_after_disputes: 3,
  guest_checkout_enabled: false,

  max_photos_per_listing: 10,
  require_pickup_photos: true,
  require_return_photos: true,
  listing_approval_required: true,

  send_booking_email: true,
  send_dispute_email: true,
  admin_alert_email: "admin@rentify.in",

  maintenance_mode: false,
};
