// ============================================================================
// Rentify — Mock Data Seed (10 users, 25 products, 50 bookings)
// All data typed against /src/types/database.ts
// ============================================================================

import type {
  User, Product, ProductPricing, ProductImage, Booking, BookingPayment,
  Installment, ConditionPhoto, Dispute, Payout, DeliveryOrder,
  PlatformConfig, AdminRoleEntry,
} from '@/types/database';

// ============================================================================
// HELPERS
// ============================================================================
const uuid = (n: number) => `00000000-0000-4000-a000-${String(n).padStart(12, '0')}`;
const date = (d: string) => `${d}T00:00:00.000Z`;
const now = '2026-05-03T12:00:00.000Z';

// ============================================================================
// 1. USERS (10)
// ============================================================================
export const mockUsers: User[] = [
  { id: uuid(1), email: 'rahul.sharma@email.com', full_name: 'Rahul Sharma', phone: '+91-9876543201', role: 'user', status: 'active', avatar_url: null, address: '12 MG Road', city: 'Mumbai', created_at: now, updated_at: now },
  { id: uuid(2), email: 'priya.patel@email.com', full_name: 'Priya Patel', phone: '+91-9876543202', role: 'user', status: 'active', avatar_url: null, address: '45 Brigade Rd', city: 'Bangalore', created_at: now, updated_at: now },
  { id: uuid(3), email: 'arjun.reddy@email.com', full_name: 'Arjun Reddy', phone: '+91-9876543203', role: 'user', status: 'active', avatar_url: null, address: '78 Jubilee Hills', city: 'Hyderabad', created_at: now, updated_at: now },
  { id: uuid(4), email: 'sneha.kumar@email.com', full_name: 'Sneha Kumar', phone: '+91-9876543204', role: 'user', status: 'suspended', avatar_url: null, address: '23 Connaught Pl', city: 'Delhi', created_at: now, updated_at: now },
  { id: uuid(5), email: 'vikram.singh@email.com', full_name: 'Vikram Singh', phone: '+91-9876543205', role: 'user', status: 'active', avatar_url: null, address: '56 Civil Lines', city: 'Jaipur', created_at: now, updated_at: now },
  { id: uuid(6), email: 'ananya.gupta@email.com', full_name: 'Ananya Gupta', phone: '+91-9876543206', role: 'user', status: 'active', avatar_url: null, address: '89 Park Street', city: 'Kolkata', created_at: now, updated_at: now },
  { id: uuid(7), email: 'karthik.nair@email.com', full_name: 'Karthik Nair', phone: '+91-9876543207', role: 'user', status: 'pending_verify', avatar_url: null, address: '34 Marine Dr', city: 'Kochi', created_at: now, updated_at: now },
  { id: uuid(8), email: 'meera.joshi@email.com', full_name: 'Meera Joshi', phone: '+91-9876543208', role: 'user', status: 'active', avatar_url: null, address: '67 FC Road', city: 'Pune', created_at: now, updated_at: now },
  { id: uuid(9), email: 'admin@rentify.com', full_name: 'Admin User', phone: '+91-9876543209', role: 'admin', status: 'active', avatar_url: null, address: 'Rentify HQ', city: 'Mumbai', created_at: now, updated_at: now },
  { id: uuid(10), email: 'superadmin@rentify.com', full_name: 'Super Admin', phone: '+91-9876543210', role: 'super_admin', status: 'active', avatar_url: null, address: 'Rentify HQ', city: 'Mumbai', created_at: now, updated_at: now },
];

