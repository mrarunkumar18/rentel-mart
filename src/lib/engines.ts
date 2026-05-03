// ============================================================================
// Rentify — Business Logic Calculation Engines
// Reference: PRD 3.3.2, 3.4.1, 3.9, 3.11, 5.1-5.2
// All functions are PURE — no side effects, no database calls
// ============================================================================

import type {
  ProductPricing,
  PaymentPlanType,
  LateFeeUnit,
  PlatformFeeType,
  InstallmentStatus,
} from '@/types/database';

// ============================================================================
// RESULT TYPES
// ============================================================================

/** Result from calculateRentalPrice */
export interface RentalPriceResult {
  /** Total rental cost */
  total: number;
  /** The pricing tier that was used */
  rateUsed: 'per_day' | 'per_week' | 'per_month' | 'per_year';
  /** The per-unit rate applied */
  rateAmount: number;
  /** Number of units (days, weeks, months, years) */
  units: number;
  /** Total duration in days */
  durationDays: number;
}

/** Result from calculatePlatformFee */
export interface PlatformFeeResult {
  /** Fee from transaction percentage model */
  transactionFee: number;
  /** Fee from flat fee model */
  flatFee: number;
  /** Fee from subscription model */
  subscriptionFee: number;
  /** Total platform fee (sum of all active models) */
  total: number;
}

/** Fee configuration — matches platform_config values */
export interface FeeConfig {
  /** Which fee models are active */
  activeModels: PlatformFeeType[];
  /** Transaction percentage (e.g., 10 for 10%) */
  transactionPct: number;
  /** Flat fee per listing/transaction in INR */
  flatFeeAmount: number;
  /** Monthly subscription fee in INR */
  subscriptionAmount: number;
}

/** Result from calculatePayoutBreakdown */
export interface PayoutBreakdownResult {
  /** Gross rental amount */
  gross: number;
  /** Platform fee deducted */
  platformFee: number;
  /** Other deductions (damage, late fees, etc.) */
  deductions: number;
  /** Net payout to lister: gross - platformFee - deductions */
  net: number;
}

/** Single installment in a payment plan */
export interface InstallmentBreakdown {
  /** Installment number (1-indexed) */
  installmentNumber: number;
  /** Date the installment is due */
  dueDate: string;
  /** Amount due for this installment */
  amount: number;
  /** Payment status */
  status: InstallmentStatus;
}

// ============================================================================
// 1. calculateRentalPrice
// PRD 3.3.2: Select optimal pricing tier based on duration
// Tier selection: ≤6d → per_day, 7-27d → per_week, 28-364d → per_month, ≥365d → per_year
// Falls back to next available tier if preferred tier has no rate set
// ============================================================================

/**
 * Calculates the total rental cost using the optimal pricing tier.
 *
 * @param pricing - Product pricing with per_day/week/month/year rates
 * @param startDate - Rental start date (ISO string or Date)
 * @param endDate - Rental end date (ISO string or Date)
 * @returns Rental price result with total, rate used, and duration
 */
export function calculateRentalPrice(
  pricing: Pick<ProductPricing, 'per_day' | 'per_week' | 'per_month' | 'per_year'>,
  startDate: string | Date,
  endDate: string | Date
): RentalPriceResult {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

  // Determine preferred tier based on duration
  type Tier = 'per_day' | 'per_week' | 'per_month' | 'per_year';
  const tierPriority: Tier[] =
    durationDays >= 365
      ? ['per_year', 'per_month', 'per_week', 'per_day']
      : durationDays >= 28
        ? ['per_month', 'per_week', 'per_day', 'per_year']
        : durationDays >= 7
          ? ['per_week', 'per_day', 'per_month', 'per_year']
          : ['per_day', 'per_week', 'per_month', 'per_year'];

  // Find the first available tier
  for (const tier of tierPriority) {
    const rate = pricing[tier];
    if (rate !== null && rate !== undefined && rate > 0) {
      let units: number;
      switch (tier) {
        case 'per_day':
          units = durationDays;
          break;
        case 'per_week':
          units = Math.ceil(durationDays / 7);
          break;
        case 'per_month':
          units = Math.ceil(durationDays / 30);
          break;
        case 'per_year':
          units = Math.ceil(durationDays / 365);
          break;
      }
      return {
        total: Math.round(rate * units * 100) / 100,
        rateUsed: tier,
        rateAmount: rate,
        units,
        durationDays,
      };
    }
  }

  // No pricing available — return 0
  return {
    total: 0,
    rateUsed: 'per_day',
    rateAmount: 0,
    units: durationDays,
    durationDays,
  };
}

