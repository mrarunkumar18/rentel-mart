import { mockBookings, mockUsers, mockProducts, mockBookingPayments } from "../seed";
import { Booking, BookingStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingInterceptor = {
  getBookings: async (filters?: { status?: BookingStatus | "all"; search?: string; page?: number }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockBookings];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((b) => b.status === filters.status);
    }
    
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((b) => {
        const product = mockProducts.find(p => p.id === b.product_id);
        const renter = mockUsers.find(u => u.id === b.renter_id);
        return (
          product?.title.toLowerCase().includes(q) ||
          renter?.full_name.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        );
      });
    }
    
    const page = filters?.page || 1;
    const pageSize = 10;
    
    const mappedResult = result.slice((page - 1) * pageSize, page * pageSize).map(b => {
      const product = mockProducts.find(p => p.id === b.product_id);
      const renter = mockUsers.find(u => u.id === b.renter_id);
      const payment = mockBookingPayments.find(p => p.booking_id === b.id);

      return {
        ...b,
        listingTitle: product?.title || "Unknown Product",
        renterName: renter?.full_name || "Unknown Renter",
        startDate: b.start_date,
        endDate: b.end_date,
        totalAmount: payment?.rent_total || 0,
      };
    });

    return { data: mappedResult, total: result.length };
  },

  cancelBooking: async (bookingId: string, reason: string): Promise<void> => {
    await delay(400);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = "cancelled";
  },
};
