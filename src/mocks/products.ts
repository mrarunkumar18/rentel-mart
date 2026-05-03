// PHASE4-SWAP: Replace with real API calls

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  images: { url: string; isPrimary: boolean }[];
  originalValue: number;
  status: 'active' | 'rented' | 'inactive';
  pricing: {
    perDay: number;
    perWeek: number;
    perMonth: number;
    deposit: number;
  };
  lister: {
    id: string;
    name: string;
    rating: number;
    totalRentals: number;
    avatar?: string;
  };
  location: string;
  availability: {
    startDate: string;
    endDate?: string;
  };
  tags: string[];
}

export const mockProducts: Product[] = [
  {
    id: 'PROD001',
    title: 'Canon EOS R5 Mirrorless Camera',
    description: 'Professional grade mirrorless camera with 45MP sensor and 8K video recording. Perfect for weddings and high-end photography.',
    category: 'Electronics',
    subCategory: 'Cameras',
    condition: 'like-new',
    images: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', isPrimary: false },
    ],
    originalValue: 340000,
    status: 'active',
    pricing: {
      perDay: 2500,
      perWeek: 15000,
      perMonth: 50000,
      deposit: 20000,
    },
    lister: {
      id: 'USR002',
      name: 'Rahul Sharma',
      rating: 4.8,
      totalRentals: 42,
    },
    location: 'Mumbai, Maharashtra',
    availability: {
      startDate: '2025-01-01',
    },
    tags: ['photography', 'camera', 'professional'],
  },
  {
    id: 'PROD002',
    title: 'Apple MacBook Pro M3 Max (16-inch)',
    description: 'The most powerful MacBook yet. 36GB RAM, 1TB SSD. Ideal for video editing and developers.',
    category: 'Electronics',
    subCategory: 'Laptops',
    condition: 'new',
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', isPrimary: true },
    ],
    originalValue: 350000,
    status: 'active',
    pricing: {
      perDay: 3000,
      perWeek: 18000,
      perMonth: 60000,
      deposit: 30000,
    },
    lister: {
      id: 'USR005',
      name: 'Devraj Singh',
      rating: 4.9,
      totalRentals: 15,
    },
    location: 'Bangalore, Karnataka',
    availability: {
      startDate: '2025-02-10',
    },
    tags: ['laptop', 'apple', 'macbook', 'work'],
  },
  {
    id: 'PROD003',
    title: 'DJI Mavic 3 Pro Drone',
    description: 'Triple camera system, 43 min flight time. Capture stunning aerial footage with ease.',
    category: 'Electronics',
    subCategory: 'Drones',
    condition: 'good',
    images: [
      { url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800', isPrimary: true },
    ],
    originalValue: 180000,
    status: 'active',
    pricing: {
      perDay: 1800,
      perWeek: 10000,
      perMonth: 35000,
      deposit: 15000,
    },
    lister: {
      id: 'USR002',
      name: 'Rahul Sharma',
      rating: 4.8,
      totalRentals: 42,
    },
    location: 'Mumbai, Maharashtra',
    availability: {
      startDate: '2025-01-15',
    },
    tags: ['drone', 'dji', 'video'],
  },
  {
    id: 'PROD004',
    title: 'Quechua Arpenaz 4.1 Camping Tent',
    description: 'Spacious 4-person camping tent with 1 bedroom and a large living area. Waterproof and wind resistant.',
    category: 'Outdoor',
    subCategory: 'Camping',
    condition: 'good',
    images: [
      { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', isPrimary: true },
    ],
    originalValue: 12000,
    status: 'active',
    pricing: {
      perDay: 500,
      perWeek: 3000,
      perMonth: 10000,
      deposit: 2000,
    },
    lister: {
      id: 'USR001',
      name: 'Priya Patel',
      rating: 4.5,
      totalRentals: 8,
    },
    location: 'Pune, Maharashtra',
    availability: {
      startDate: '2024-12-01',
    },
    tags: ['camping', 'tent', 'adventure'],
  },
  {
    id: 'PROD005',
    title: 'Bosch Professional Power Drill GSB 18V-55',
    description: 'Powerful 18V cordless drill with hammer function. Brushless motor for longer life.',
    category: 'Home & Garden',
    subCategory: 'Tools',
    condition: 'fair',
    images: [
      { url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', isPrimary: true },
    ],
    originalValue: 15000,
    status: 'active',
    pricing: {
      perDay: 300,
      perWeek: 1800,
      perMonth: 5000,
      deposit: 2000,
    },
    lister: {
      id: 'USR005',
      name: 'Devraj Singh',
      rating: 4.9,
      totalRentals: 15,
    },
    location: 'Bangalore, Karnataka',
    availability: {
      startDate: '2025-01-20',
    },
    tags: ['tools', 'diy', 'drill'],
  },
];

export const mockCategories = [
  { id: 'CAT001', name: 'Electronics', icon: 'monitor', subCategories: ['Cameras', 'Laptops', 'Drones', 'Audio'] },
  { id: 'CAT002', name: 'Outdoor', icon: 'sun', subCategories: ['Camping', 'Hiking', 'Cycling'] },
  { id: 'CAT003', name: 'Home & Garden', icon: 'home', subCategories: ['Tools', 'Appliances', 'Furniture'] },
  { id: 'CAT004', name: 'Sports', icon: 'activity', subCategories: ['Fitness', 'Indoor Games'] },
];
