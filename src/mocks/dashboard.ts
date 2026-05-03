// PHASE4-SWAP: Replace with real API calls

export interface DashboardStats {
  totalSpent: number;
  totalEarned: number;
  activeRentals: number;
  pendingRequests: number;
  earningsChange: number; // percentage
  rentalsChange: number; // percentage
}

export interface Notification {
  id: string;
  type: 'order' | 'request' | 'dispute' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export const mockDashboardData = {
  stats: {
    totalSpent: 12500,
    totalEarned: 8400,
    activeRentals: 3,
    pendingRequests: 2,
    earningsChange: 12.5,
    rentalsChange: -5.2,
  },
  notifications: [
    {
      id: 'NTF001',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your rental for "Canon EOS R5" has been delivered.',
      timestamp: '2025-02-15T10:30:00Z',
      isRead: false,
    },
    {
      id: 'NTF002',
      type: 'request',
      title: 'New Rental Request',
      message: 'Someone wants to rent your "Camping Tent".',
      timestamp: '2025-02-14T18:45:00Z',
      isRead: true,
    },
    {
      id: 'NTF003',
      type: 'system',
      title: 'Profile Verified',
      message: 'Your identity verification is complete.',
      timestamp: '2025-02-10T14:20:00Z',
      isRead: true,
    },
    {
      id: 'NTF004',
      type: 'order',
      title: 'Rental Ending Soon',
      message: 'Your "Electric Scooter" rental ends in 2 days.',
      timestamp: '2025-02-15T09:00:00Z',
      isRead: false,
    },
    {
      id: 'NTF005',
      type: 'dispute',
      title: 'Damage Claim Filed',
      message: 'A lister has filed a claim for "Power Drill".',
      timestamp: '2025-02-12T11:00:00Z',
      isRead: false,
    },
  ] as Notification[],
  quickActions: [
    { id: 'QA001', label: 'Browse Products', href: '/(renter)/browse', icon: 'search' },
    { id: 'QA002', label: 'Create Listing', href: '/(lister)/listings/new', icon: 'plus' },
    { id: 'QA003', label: 'My Orders', href: '/(renter)/orders', icon: 'package' },
    { id: 'QA004', label: 'Help Center', href: '/help', icon: 'help' },
  ] as QuickAction[],
};
