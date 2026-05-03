export type DisputeStatus = "open" | "ruled_renter" | "ruled_owner" | "escalated";
export type DisputeVerdict = "favor_renter" | "favor_owner" | "escalate";

export interface DisputePhoto {
  url: string;
  timestamp: string;
  gps?: string;
  type: "pickup" | "return";
}

export interface MockDispute {
  id: string;
  bookingId: string;
  listingTitle: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  status: DisputeStatus;
  renterClaim: string;
  ownerClaim: string;
  pickupPhotos: DisputePhoto[];
  returnPhotos: DisputePhoto[];
  openedAt: string;
  resolvedAt?: string;
  verdict?: DisputeVerdict;
  verdictNotes?: string;
  adminId?: string;
  depositAmount: number;
  deductionAmount?: number;
}

function pickDisputeStatus(i: number): DisputeStatus {
  if (i < 6) return "open";
  if (i < 10) return "ruled_renter";
  if (i < 13) return "ruled_owner";
  return "escalated";
}

const renterClaims = [
  "The damage was already there before I rented it.",
  "I returned the item in the same condition as received.",
  "The photos from pickup already show the scratch.",
  "Owner is falsely claiming damage for the deposit.",
  "I have evidence the item was defective before rental.",
];

const ownerClaims = [
  "The item was in perfect condition at pickup. The renter caused the damage.",
  "There is a clear scratch that was not there before.",
  "Photos show the damage happened during rental period.",
  "The return condition is significantly worse than pickup.",
  "Multiple parts are damaged. This is not normal wear and tear.",
];

export const mockDisputes: MockDispute[] = Array.from({ length: 15 }, (_, i) => ({
  id: `dis_${String(i + 1).padStart(4, "0")}`,
  bookingId: `bkg_${String(36 + (i % 4)).padStart(4, "0")}`,
  listingTitle: ["Sony DSLR Camera", "MacBook Pro 16\"", "Mountain Bike", "Electric Drill", "PS5 Console"][i % 5],
  renterId: `usr_${String((i % 25) + 1).padStart(3, "0")}`,
  renterName: `Renter ${i + 1}`,
  ownerId: `usr_${String((i % 20) + 26).padStart(3, "0")}`,
  ownerName: `Owner ${i + 1}`,
  status: pickDisputeStatus(i),
  renterClaim: renterClaims[i % renterClaims.length],
  ownerClaim: ownerClaims[i % ownerClaims.length],
  pickupPhotos: i % 3 !== 0 ? [
    { url: `/mock/dispute-pickup-${(i % 3) + 1}.jpg`, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), gps: "19.0760° N, 72.8777° E", type: "pickup" },
    { url: `/mock/dispute-pickup-${(i % 3) + 2}.jpg`, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString(), type: "pickup" },
  ] : [],
  returnPhotos: i % 4 !== 0 ? [
    { url: `/mock/dispute-return-${(i % 3) + 1}.jpg`, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), gps: "18.5204° N, 73.8567° E", type: "return" },
    { url: `/mock/dispute-return-${(i % 3) + 2}.jpg`, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45000).toISOString(), type: "return" },
  ] : [],
  openedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  resolvedAt: pickDisputeStatus(i) !== "open" ? new Date(Date.now() - (i % 3) * 24 * 60 * 60 * 1000).toISOString() : undefined,
  verdict: pickDisputeStatus(i) === "ruled_renter" ? "favor_renter" : pickDisputeStatus(i) === "ruled_owner" ? "favor_owner" : pickDisputeStatus(i) === "escalated" ? "escalate" : undefined,
  verdictNotes: pickDisputeStatus(i) !== "open" ? "Based on photographic evidence, the ruling was made in favor of the indicated party." : undefined,
  adminId: pickDisputeStatus(i) !== "open" ? "adm_001" : undefined,
  depositAmount: (i + 1) * 2000,
  deductionAmount: pickDisputeStatus(i) === "ruled_owner" ? (i + 1) * 1000 : 0,
}));
