import { mockProducts, mockUsers, mockProductPricing } from "../seed";
import { Product, ProductStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const listingInterceptor = {
  getListings: async (filters?: { status?: ProductStatus | "all"; search?: string; page?: number }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockProducts];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((l) => l.status === filters.status);
    }
    
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q));
    }
    
    const page = filters?.page || 1;
    const pageSize = 10;
    
    const mappedResult = result.slice((page - 1) * pageSize, page * pageSize).map(p => {
      const owner = mockUsers.find(u => u.id === p.lister_id);
      const pricing = mockProductPricing.find(pr => pr.product_id === p.id);
      return {
        ...p,
        ownerName: owner?.full_name || "Unknown",
        pricePerDay: pricing?.per_day || 0,
        photos: [ `https://storage.rentify.com/product-images/${p.id}/front.jpg` ],
        location: owner?.city || "Unknown",
      };
    });

    return { data: mappedResult, total: result.length };
  },

  approveListing: async (listingId: string): Promise<void> => {
    await delay(400);
    const listing = mockProducts.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "active";
  },

  rejectListing: async (listingId: string, reason: string): Promise<void> => {
    await delay(400);
    const listing = mockProducts.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "rejected";
  },

  flagListing: async (listingId: string, reason: string): Promise<void> => {
    await delay(350);
    const listing = mockProducts.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found");
    listing.status = "flagged";
  },

  removeListing: async (listingId: string): Promise<void> => {
    await delay(500);
    const idx = mockProducts.findIndex((l) => l.id === listingId);
    if (idx === -1) throw new Error("Listing not found");
    mockProducts.splice(idx, 1);
  },
};
