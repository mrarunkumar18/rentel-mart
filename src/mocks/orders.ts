import { Product, mockProducts } from './products';

export type OrderStatus = 'pending_approval' | 'awaiting_pickup' | 'active' | 'completed' | 'cancelled' | 'disputed';

export interface Order {
  id: string;
  productId: string;
  product: Product;
  status: OrderStatus;
  startDate: string;
  endDate: string;
  totalDays: number;
  paymentPlan: 'upfront' | 'weekly' | 'monthly';
  pricing: {
    rent: number;
    deposit: number;
    delivery: number;
    total: number;
  };
  installments?: {
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
  }[];
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-88214',
    productId: 'PROD001',
    product: mockProducts[0],
    status: 'active',
    startDate: '2025-02-10',
    endDate: '2025-02-15',
    totalDays: 5,
    paymentPlan: 'upfront',
    pricing: {
      rent: 12500,
      deposit: 20000,
      delivery: 250,
      total: 32750,
    },
    timeline: [
      { status: 'Booked', date: '2025-02-08T10:00:00Z', description: 'Order placed by Renter' },
      { status: 'Confirmed', date: '2025-02-08T14:30:00Z', description: 'Confirmed by Lister' },
      { status: 'Delivered', date: '2025-02-10T11:00:00Z', description: 'Item received by Renter' },
    ],
  },
  {
    id: 'ORD-77312',
    productId: 'PROD002',
    product: mockProducts[1],
    status: 'pending_approval',
    startDate: '2025-03-01',
    endDate: '2025-03-30',
    totalDays: 30,
    paymentPlan: 'monthly',
    pricing: {
      rent: 60000,
      deposit: 30000,
      delivery: 0,
      total: 90000,
    },
    installments: [
      { dueDate: '2025-03-01', amount: 30000, status: 'paid' },
      { dueDate: '2025-03-15', amount: 30000, status: 'pending' },
      { dueDate: '2025-03-30', amount: 30000, status: 'pending' },
    ],
    timeline: [
      { status: 'Requested', date: '2025-02-15T09:00:00Z', description: 'Waiting for lister approval' },
    ],
  },
  {
    id: 'ORD-99102',
    productId: 'PROD004',
    product: mockProducts[3],
    status: 'completed',
    startDate: '2025-01-05',
    endDate: '2025-01-08',
    totalDays: 3,
    paymentPlan: 'upfront',
    pricing: {
      rent: 1500,
      deposit: 2000,
      delivery: 250,
      total: 3750,
    },
    timeline: [
      { status: 'Booked', date: '2025-01-01T12:00:00Z', description: 'Order placed' },
      { status: 'Returned', date: '2025-01-08T16:00:00Z', description: 'Item returned to lister' },
      { status: 'Deposit Refunded', date: '2025-01-09T10:00:00Z', description: '₹2,000 returned to bank' },
    ],
  }
];
