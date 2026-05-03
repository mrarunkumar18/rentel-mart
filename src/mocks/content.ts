export interface MockContent {
  id: string;
  type: string;
  status: string;
  reportedBy: string;
  reportReason: string;
  ownerName: string;
  reportedAt: string;
  contentUrl?: string;
  contentText?: string;
}

export const mockContent: MockContent[] = [
  {
    id: "cnt_001",
    type: "listing_photo",
    status: "pending",
    reportedBy: "usr_001",
    reportReason: "Inappropriate",
    ownerName: "John Doe",
    reportedAt: new Date().toISOString(),
    contentUrl: "https://example.com/photo.jpg",
  }
];
