import { mockDisputes, mockBookings, mockConditionPhotos, mockProducts, mockUsers, mockBookingPayments } from "../seed";
import { Dispute, DisputeStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const disputeInterceptor = {
  getDisputes: async (filters?: { status?: DisputeStatus | "all" }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockDisputes];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((d) => d.status === filters.status);
    }
    
    const mapped = result.map(d => {
      const booking = mockBookings.find(b => b.id === d.booking_id);
      const product = mockProducts.find(p => p.id === booking?.product_id);
      const renter = mockUsers.find(u => u.id === booking?.renter_id);
      const owner = mockUsers.find(u => u.id === booking?.lister_id);
      const payment = mockBookingPayments.find(p => p.booking_id === d.booking_id);
      const photos = mockConditionPhotos.filter(p => p.booking_id === d.booking_id);

      return {
        ...d,
        bookingId: d.booking_id,
        listingTitle: product?.title || "Unknown",
        renterName: renter?.full_name || "Unknown",
        ownerName: owner?.full_name || "Unknown",
        renterClaim: "Item was returned in perfect condition, owner is overcharging.",
        ownerClaim: d.claim_notes,
        depositAmount: payment?.deposit_amount || 0,
        openedAt: d.created_at,
        pickupPhotos: photos.filter(p => p.type === 'pickup').map(p => ({ url: p.url, timestamp: p.captured_at })),
        returnPhotos: photos.filter(p => p.type === 'return').map(p => ({ url: p.url, timestamp: p.captured_at })),
        verdict: d.verdict,
        verdictNotes: d.resolution_notes,
        resolvedAt: d.resolved_at,
      };
    });

    return { data: mapped, total: mapped.length };
  },

  ruleDispute: async (disputeId: string, verdict: string, notes: string, adminId: string): Promise<void> => {
    await delay(500);
    const dispute = mockDisputes.find((d) => d.id === disputeId);
    if (!dispute) throw new Error("Dispute not found");
    dispute.status = "resolved";
    dispute.verdict = verdict;
    dispute.resolution_notes = notes;
    dispute.resolved_at = new Date().toISOString();
    dispute.admin_id = adminId;
  },
};