// ============================================================================
// 2. calculateSecurityDeposit
// PRD 1.2, 3.3.2: 20% of product's listed original value
// PRD 4.3.9: Configurable via security_deposit_pct
// ============================================================================

/**
 * Calculates the security deposit for a product.
 *
 * @param productOriginalValue - The product's original value in INR
 * @param depositPercentage - Deposit percentage (default: 20%)
 * @returns Security deposit amount
 */
export function calculateSecurityDeposit(
  productOriginalValue: number,
  depositPercentage: number = 20
): number {
  if (productOriginalValue <= 0 || depositPercentage <= 0) return 0;
  return Math.round((productOriginalValue * depositPercentage) / 100 * 100) / 100;
}

// ============================================================================
// 3. calculateLateFee
// PRD 3.11: Accrual based on rate and unit (per_hour, per_6_hours, per_day)
// Late fee rate and unit are set by the lister per product
// ============================================================================

/**
 * Calculates the accrued late fee for an overdue return.
 *
 * @param lateFeeRate - Fee amount per unit (set by lister)
 * @param lateFeeUnit - Accrual unit: per_hour, per_6_hours, per_day
 * @param hoursOverdue - Total hours the product is overdue
 * @returns Total accrued late fee
 */
export function calculateLateFee(
  lateFeeRate: number,
  lateFeeUnit: LateFeeUnit,
  hoursOverdue: number
): number {
  if (lateFeeRate <= 0 || hoursOverdue <= 0) return 0;

  let feeUnits: number;
  switch (lateFeeUnit) {
    case 'per_hour':
      feeUnits = Math.ceil(hoursOverdue);
      break;
    case 'per_6_hours':
      feeUnits = Math.ceil(hoursOverdue / 6);
      break;
    case 'per_day':
      feeUnits = Math.ceil(hoursOverdue / 24);
      break;
  }

  return Math.round(lateFeeRate * feeUnits * 100) / 100;
}

// ============================================================================
// 4. calculatePlatformFee
// PRD 5.1-5.2: Supports 3 fee models (transaction %, flat fee, subscription)
// PRD 5.2: Multiple models can be active simultaneously
// Fee is ALWAYS charged to the Lister, never the Renter
// ============================================================================

/**
 * Calculates the total platform fee using all active fee models.
 *
 * @param rentalValue - Total rental value in INR
 * @param feeConfig - Platform fee configuration
 * @returns Breakdown of fees per model and total
 */
export function calculatePlatformFee(
  rentalValue: number,
  feeConfig: FeeConfig
): PlatformFeeResult {
  const result: PlatformFeeResult = {
    transactionFee: 0,
    flatFee: 0,
    subscriptionFee: 0,
    total: 0,
  };

  if (feeConfig.activeModels.includes('transaction_percentage')) {
    result.transactionFee =
      Math.round((rentalValue * feeConfig.transactionPct) / 100 * 100) / 100;
  }

  if (feeConfig.activeModels.includes('flat_fee')) {
    result.flatFee = feeConfig.flatFeeAmount;
  }

  if (feeConfig.activeModels.includes('subscription')) {
    result.subscriptionFee = feeConfig.subscriptionAmount;
  }

  result.total =
    Math.round((result.transactionFee + result.flatFee + result.subscriptionFee) * 100) / 100;

  return result;
}

// ============================================================================
// 5. calculatePayoutHoldPeriod
// PRD 3.9: 5-tier hold period based on rental duration
// ============================================================================

/**
 * Determines the payout hold period after product return.
 * PRD 3.9 hold tiers:
 * - 1–3 days rental → 2 days hold
 * - 4–7 days rental → 5 days hold
 * - 8–14 days rental → 7 days hold
 * - 15–30 days rental → 10 days hold
 * - 30+ days rental → 14 days hold
 *
 * @param rentalDurationDays - Total rental duration in days
 * @returns Number of hold days before payout release
 */