// ============================================================================
// 2. PRODUCTS (25) — across 5 categories
// ============================================================================
const productData: Array<[string, string, string, number, string]> = [
  // [title, category, lister(uuid#), originalValue, condition]
  ['Canon EOS R5 Camera', 'Electronics', '1', 250000, 'like_new'],
  ['Sony A7III Mirrorless', 'Electronics', '2', 180000, 'good'],
  ['DJI Mavic 3 Drone', 'Electronics', '3', 150000, 'new'],
  ['MacBook Pro 16"', 'Electronics', '1', 200000, 'good'],
  ['iPad Pro 12.9"', 'Electronics', '4', 100000, 'like_new'],
  ['Herman Miller Aeron Chair', 'Furniture', '2', 120000, 'good'],
  ['Standing Desk Motorized', 'Furniture', '5', 45000, 'new'],
  ['L-Shape Sofa Set', 'Furniture', '3', 80000, 'good'],
  ['King Size Bed Frame', 'Furniture', '6', 55000, 'fair'],
  ['Bookshelf Oak 6-Tier', 'Furniture', '7', 25000, 'good'],
  ['Trek Domane Road Bike', 'Sports', '4', 95000, 'like_new'],
  ['Camping Tent 6-Person', 'Sports', '5', 15000, 'good'],
  ['Golf Club Set Complete', 'Sports', '1', 75000, 'good'],
  ['Kayak Inflatable 2-Seater', 'Sports', '6', 35000, 'new'],
  ['Treadmill ProForm', 'Sports', '8', 60000, 'good'],
  ['Bosch Power Drill Kit', 'Tools', '3', 12000, 'good'],
  ['Pressure Washer 2000PSI', 'Tools', '7', 18000, 'like_new'],
  ['Welding Machine ARC', 'Tools', '5', 22000, 'fair'],
  ['Circular Saw Dewalt', 'Tools', '2', 15000, 'good'],
  ['Generator 5KVA Portable', 'Tools', '8', 45000, 'good'],
  ['Royal Enfield Classic 350', 'Vehicles', '1', 180000, 'good'],
  ['Honda Activa 6G', 'Vehicles', '4', 85000, 'like_new'],
  ['Tata Nexon EV', 'Vehicles', '6', 1500000, 'new'],
  ['Yamaha R15 V4', 'Vehicles', '3', 170000, 'good'],
  ['Maruti Swift 2024', 'Vehicles', '7', 800000, 'like_new'],
];

export const mockProducts: Product[] = productData.map((p, i) => ({
  id: uuid(100 + i),
  lister_id: uuid(parseInt(p[2])),
  title: p[0],
  description: `High quality ${p[0]} available for rent. Well maintained and in ${p[4]} condition.`,
  category: p[1],
  original_value: p[3],
  condition: p[4],
  delivery_option: i % 3 === 0 ? 'both' : i % 3 === 1 ? 'platform' : 'self_pickup',
  status: i < 20 ? 'active' : i === 20 ? 'pending' : i === 21 ? 'suspended' : i === 22 ? 'rejected' : i === 23 ? 'flagged' : 'archived',
  created_at: now,
  updated_at: now,
}));

// ============================================================================
// 3. PRODUCT PRICING (25)
// ============================================================================
export const mockProductPricing: ProductPricing[] = mockProducts.map((p, i) => ({
  id: uuid(200 + i),
  product_id: p.id,
  per_day: Math.round(p.original_value * 0.005),
  per_week: Math.round(p.original_value * 0.025),
  per_month: Math.round(p.original_value * 0.08),
  per_year: Math.round(p.original_value * 0.6),
  late_fee_rate: Math.round(p.original_value * 0.002),
  late_fee_unit: i % 3 === 0 ? 'per_day' : i % 3 === 1 ? 'per_6_hours' : 'per_hour',
}));

// ============================================================================
// 4. PRODUCT IMAGES (50 — 2 per product)
// ============================================================================
export const mockProductImages: ProductImage[] = mockProducts.flatMap((p, i) => [
  { id: uuid(300 + i * 2), product_id: p.id, url: `https://storage.rentify.com/product-images/${p.id}/front.jpg`, is_primary: true, created_at: now },
  { id: uuid(301 + i * 2), product_id: p.id, url: `https://storage.rentify.com/product-images/${p.id}/side.jpg`, is_primary: false, created_at: now },
]);

