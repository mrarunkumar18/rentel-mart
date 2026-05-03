const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockListings, MockListing } from "../store/listings.mock";

export const listingInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/listings ──
  getListings: async (filters?: { status?: string; search?: string; page?: number }): Promise<{ data: MockListing[]; total: number }> => {
    await delay(300);
    let result = [...mockListings];
    if (filters?.status && filters.status !== "all") {
      result = result.filter((l) => l.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.ownerName.toLowerCase().includes(q));
    }
    const page = filters?.page || 1;
    const pageSize = 10;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/listings/:id/approve ──
  approveListing: async (listingId: string): Promise<void> => {
    await delay(400);
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "approved";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/listings/:id/reject ──
  rejectListing: async (listingId: string, reason: string): Promise<void> => {
    await delay(400);
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "rejected";
    listing.rejectionReason = reason;
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/listings/:id/flag ──
  flagListing: async (listingId: string, reason: string): Promise<void> => {
    await delay(350);
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "flagged";
    listing.flagReason = reason;
  },

  // ── SWAP POINT: replace with → DELETE /api/v1/admin/listings/:id ──
  removeListing: async (listingId: string): Promise<void> => {
    await delay(500);
    const idx = mockListings.findIndex((l) => l.id === listingId);
    if (idx === -1) throw new Error("Listing not found");
    mockListings.splice(idx, 1);
  },
};
