import { mockBookings, mockProducts, mockUsers } from "../seed";
import { Booking, BookingStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingInterceptor = {
  getBookings: async (filters?: { status?: BookingStatus | "all"; search?: string; page?: number }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockBookings];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((b) => b.status === filters.status);
    }
    
    const page = filters?.page || 1;
    const pageSize = 10;
    
    const mapped = result.slice((page - 1) * pageSize, page * pageSize).map(b => {
      const product = mockProducts.find(p => p.id === b.product_id);
      const renter = mockUsers.find(u => u.id === b.renter_id);
      return {
        ...b,
        productTitle: product?.title || "Unknown",
        renterName: renter?.full_name || "Unknown",
      };
    });

    return { data: mapped, total: result.length };
  },

  cancelBooking: async (bookingId: string, reason: string): Promise<void> => {
    await delay(400);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = "cancelled";
  },
};
