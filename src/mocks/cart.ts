import { Product, mockProducts } from './products';

export interface CartItem {
  id: string;
  product: Product;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
}

export const mockCart: CartItem[] = [
  {
    id: 'CART001',
    product: mockProducts[0], // Canon EOS R5
    startDate: '2025-03-01',
    endDate: '2025-03-05',
    totalDays: 4,
    totalPrice: 10000, // 2500 * 4
  },
  {
    id: 'CART002',
    product: mockProducts[3], // Camping Tent
    startDate: '2025-04-10',
    endDate: '2025-04-12',
    totalDays: 2,
    totalPrice: 1000, // 500 * 2
  }
];

export const getCartSummary = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.product.pricing.deposit, 0);
  const deliveryFee = 250;
  return {
    subtotal,
    totalDeposit,
    deliveryFee,
    total: subtotal + totalDeposit + deliveryFee
  };
};
