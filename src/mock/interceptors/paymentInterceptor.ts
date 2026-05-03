const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockPayments, MockPayment } from "../store/payments.mock";

export const paymentInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/payments ──
  getPayments: async (filters?: { status?: string; search?: string; page?: number }): Promise<{ data: MockPayment[]; total: number }> => {
    await delay(300);
    let result = [...mockPayments];
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.userName.toLowerCase().includes(q) || p.transactionRef.toLowerCase().includes(q));
    }
    const page = filters?.page || 1;
    const pageSize = 15;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },

  // ── SWAP POINT: replace with → POST /api/v1/admin/payments/:id/refund ──
  processRefund: async (paymentId: string, reason: string): Promise<void> => {
    await delay(600);
    const payment = mockPayments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Payment not found");
    if (payment.status !== "completed") throw new Error("Only completed payments can be refunded");
    payment.status = "refunded";
    payment.refundedAt = new Date().toISOString();
    payment.refundReason = reason;
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/payments/:id/flag ──
  flagPayment: async (paymentId: string, reason: string): Promise<void> => {
    await delay(400);
    const payment = mockPayments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Payment not found");
    payment.status = "flagged";
    payment.flagReason = reason;
  },
};
