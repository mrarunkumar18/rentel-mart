// ============================================================================
// Rentify — Engine Unit Tests (100% coverage target)
// Tests all 9 calculation engine functions
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  calculateRentalPrice,
  calculateSecurityDeposit,
  calculateLateFee,
  calculatePlatformFee,
  calculatePayoutHoldPeriod,
  calculatePayoutBreakdown,
  determinePaymentPlan,
  splitInstallments,
  calculateTotalDue,
} from '../engines';
import type { FeeConfig } from '../engines';

// ============================================================================
// 1. calculateRentalPrice
// ============================================================================

describe('calculateRentalPrice', () => {
  const fullPricing = {
    per_day: 100,
    per_week: 600,
    per_month: 2000,
    per_year: 20000,
  };

  it('should use per_day rate for 1-6 day rentals', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-06-04');
    expect(result.rateUsed).toBe('per_day');
    expect(result.durationDays).toBe(3);
    expect(result.total).toBe(300); // 3 × 100
  });

  it('should use per_week rate for 7-27 day rentals', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-06-15');
    expect(result.rateUsed).toBe('per_week');
    expect(result.durationDays).toBe(14);
    expect(result.units).toBe(2); // ceil(14/7) = 2
    expect(result.total).toBe(1200); // 2 × 600
  });

  it('should use per_month rate for 28-364 day rentals', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-07-16');
    expect(result.rateUsed).toBe('per_month');
    expect(result.durationDays).toBe(45);
    expect(result.units).toBe(2); // ceil(45/30) = 2
    expect(result.total).toBe(4000); // 2 × 2000
  });

  it('should use per_year rate for 365+ day rentals', () => {
    const result = calculateRentalPrice(fullPricing, '2026-01-01', '2027-01-01');
    expect(result.rateUsed).toBe('per_year');
    expect(result.durationDays).toBe(365);
    expect(result.units).toBe(1);
    expect(result.total).toBe(20000);
  });

  it('should fall back to next available tier if preferred is null', () => {
    const partialPricing = {
      per_day: null,
      per_week: 600,
      per_month: null,
      per_year: null,
    };
    const result = calculateRentalPrice(partialPricing, '2026-06-01', '2026-06-04');
    expect(result.rateUsed).toBe('per_week');
    expect(result.total).toBe(600); // ceil(3/7) = 1 × 600
  });

  it('should return 0 total when no pricing is set', () => {
    const noPricing = {
      per_day: null,
      per_week: null,
      per_month: null,
      per_year: null,
    };
    const result = calculateRentalPrice(noPricing, '2026-06-01', '2026-06-04');
    expect(result.total).toBe(0);
  });

  it('should handle 1-day rental (same day return next day)', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-06-02');
    expect(result.durationDays).toBe(1);
    expect(result.total).toBe(100);
  });

  it('should handle exactly 7-day rental', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-06-08');
    expect(result.rateUsed).toBe('per_week');
    expect(result.durationDays).toBe(7);
    expect(result.units).toBe(1);
    expect(result.total).toBe(600);
  });

  it('should handle exactly 30-day rental', () => {
    const result = calculateRentalPrice(fullPricing, '2026-06-01', '2026-07-01');
    expect(result.rateUsed).toBe('per_month');
    expect(result.durationDays).toBe(30);
    expect(result.units).toBe(1);
    expect(result.total).toBe(2000);
  });

  it('should handle Date objects as inputs', () => {
    const result = calculateRentalPrice(
      fullPricing,
      new Date('2026-06-01'),
      new Date('2026-06-04')
    );
    expect(result.durationDays).toBe(3);
    expect(result.total).toBe(300);
  });
});

// ============================================================================
// 2. calculateSecurityDeposit
// ============================================================================

describe('calculateSecurityDeposit', () => {
  it('should calculate 20% of ₹10,000 = ₹2,000', () => {
    expect(calculateSecurityDeposit(10000)).toBe(2000);
  });

  it('should calculate 20% of ₹50,000 = ₹10,000', () => {
    expect(calculateSecurityDeposit(50000)).toBe(10000);
  });

  it('should support custom percentage', () => {
    expect(calculateSecurityDeposit(10000, 15)).toBe(1500);
  });

  it('should handle decimal product values', () => {
    expect(calculateSecurityDeposit(9999.99)).toBe(2000);
  });

  it('should return 0 for zero product value', () => {
    expect(calculateSecurityDeposit(0)).toBe(0);
  });

  it('should return 0 for negative product value', () => {
    expect(calculateSecurityDeposit(-1000)).toBe(0);
  });

  it('should return 0 for zero percentage', () => {
    expect(calculateSecurityDeposit(10000, 0)).toBe(0);
  });

  it('should handle 100% deposit', () => {
    expect(calculateSecurityDeposit(5000, 100)).toBe(5000);
  });
});

