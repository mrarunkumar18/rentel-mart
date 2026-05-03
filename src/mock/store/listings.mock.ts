export type ListingStatus = "approved" | "pending" | "rejected" | "flagged";

export interface MockListing {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerId: string;
  ownerName: string;
  pricePerDay: number;
  depositAmount: number;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  flagReason?: string;
  photos: string[];
  location: string;
  rating: number;
  reviewCount: number;
}

const categories = ["Electronics", "Furniture", "Sports", "Tools", "Vehicles", "Appliances", "Books", "Clothing"];
const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

function pickListingStatus(i: number): ListingStatus {
  if (i < 15) return "approved";
  if (i < 22) return "pending";
  if (i < 26) return "rejected";
  return "flagged";
}

export const mockListings: MockListing[] = Array.from({ length: 30 }, (_, i) => ({
  id: `lst_${String(i + 1).padStart(3, "0")}`,
  title: [
    "Sony DSLR Camera", "MacBook Pro 16\"", "Mountain Bike", "Electric Drill Set",
    "PS5 Console", "Nikon Mirrorless", "Gaming Chair", "DJI Drone",
    "Pressure Washer", "Air Compressor", "Standing Desk", "Espresso Machine",
    "Camping Tent (6-Person)", "Kayak", "Road Bike", "Power Tools Kit",
    "Smart TV 65\"", "Projector 4K", "VR Headset", "Telescope",
    "Guitar", "Piano Keyboard", "DJ Controller", "Yoga Mat Set",
    "Basketball Hoop", "Treadmill", "Elliptical Machine", "Rowing Machine",
    "Blender (Industrial)", "Sewing Machine",
  ][i],
  description: `High-quality rental item. Well-maintained and ready to use. ${i % 2 === 0 ? "Pickup available." : "Delivery can be arranged."}`,
  category: categories[i % categories.length],
  ownerId: `usr_${String((i % 20) + 1).padStart(3, "0")}`,
  ownerName: `Owner ${i + 1}`,
  pricePerDay: [500, 1200, 800, 300, 1500, 900, 400, 2000, 250, 350, 600, 450, 700, 550, 1100, 380, 950, 1300, 750, 850, 200, 300, 600, 150, 400, 700, 800, 900, 350, 450][i],
  depositAmount: [5000, 12000, 8000, 3000, 15000, 9000, 4000, 20000, 2500, 3500, 6000, 4500, 7000, 5500, 11000, 3800, 9500, 13000, 7500, 8500, 2000, 3000, 6000, 1500, 4000, 7000, 8000, 9000, 3500, 4500][i],
  status: pickListingStatus(i),
  createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  rejectionReason: pickListingStatus(i) === "rejected" ? "Photos do not meet quality standards" : undefined,
  flagReason: pickListingStatus(i) === "flagged" ? "Reported by multiple users" : undefined,
  photos: [`/mock/listing-${(i % 5) + 1}.jpg`],
  location: locations[i % locations.length],
  rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
  reviewCount: Math.floor(Math.random() * 50),
}));
