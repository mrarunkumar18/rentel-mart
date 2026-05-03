import { Product, mockProducts } from './products';

export interface ListerStats {
  totalEarnings: number;
  activeListings: number;
  pendingRequests: number;
  totalRentals: number;
}

export const mockListerStats: ListerStats = {
  totalEarnings: 125400,
  activeListings: 5,
  pendingRequests: 3,
  totalRentals: 48,
};

export const mockListerListings: Product[] = [
  { ...mockProducts[0], status: 'active' },
  { ...mockProducts[2], status: 'active' },
  {
    id: 'PROD-MINE-01',
    title: 'Sony Alpha a7 III with 28-70mm Lens',
    description: 'Full-frame mirrorless camera. Excellent for low-light photography.',
    category: 'Electronics',
    subCategory: 'Cameras',
    condition: 'like-new',
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', isPrimary: true }],
    originalValue: 180000,
    status: 'rented',
    pricing: { perDay: 1800, perWeek: 10000, perMonth: 35000, deposit: 10000 },
    lister: { id: 'USR001', name: 'Priya Patel', rating: 4.5, totalRentals: 8 },
    location: 'Pune, Maharashtra',
    availability: { startDate: '2025-01-01' },
    tags: ['camera', 'sony', 'photography'],
  }
];

export interface BookingRequest {
  id: string;
  productId: string;
  productTitle: string;
  renterName: string;
  renterRating: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export const mockBookingRequests: BookingRequest[] = [
  {
    id: 'REQ-101',
    productId: 'PROD001',
    productTitle: 'Canon EOS R5 Mirrorless Camera',
    renterName: 'Amit Kumar',
    renterRating: 4.9,
    startDate: '2025-04-01',
    endDate: '2025-04-05',
    totalPrice: 10000,
    status: 'pending',
  },
  {
    id: 'REQ-102',
    productId: 'PROD-MINE-01',
    productTitle: 'Sony Alpha a7 III',
    renterName: 'Suresh Raina',
    renterRating: 4.7,
    startDate: '2025-04-10',
    endDate: '2025-04-12',
    totalPrice: 3600,
    status: 'pending',
  }
];