// ============================================================================
// 3. calculateLateFee
// ============================================================================

describe('calculateLateFee', () => {
  it('should calculate per_hour late fee correctly', () => {
    // 50 per hour, 3 hours overdue
    expect(calculateLateFee(50, 'per_hour', 3)).toBe(150);
  });

  it('should calculate per_6_hours late fee correctly', () => {
    // 200 per 6 hours, 13 hours overdue → ceil(13/6) = 3 units
    expect(calculateLateFee(200, 'per_6_hours', 13)).toBe(600);
  });

  it('should calculate per_day late fee correctly', () => {
    // 500 per day, 36 hours overdue → ceil(36/24) = 2 days
    expect(calculateLateFee(500, 'per_day', 36)).toBe(1000);
  });

  it('should ceil per_hour for fractional hours', () => {
    expect(calculateLateFee(100, 'per_hour', 2.5)).toBe(300); // ceil(2.5) = 3
  });

  it('should ceil per_6_hours correctly', () => {
    expect(calculateLateFee(200, 'per_6_hours', 7)).toBe(400); // ceil(7/6) = 2
  });

  it('should ceil per_day for 1 hour overdue', () => {
    expect(calculateLateFee(500, 'per_day', 1)).toBe(500); // ceil(1/24) = 1 day
  });

  it('should return 0 for zero hours overdue', () => {
    expect(calculateLateFee(100, 'per_hour', 0)).toBe(0);
  });

  it('should return 0 for negative hours', () => {
    expect(calculateLateFee(100, 'per_hour', -5)).toBe(0);
  });

  it('should return 0 for zero rate', () => {
    expect(calculateLateFee(0, 'per_hour', 10)).toBe(0);
  });

  it('should handle exactly 24 hours as 1 day', () => {
    expect(calculateLateFee(500, 'per_day', 24)).toBe(500);
  });

  it('should handle exactly 6 hours as 1 unit', () => {
    expect(calculateLateFee(200, 'per_6_hours', 6)).toBe(200);
  });
});

// ============================================================================
// 4. calculatePlatformFee
// ============================================================================

describe('calculatePlatformFee', () => {
  it('should calculate transaction percentage fee', () => {
    const config: FeeConfig = {
      activeModels: ['transaction_percentage'],
      transactionPct: 10,
      flatFeeAmount: 0,
      subscriptionAmount: 0,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.transactionFee).toBe(500);
    expect(result.flatFee).toBe(0);
    expect(result.subscriptionFee).toBe(0);
    expect(result.total).toBe(500);
  });

  it('should calculate flat fee', () => {
    const config: FeeConfig = {
      activeModels: ['flat_fee'],
      transactionPct: 0,
      flatFeeAmount: 99,
      subscriptionAmount: 0,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.flatFee).toBe(99);
    expect(result.total).toBe(99);
  });

  it('should calculate subscription fee', () => {
    const config: FeeConfig = {
      activeModels: ['subscription'],
      transactionPct: 0,
      flatFeeAmount: 0,
      subscriptionAmount: 499,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.subscriptionFee).toBe(499);
    expect(result.total).toBe(499);
  });

  it('should combine multiple active models (% + flat)', () => {
    const config: FeeConfig = {
      activeModels: ['transaction_percentage', 'flat_fee'],
      transactionPct: 10,
      flatFeeAmount: 50,
      subscriptionAmount: 0,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.transactionFee).toBe(500);
    expect(result.flatFee).toBe(50);
    expect(result.total).toBe(550);
  });

  it('should combine all 3 models simultaneously', () => {
    const config: FeeConfig = {
      activeModels: ['transaction_percentage', 'flat_fee', 'subscription'],
      transactionPct: 10,
      flatFeeAmount: 50,
      subscriptionAmount: 499,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.total).toBe(500 + 50 + 499);
  });

  it('should return 0 for no active models', () => {
    const config: FeeConfig = {
      activeModels: [],
      transactionPct: 10,
      flatFeeAmount: 50,
      subscriptionAmount: 499,
    };
    const result = calculatePlatformFee(5000, config);
    expect(result.total).toBe(0);
  });

  it('should handle zero rental value with transaction percentage', () => {
    const config: FeeConfig = {
      activeModels: ['transaction_percentage'],
      transactionPct: 10,
      flatFeeAmount: 0,
      subscriptionAmount: 0,
    };
    const result = calculatePlatformFee(0, config);
    expect(result.transactionFee).toBe(0);
    expect(result.total).toBe(0);
  });
});

