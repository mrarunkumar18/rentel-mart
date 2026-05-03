// PHASE4-SWAP: Replace with real API calls

import { seedData } from "./seed";
import { Product as DBProduct } from "@/types/database";

// Keep UI shape for compatibility
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

export const mockProducts: Product[] = seedData.products.map(p => {
  const pricing = seedData.productPricing.find(pr => pr.product_id === p.id);
  const images = seedData.productImages.filter(im => im.product_id === p.id);
  const lister = seedData.users.find(u => u.id === p.lister_id);

  return {
    id: p.id,
    title: p.title,
    description: p.description || "",
    category: p.category,
    condition: p.condition as any,
    images: images.map(i => ({ url: i.url, isPrimary: i.is_primary })),
    originalValue: p.original_value,
    status: p.status === 'active' ? 'active' : 'inactive',
    pricing: {
      perDay: pricing?.per_day || 0,
      perWeek: pricing?.per_week || 0,
      perMonth: pricing?.per_month || 0,
      deposit: Math.round(p.original_value * 0.2),
    },
    lister: {
      id: lister?.id || "",
      name: lister?.full_name || "",
      rating: 4.5,
      totalRentals: 10,
    },
    location: lister?.city || "Unknown",
    availability: {
      startDate: '2025-01-01',
    },
    tags: [],
  };
});

export const mockCategories = [
  { id: 'CAT001', name: 'Electronics', icon: 'monitor', subCategories: ['Cameras', 'Laptops', 'Drones', 'Audio'] },
  { id: 'CAT002', name: 'Outdoor', icon: 'sun', subCategories: ['Camping', 'Hiking', 'Cycling'] },
  { id: 'CAT003', name: 'Home & Garden', icon: 'home', subCategories: ['Tools', 'Appliances', 'Furniture'] },
  { id: 'CAT004', name: 'Sports', icon: 'activity', subCategories: ['Fitness', 'Indoor Games'] },
];
