export type BookingStatus = "confirmed" | "active" | "returned" | "cancelled" | "disputed";

export interface MockBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  depositAmount: number;
  platformFee: number;
  status: BookingStatus;
  createdAt: string;
  pickupAddress: string;
  returnAddress: string;
  hasPickupPhotos: boolean;
  hasReturnPhotos: boolean;
}

function pickBookingStatus(i: number): BookingStatus {
  if (i < 12) return "confirmed";
  if (i < 22) return "active";
  if (i < 32) return "returned";
  if (i < 36) return "cancelled";
  return "disputed";
}

const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

export const mockBookings: MockBooking[] = Array.from({ length: 40 }, (_, i) => {
  const start = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000);
  const pricePerDay = Math.floor(Math.random() * 1500) + 300;
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return {
    id: `bkg_${String(i + 1).padStart(4, "0")}`,
    listingId: `lst_${String((i % 30) + 1).padStart(3, "0")}`,
    listingTitle: ["Sony DSLR Camera", "MacBook Pro 16\"", "Mountain Bike", "Electric Drill", "PS5 Console"][i % 5],
    renterId: `usr_${String((i % 25) + 1).padStart(3, "0")}`,
    renterName: `Renter ${i + 1}`,
    ownerId: `usr_${String((i % 20) + 26).padStart(3, "0")}`,
    ownerName: `Owner ${i + 1}`,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    totalAmount: pricePerDay * days,
    depositAmount: pricePerDay * days * 0.2,
    platformFee: pricePerDay * days * 0.1,
    status: pickBookingStatus(i),
    createdAt: new Date(start.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pickupAddress: `${Math.floor(Math.random() * 999) + 1} Main Street, ${cities[i % cities.length]}`,
    returnAddress: `${Math.floor(Math.random() * 999) + 1} Return Lane, ${cities[i % cities.length]}`,
    hasPickupPhotos: i > 10,
    hasReturnPhotos: i > 25,
  };
});
