export type ContentType = "listing_photo" | "review" | "profile_photo" | "listing_description";
export type ContentStatus = "pending" | "approved" | "removed";

export interface MockContent {
  id: string;
  type: ContentType;
  status: ContentStatus;
  reportedBy: string;
  reportReason: string;
  contentUrl?: string;
  contentText?: string;
  ownerId: string;
  ownerName: string;
  listingId?: string;
  listingTitle?: string;
  reportedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

export const mockContent: MockContent[] = Array.from({ length: 25 }, (_, i) => ({
  id: `cnt_${String(i + 1).padStart(3, "0")}`,
  type: (["listing_photo", "review", "profile_photo", "listing_description"] as ContentType[])[i % 4],
  status: i < 12 ? "pending" : i < 18 ? "approved" : "removed",
  reportedBy: `usr_${String((i % 50) + 1).padStart(3, "0")}`,
  reportReason: ["Inappropriate", "Spam", "Policy Violation"][i % 3],
  contentUrl: i % 2 === 0 ? `https://storage.rentify.com/mock-content-${(i % 5) + 1}.jpg` : undefined,
  contentText: i % 2 !== 0 ? `Flagged text for item ${i + 1}` : undefined,
  ownerId: `usr_${String((i % 40) + 1).padStart(3, "0")}`,
  ownerName: `User ${i + 1}`,
  reportedAt: new Date(Date.now() - i * 21600000).toISOString(),
}));