export function calculatePayoutHoldPeriod(rentalDurationDays: number): number {
  if (rentalDurationDays <= 0) return 2;
  if (rentalDurationDays <= 3) return 2;
  if (rentalDurationDays <= 7) return 5;
  if (rentalDurationDays <= 14) return 7;
  if (rentalDurationDays <= 30) return 10;
  return 14;
}

// ============================================================================
// 6. calculatePayoutBreakdown
// PRD 5.3: Gross Rental − Platform Fee − Deductions = Net Payout
// ============================================================================

/**
 * Calculates the payout breakdown for a lister.
 *
 * @param grossAmount - Total rental amount
 * @param platformFee - Platform fee deducted
 * @param deductions - Other deductions (damage claims, etc.)
 * @returns Payout breakdown with gross, fees, deductions, and net
 */
export function calculatePayoutBreakdown(
  grossAmount: number,
  platformFee: number,
  deductions: number = 0
): PayoutBreakdownResult {
  const net = Math.round((grossAmount - platformFee - deductions) * 100) / 100;
  return {
    gross: grossAmount,
    platformFee,
    deductions,
    net: Math.max(0, net), // Net can never be negative
  };
}

// ============================================================================
// 7. determinePaymentPlan
// PRD 3.4.1: Payment plan rules based on rental duration
// ≤7 days → upfront only | 8-30 days → upfront OR weekly | >30 days → upfront OR monthly
// ============================================================================

/**
 * Determines available payment plans based on rental duration.
 *
 * @param durationDays - Rental duration in days
 * @returns Array of available payment plan types
 */
export function determinePaymentPlan(durationDays: number): PaymentPlanType[] {
  if (durationDays <= 7) return ['upfront'];
  if (durationDays <= 30) return ['upfront', 'weekly'];
  return ['upfront', 'monthly'];
}

// ============================================================================
// 8. splitInstallments
// Splits a total amount into equal installments based on the payment plan
// Security deposit is always upfront (PRD 3.4.1)
// ============================================================================

/**
 * Splits the rental total into installments based on payment plan.
 *
 * @param totalAmount - Total rental amount (excluding deposit)
 * @param paymentPlan - The chosen payment plan
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns Array of installment breakdowns
 */
export function splitInstallments(
  totalAmount: number,
  paymentPlan: PaymentPlanType,
  startDate: string | Date,
  endDate: string | Date
): InstallmentBreakdown[] {
  if (paymentPlan === 'upfront') {
    return [
      {
        installmentNumber: 1,
        dueDate: new Date(startDate).toISOString().split('T')[0],
        amount: Math.round(totalAmount * 100) / 100,
        status: 'pending',
      },
    ];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

  let numberOfInstallments: number;
  let intervalDays: number;

  if (paymentPlan === 'weekly') {
    numberOfInstallments = Math.max(1, Math.ceil(durationDays / 7));
    intervalDays = 7;
  } else {
    // monthly
    numberOfInstallments = Math.max(1, Math.ceil(durationDays / 30));
    intervalDays = 30;
  }

  const baseAmount = Math.floor((totalAmount / numberOfInstallments) * 100) / 100;
  const remainder =
    Math.round((totalAmount - baseAmount * numberOfInstallments) * 100) / 100;

  const installments: InstallmentBreakdown[] = [];

  for (let i = 0; i < numberOfInstallments; i++) {
    const dueDate = new Date(start);
    dueDate.setDate(dueDate.getDate() + i * intervalDays);

    // Add remainder to the first installment
    const amount = i === 0 ? baseAmount + remainder : baseAmount;

    installments.push({
      installmentNumber: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: Math.round(amount * 100) / 100,
      status: 'pending',
    });
  }

  return installments;
}

// ============================================================================
// 9. calculateTotalDue
// PRD 3.4.1: Total = Rent + Deposit + Delivery Fee
// (Platform fee is deducted from lister's payout, not charged to renter)
// ============================================================================

/**
 * Calculates the total amount due from the renter at booking.
 *
 * @param rentTotal - Total rental cost
 * @param depositAmount - Security deposit (20% of product value)
 * @param deliveryFee - Delivery fee (0 if self-pickup)
 * @returns Total amount due from renter
 */
export function calculateTotalDue(
  rentTotal: number,
  depositAmount: number,
  deliveryFee: number = 0
): number {
  return Math.round((rentTotal + depositAmount + deliveryFee) * 100) / 100;
}
