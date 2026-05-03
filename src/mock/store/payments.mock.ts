export type PaymentStatus = "completed" | "refunded" | "failed" | "flagged";

export interface MockPayment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  platformFee: number;
  depositAmount: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
  refundedAt?: string;
  refundReason?: string;
  flagReason?: string;
  transactionRef: string;
}

function pickPaymentStatus(i: number): PaymentStatus {
  if (i < 42) return "completed";
  if (i < 51) return "refunded";
  if (i < 57) return "failed";
  return "flagged";
}

export const mockPayments: MockPayment[] = Array.from({ length: 60 }, (_, i) => ({
  id: `pay_${String(i + 1).padStart(4, "0")}`,
  bookingId: `bkg_${String((i % 40) + 1).padStart(4, "0")}`,
  userId: `usr_${String((i % 50) + 1).padStart(3, "0")}`,
  userName: `User ${i + 1}`,
  amount: Math.floor(Math.random() * 15000) + 500,
  platformFee: Math.floor(Math.random() * 1500) + 50,
  depositAmount: Math.floor(Math.random() * 5000) + 1000,
  status: pickPaymentStatus(i),
  method: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"][i % 5],
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  refundedAt: pickPaymentStatus(i) === "refunded" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  refundReason: pickPaymentStatus(i) === "refunded" ? "Booking cancelled by owner" : undefined,
  flagReason: pickPaymentStatus(i) === "flagged" ? "Suspicious transaction pattern detected" : undefined,
  transactionRef: `TXN${Date.now()}${i}`,
}));
