import { mockPayouts, mockUsers } from "../seed";
import { Payout, PayoutStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentInterceptor = {
  getPayouts: async (filters?: { status?: PayoutStatus | "all" }): Promise<any[]> => {
    await delay(300);
    let result = [...mockPayouts];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    
    return result.map(p => {
      const lister = mockUsers.find(u => u.id === p.lister_id);
      return {
        ...p,
        listerName: lister?.full_name || "Unknown",
        listerEmail: lister?.email || "Unknown",
      };
    });
  },

  processRefund: async (bookingId: string, amount: number): Promise<void> => {
    await delay(600);
    // In a real app, this would create a refund record
  },

  flagFraud: async (payoutId: string): Promise<void> => {
    await delay(400);
    const payout = mockPayouts.find(p => p.id === payoutId);
    if (payout) payout.status = 'blocked';
  },
};
