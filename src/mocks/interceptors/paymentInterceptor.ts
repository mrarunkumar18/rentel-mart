import { mockPayouts, mockUsers } from "../seed";
import { PayoutStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentInterceptor = {
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
    payout.status = "paid";
  },
};