// ============================================================================
// 5. calculatePayoutHoldPeriod
// ============================================================================

describe('calculatePayoutHoldPeriod', () => {
  it('should return 2 days for 1-day rental', () => {
    expect(calculatePayoutHoldPeriod(1)).toBe(2);
  });

  it('should return 2 days for 3-day rental', () => {
    expect(calculatePayoutHoldPeriod(3)).toBe(2);
  });

  it('should return 5 days for 4-day rental', () => {
    expect(calculatePayoutHoldPeriod(4)).toBe(5);
  });

  it('should return 5 days for 7-day rental', () => {
    expect(calculatePayoutHoldPeriod(7)).toBe(5);
  });

  it('should return 7 days for 8-day rental', () => {
    expect(calculatePayoutHoldPeriod(8)).toBe(7);
  });

  it('should return 7 days for 14-day rental', () => {
    expect(calculatePayoutHoldPeriod(14)).toBe(7);
  });

  it('should return 10 days for 15-day rental', () => {
    expect(calculatePayoutHoldPeriod(15)).toBe(10);
  });

  it('should return 10 days for 30-day rental', () => {
    expect(calculatePayoutHoldPeriod(30)).toBe(10);
  });

  it('should return 14 days for 31-day rental', () => {
    expect(calculatePayoutHoldPeriod(31)).toBe(14);
  });

  it('should return 14 days for 365-day rental', () => {
    expect(calculatePayoutHoldPeriod(365)).toBe(14);
  });

  it('should return 2 days for 0-day rental (edge case)', () => {
    expect(calculatePayoutHoldPeriod(0)).toBe(2);
  });

  it('should return 2 days for negative duration (edge case)', () => {
    expect(calculatePayoutHoldPeriod(-5)).toBe(2);
  });
});

// ============================================================================
// 6. calculatePayoutBreakdown
// ============================================================================

describe('calculatePayoutBreakdown', () => {
  it('should calculate basic payout: gross - platformFee = net', () => {
    const result = calculatePayoutBreakdown(5000, 500);
    expect(result.gross).toBe(5000);
    expect(result.platformFee).toBe(500);
    expect(result.deductions).toBe(0);
    expect(result.net).toBe(4500);
  });

  it('should include additional deductions', () => {
    const result = calculatePayoutBreakdown(5000, 500, 200);
    expect(result.net).toBe(4300); // 5000 - 500 - 200
  });

  it('should never return negative net', () => {
    const result = calculatePayoutBreakdown(100, 500, 200);
    expect(result.net).toBe(0);
  });

  it('should handle zero gross amount', () => {
    const result = calculatePayoutBreakdown(0, 0);
    expect(result.net).toBe(0);
  });

  it('should default deductions to 0', () => {
    const result = calculatePayoutBreakdown(5000, 500);
    expect(result.deductions).toBe(0);
  });

  it('should handle decimal amounts', () => {
    const result = calculatePayoutBreakdown(5000.50, 500.25, 100.10);
    expect(result.net).toBe(4400.15);
  });
});

// ============================================================================
// 7. determinePaymentPlan
// ============================================================================

describe('determinePaymentPlan', () => {
  it('should return upfront only for ≤7 days', () => {
    expect(determinePaymentPlan(1)).toEqual(['upfront']);
    expect(determinePaymentPlan(7)).toEqual(['upfront']);
  });

  it('should return upfront + weekly for 8-30 days', () => {
    expect(determinePaymentPlan(8)).toEqual(['upfront', 'weekly']);
    expect(determinePaymentPlan(15)).toEqual(['upfront', 'weekly']);
    expect(determinePaymentPlan(30)).toEqual(['upfront', 'weekly']);
  });

  it('should return upfront + monthly for >30 days', () => {
    expect(determinePaymentPlan(31)).toEqual(['upfront', 'monthly']);
    expect(determinePaymentPlan(90)).toEqual(['upfront', 'monthly']);
    expect(determinePaymentPlan(365)).toEqual(['upfront', 'monthly']);
  });
});

// ============================================================================
// 8. splitInstallments
// ============================================================================

