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

const reportReasons = [
  "Inappropriate content",
  "Misleading information",
  "Spam or advertisement",
  "Violates rental policy",
  "Offensive language",
];

function pickContentStatus(i: number): ContentStatus {
  if (i < 12) return "pending";
  if (i < 18) return "approved";
  return "removed";
}

export const mockContent: MockContent[] = Array.from({ length: 25 }, (_, i) => ({
  id: `cnt_${String(i + 1).padStart(3, "0")}`,
  type: (["listing_photo", "review", "profile_photo", "listing_description"] as ContentType[])[i % 4],
  status: pickContentStatus(i),
  reportedBy: `usr_${String((i % 50) + 1).padStart(3, "0")}`,
  reportReason: reportReasons[i % reportReasons.length],
  contentUrl: i % 2 === 0 ? `/mock/content-${(i % 5) + 1}.jpg` : undefined,
  contentText: i % 2 !== 0 ? `This is flagged content #${i + 1}. User submitted text that was reported.` : undefined,
  ownerId: `usr_${String((i % 40) + 1).padStart(3, "0")}`,
  ownerName: `User ${i + 1}`,
  listingId: i % 3 !== 0 ? `lst_${String((i % 30) + 1).padStart(3, "0")}` : undefined,
  listingTitle: i % 3 !== 0 ? `Listing ${(i % 30) + 1}` : undefined,
  reportedAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
  moderatedAt: pickContentStatus(i) !== "pending" ? new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString() : undefined,
  moderatedBy: pickContentStatus(i) !== "pending" ? "adm_004" : undefined,
}));