// ============================================================================
// 5. BOOKINGS (50) — various statuses
// ============================================================================
const statuses: Array<Booking['status']> = ['pending_approval', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'];

export const mockBookings: Booking[] = Array.from({ length: 50 }, (_, i) => {
  const productIdx = i % 22; // only active products
  const product = mockProducts[productIdx];
  // Rotate renters (exclude the lister)
  const renterIdx = ((i % 7) + 1);
  const renterUuid = uuid(renterIdx === parseInt(product.lister_id.slice(-1)) ? (renterIdx % 8) + 1 : renterIdx);
  const startDay = (i % 28) + 1;
  const duration = [3, 5, 7, 10, 14, 21, 30, 45, 60, 90][i % 10];

  const startDate = `2026-${String(5 + Math.floor(i / 28)).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  const endMs = new Date(startDate).getTime() + duration * 86400000;
  const endDate = new Date(endMs).toISOString().split('T')[0];

  return {
    id: uuid(400 + i),
    product_id: product.id,
    renter_id: renterUuid,
    lister_id: product.lister_id,
    start_date: startDate,
    end_date: endDate,
    delivery_method: i % 2 === 0 ? 'platform' : 'self_pickup',
    status: statuses[i % 6],
    rejection_reason: statuses[i % 6] === 'cancelled' ? 'Renter cancelled due to schedule change' : null,
    created_at: now,
    updated_at: now,
  };
});

// ============================================================================
// 6. BOOKING PAYMENTS (50)
// ============================================================================
export const mockBookingPayments: BookingPayment[] = mockBookings.map((b, i) => {
  const product = mockProducts[i % 22];
  const pricing = mockProductPricing[i % 22];
  const duration = [3, 5, 7, 10, 14, 21, 30, 45, 60, 90][i % 10];
  const rentTotal = (pricing.per_day ?? 0) * duration;
  const deposit = Math.round(product.original_value * 0.2);
  const deliveryFee = b.delivery_method === 'platform' ? 200 : 0;
  const platformFee = Math.round(rentTotal * 0.1);

  return {
    id: uuid(500 + i),
    booking_id: b.id,
    rent_total: rentTotal,
    deposit_amount: deposit,
    delivery_fee: deliveryFee,
    platform_fee: platformFee,
    payment_plan: duration <= 7 ? 'upfront' : duration <= 30 ? 'weekly' : 'monthly',
    total_due: rentTotal + deposit + deliveryFee,
    created_at: now,
  };
});

// ============================================================================
// 7. INSTALLMENTS (for non-upfront bookings)
// ============================================================================
export const mockInstallments: Installment[] = mockBookingPayments
  .filter(bp => bp.payment_plan !== 'upfront')
  .flatMap((bp, idx) => {
    const booking = mockBookings.find(b => b.id === bp.booking_id)!;
    const start = new Date(booking.start_date);
    const numInstallments = bp.payment_plan === 'weekly' ? Math.ceil(bp.rent_total / (bp.rent_total / 3)) : 2;
    const amount = Math.round(bp.rent_total / numInstallments);

    return Array.from({ length: Math.min(numInstallments, 4) }, (_, j) => {
      const due = new Date(start);
      due.setDate(due.getDate() + j * (bp.payment_plan === 'weekly' ? 7 : 30));
      return {
        id: uuid(600 + idx * 4 + j),
        booking_id: bp.booking_id,
        due_date: due.toISOString().split('T')[0],
        amount,
        status: j === 0 ? 'paid' as const : 'pending' as const,
        paid_at: j === 0 ? now : null,
      };
    });
  });

// ============================================================================
// 8. CONDITION PHOTOS (20 — for completed/disputed bookings)
// ============================================================================
export const mockConditionPhotos: ConditionPhoto[] = mockBookings
  .filter(b => b.status === 'completed' || b.status === 'disputed')
  .slice(0, 10)
  .flatMap((b, i) => [
    { id: uuid(700 + i * 2), booking_id: b.id, type: 'pickup' as const, url: `https://storage.rentify.com/condition-photos/${b.id}/pickup.jpg`, captured_at: now, captured_by: b.lister_id },
    { id: uuid(701 + i * 2), booking_id: b.id, type: 'return' as const, url: `https://storage.rentify.com/condition-photos/${b.id}/return.jpg`, captured_at: now, captured_by: b.renter_id },
  ]);

// ============================================================================
// 9. DISPUTES (5)
// ============================================================================
const disputedBookings = mockBookings.filter(b => b.status === 'disputed');
export const mockDisputes: Dispute[] = disputedBookings.slice(0, 5).map((b, i) => ({
  id: uuid(800 + i),
  booking_id: b.id,
  raised_by: b.lister_id,
  admin_id: i < 2 ? uuid(9) : null,
  status: i === 0 ? 'resolved' : i < 3 ? 'under_review' : 'open',
  claim_notes: `Damage found on returned item — booking ${b.id}`,
  renter_response: i < 3 ? 'Item was in same condition when returned' : null,
  verdict: i === 0 ? 'Partial deduction — minor scratch on surface' : null,
  deduction_amount: i === 0 ? 2000 : 0,
  resolution_notes: i === 0 ? 'After reviewing pickup vs return photos, minor damage confirmed.' : null,
  created_at: now,
  resolved_at: i === 0 ? now : null,
}));

// ============================================================================
// 10. PAYOUTS (10)
// ============================================================================
const completedBookings = mockBookings.filter(b => b.status === 'completed');
export const mockPayouts: Payout[] = completedBookings.slice(0, 10).map((b, i) => {
  const payment = mockBookingPayments.find(p => p.booking_id === b.id)!;
  const net = payment.rent_total - payment.platform_fee;
  return {
    id: uuid(900 + i),
    lister_id: b.lister_id,
    booking_id: b.id,
    gross_amount: payment.rent_total,
    deductions: payment.platform_fee,
    net_amount: net,
    status: i < 4 ? 'released' : i < 7 ? 'on_hold' : i < 9 ? 'pending' : 'blocked',
    hold_until: i < 4 ? null : '2026-06-15',
    released_at: i < 4 ? now : null,
    created_at: now,
  };
});

// ============================================================================
// 11. DELIVERY ORDERS (8)
// ============================================================================
const platformDeliveries = mockBookings.filter(b => b.delivery_method === 'platform');
export const mockDeliveryOrders: DeliveryOrder[] = platformDeliveries.slice(0, 8).map((b, i) => ({
  id: uuid(1000 + i),
  booking_id: b.id,
  agent_id: i < 6 ? uuid(8) : null,
  type: i % 2 === 0 ? 'deliver' as const : 'collect' as const,
  status: (['assigned', 'picked_up', 'in_transit', 'delivered', 'collected'] as const)[i % 5],
  pickup_address: '12 Warehouse Lane, Mumbai',
  delivery_address: '45 Customer Street, Mumbai',
  created_at: now,
  updated_at: now,
}));

// ============================================================================
// 12. PLATFORM CONFIG — All keys from PRD 4.3.9
// ============================================================================
export const mockPlatformConfig: PlatformConfig[] = [
  { id: uuid(1100), key: 'security_deposit_pct', value: '20', description: 'Security deposit as % of product value', updated_by: uuid(10), updated_at: now },
  { id: uuid(1101), key: 'platform_fee_type', value: 'transaction_percentage', description: 'Active fee model', updated_by: uuid(10), updated_at: now },
  { id: uuid(1102), key: 'platform_fee_pct', value: '10', description: 'Transaction fee percentage', updated_by: uuid(10), updated_at: now },
  { id: uuid(1103), key: 'platform_flat_fee', value: '99', description: 'Flat fee per listing (INR)', updated_by: uuid(10), updated_at: now },
  { id: uuid(1104), key: 'subscription_monthly_fee', value: '499', description: 'Monthly subscription fee (INR)', updated_by: uuid(10), updated_at: now },
  { id: uuid(1105), key: 'fee_model_active', value: 'transaction_percentage', description: 'Currently active fee models', updated_by: uuid(10), updated_at: now },
  { id: uuid(1106), key: 'delivery_fee_outbound', value: '150', description: 'Delivery charge to renter (INR)', updated_by: uuid(10), updated_at: now },
  { id: uuid(1107), key: 'delivery_fee_inbound', value: '150', description: 'Return collection charge (INR)', updated_by: uuid(10), updated_at: now },
  { id: uuid(1108), key: 'payout_hold_short', value: '2', description: 'Hold days for 1-3 day rentals', updated_by: uuid(10), updated_at: now },
  { id: uuid(1109), key: 'payout_hold_medium', value: '5', description: 'Hold days for 4-7 day rentals', updated_by: uuid(10), updated_at: now },
  { id: uuid(1110), key: 'payout_hold_long', value: '7', description: 'Hold days for 8-14 day rentals', updated_by: uuid(10), updated_at: now },
  { id: uuid(1111), key: 'payout_hold_extended', value: '10', description: 'Hold days for 15-30 day rentals', updated_by: uuid(10), updated_at: now },
  { id: uuid(1112), key: 'payout_hold_max', value: '14', description: 'Hold days for 30+ day rentals', updated_by: uuid(10), updated_at: now },
  { id: uuid(1113), key: 'damage_claim_window_hours', value: '24', description: 'Hours to raise damage claim after return', updated_by: uuid(10), updated_at: now },
  { id: uuid(1114), key: 'deposit_auto_release_days', value: '3', description: 'Days before unclaimed deposit auto-refunds', updated_by: uuid(10), updated_at: now },
  { id: uuid(1115), key: 'min_rental_duration_days', value: '1', description: 'Minimum rental duration', updated_by: uuid(10), updated_at: now },
  { id: uuid(1116), key: 'max_rental_duration_days', value: '365', description: 'Maximum rental duration', updated_by: uuid(10), updated_at: now },
  { id: uuid(1117), key: 'listing_auto_approve', value: 'false', description: 'Auto-approve listings without admin review', updated_by: uuid(10), updated_at: now },
  { id: uuid(1118), key: 'smtp_from_email', value: 'noreply@rentify.com', description: 'Sender email for Nodemailer', updated_by: uuid(10), updated_at: now },
  { id: uuid(1119), key: 'platform_name', value: 'Rentify', description: 'Platform display name', updated_by: uuid(10), updated_at: now },
];

// ============================================================================
// 13. ADMIN ROLES (2)
// ============================================================================
export const mockAdminRoles: AdminRoleEntry[] = [
  {
    id: uuid(1200), user_id: uuid(10), role: 'super_admin',
    permissions_json: { users: true, products: true, orders: true, disputes: true, payouts: true, delivery: true, config: true, roles: true, reports: true },
    created_at: now,
  },
  {
    id: uuid(1201), user_id: uuid(9), role: 'operations',
    permissions_json: { users: false, products: true, orders: true, disputes: true, payouts: false, delivery: true, config: false, roles: false, reports: false },
    created_at: now,
  },
];

// ============================================================================
// COMPLETE SEED — All data in one export
// ============================================================================
export const seedData = {
  users: mockUsers,
  products: mockProducts,
  productPricing: mockProductPricing,
  productImages: mockProductImages,
  bookings: mockBookings,
  bookingPayments: mockBookingPayments,
  installments: mockInstallments,
  conditionPhotos: mockConditionPhotos,
  disputes: mockDisputes,
  payouts: mockPayouts,
  deliveryOrders: mockDeliveryOrders,
  platformConfig: mockPlatformConfig,
  adminRoles: mockAdminRoles,
};

export default seedData;