describe('splitInstallments', () => {
  it('should return single installment for upfront plan', () => {
    const result = splitInstallments(3000, 'upfront', '2026-06-01', '2026-06-08');
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(3000);
    expect(result[0].installmentNumber).toBe(1);
    expect(result[0].dueDate).toBe('2026-06-01');
    expect(result[0].status).toBe('pending');
  });

  it('should split into weekly installments for 14-day rental', () => {
    const result = splitInstallments(1400, 'weekly', '2026-06-01', '2026-06-15');
    expect(result).toHaveLength(2); // ceil(14/7) = 2
    expect(result[0].amount).toBe(700);
    expect(result[1].amount).toBe(700);
    expect(result[0].dueDate).toBe('2026-06-01');
    expect(result[1].dueDate).toBe('2026-06-08');
  });

  it('should split into monthly installments for 60-day rental', () => {
    const result = splitInstallments(6000, 'monthly', '2026-06-01', '2026-07-31');
    expect(result).toHaveLength(2); // ceil(60/30) = 2
    expect(result[0].amount).toBe(3000);
    expect(result[1].amount).toBe(3000);
  });

  it('should handle uneven split by adding remainder to first installment', () => {
    const result = splitInstallments(1000, 'weekly', '2026-06-01', '2026-06-22');
    // 21 days → ceil(21/7) = 3 installments
    expect(result).toHaveLength(3);
    // 1000 / 3 = 333.33 base, remainder = 0.01
    const total = result.reduce((sum, inst) => sum + inst.amount, 0);
    expect(Math.round(total * 100) / 100).toBeCloseTo(1000, 1);
  });

  it('should set all installments to pending status', () => {
    const result = splitInstallments(2000, 'weekly', '2026-06-01', '2026-06-15');
    result.forEach((inst) => {
      expect(inst.status).toBe('pending');
    });
  });

  it('should number installments starting from 1', () => {
    const result = splitInstallments(3000, 'weekly', '2026-06-01', '2026-06-22');
    expect(result[0].installmentNumber).toBe(1);
    expect(result[1].installmentNumber).toBe(2);
    expect(result[2].installmentNumber).toBe(3);
  });

  it('should handle single-week rental with weekly plan', () => {
    const result = splitInstallments(500, 'weekly', '2026-06-01', '2026-06-08');
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(500);
  });
});

// ============================================================================
// 9. calculateTotalDue
// ============================================================================

describe('calculateTotalDue', () => {
  it('should sum rent + deposit + delivery fee', () => {
    expect(calculateTotalDue(3000, 2000, 150)).toBe(5150);
  });

  it('should handle zero delivery fee (self-pickup)', () => {
    expect(calculateTotalDue(3000, 2000, 0)).toBe(5000);
  });

  it('should default delivery fee to 0', () => {
    expect(calculateTotalDue(3000, 2000)).toBe(5000);
  });

  it('should handle decimal amounts', () => {
    expect(calculateTotalDue(2999.99, 2000.01, 149.99)).toBe(5149.99);
  });

  it('should handle zero rent (edge case)', () => {
    expect(calculateTotalDue(0, 2000, 150)).toBe(2150);
  });
});

// ============================================================================
// Integration: End-to-end calculation flow
// ============================================================================

describe('Integration — Full booking calculation flow', () => {
  it('should correctly calculate a complete 14-day booking', () => {
    // Product: ₹50,000 value, ₹600/week, late fee ₹500/day
    const pricing = {
      per_day: 100,
      per_week: 600,
      per_month: 2000,
      per_year: null,
    };

    // Step 1: Calculate rental price
    const rental = calculateRentalPrice(pricing, '2026-06-01', '2026-06-15');
    expect(rental.total).toBe(1200); // 2 weeks × ₹600
    expect(rental.rateUsed).toBe('per_week');

    // Step 2: Calculate security deposit
    const deposit = calculateSecurityDeposit(50000);
    expect(deposit).toBe(10000); // 20% of ₹50,000

    // Step 3: Calculate platform fee (10% transaction)
    const feeConfig: FeeConfig = {
      activeModels: ['transaction_percentage'],
      transactionPct: 10,
      flatFeeAmount: 0,
      subscriptionAmount: 0,
    };
    const platformFee = calculatePlatformFee(rental.total, feeConfig);
    expect(platformFee.total).toBe(120); // 10% of ₹1,200

    // Step 4: Calculate total due for renter
    const totalDue = calculateTotalDue(rental.total, deposit, 150);
    expect(totalDue).toBe(11350); // 1200 + 10000 + 150

    // Step 5: Determine payment plans available
    const plans = determinePaymentPlan(14);
    expect(plans).toEqual(['upfront', 'weekly']);

    // Step 6: Split into weekly installments
    const installments = splitInstallments(
      rental.total,
      'weekly',
      '2026-06-01',
      '2026-06-15'
    );
    expect(installments).toHaveLength(2);

    // Step 7: Calculate payout hold period
    const holdDays = calculatePayoutHoldPeriod(14);
    expect(holdDays).toBe(7);

    // Step 8: Calculate payout breakdown for lister
    const payout = calculatePayoutBreakdown(rental.total, platformFee.total);
    expect(payout.net).toBe(1080); // 1200 - 120
  });
});
