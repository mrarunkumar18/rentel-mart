import { mockBookingPayments, mockBookings, mockUsers, mockPayouts } from "../seed";
import { PaymentStatus } from "@/types/admin";
import { PayoutStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentInterceptor = {
  getPayments: async (filters?: { status?: PaymentStatus | "all"; search?: string; page?: number }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    // In a real app, this would query a 'transactions' table. 
    // Here we derive it from booking_payments for simulation.
    let result = mockBookingPayments.map(p => {
      const booking = mockBookings.find(b => b.id === p.booking_id);
      const user = mockUsers.find(u => u.id === booking?.renter_id);
      return {
        id: p.id,
        transactionRef: `TRX-${p.id.split('-')[0].toUpperCase()}`,
        userName: user?.full_name || "System",
        amount: p.rent_total + p.deposit_amount + p.delivery_fee,
        platformFee: p.platform_fee,
        method: "UPI / Card",
        status: "completed" as PaymentStatus,
        createdAt: p.created_at,
      };
    });
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.userName.toLowerCase().includes(q) || p.transactionRef.toLowerCase().includes(q));
    }
    
    const page = filters?.page || 1;
    const pageSize = 15;
    
    return { 
      data: result.slice((page - 1) * pageSize, page * pageSize), 
      total: result.length 
    };
  },

  processRefund: async (paymentId: string, reason: string): Promise<void> => {
    await delay(500);
    // Simulate updating status to refunded
    console.log(`Refunding payment ${paymentId} for reason: ${reason}`);
  },

  flagPayment: async (paymentId: string, reason: string): Promise<void> => {
    await delay(300);
    console.log(`Flagging payment ${paymentId}: ${reason}`);
  },

  getPayouts: async (filters?: { status?: PayoutStatus | "all" }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockPayouts];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    
    const mapped = result.map(p => {
      const user = mockUsers.find(u => u.id === p.lister_id);
      return {
        ...p,
        listerName: user?.full_name || "Unknown",
        listerEmail: user?.email || "Unknown",
      };
    });

    return { data: mapped, total: result.length };
  },

  processPayout: async (payoutId: string): Promise<void> => {
    await delay(600);
    const payout = mockPayouts.find((p) => p.id === payoutId);
    if (!payout) throw new Error("Payout not found");
    payout.status = "released"; // Match PayoutStatus enum
  },
};
