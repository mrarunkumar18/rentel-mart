const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockBookings, MockBooking } from "../store/bookings.mock";

export const bookingInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/bookings ──
  getBookings: async (filters?: { status?: string; search?: string; page?: number }): Promise<{ data: MockBooking[]; total: number }> => {
    await delay(300);
    let result = [...mockBookings];
    if (filters?.status && filters.status !== "all") {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((b) => b.listingTitle.toLowerCase().includes(q) || b.renterName.toLowerCase().includes(q));
    }
    const page = filters?.page || 1;
    const pageSize = 10;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/bookings/:id/cancel ──
  cancelBooking: async (bookingId: string, reason: string): Promise<void> => {
    await delay(400);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = "cancelled";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/bookings/:id/override ──
  overrideBooking: async (bookingId: string, newStatus: MockBooking["status"]): Promise<void> => {
    await delay(450);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    booking.status = newStatus;
  },
};
