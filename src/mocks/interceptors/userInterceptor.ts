import { mockUsers, mockBookings } from "../seed";
import { User, UserStatus } from "@/types/database";
import { MockUser } from "@/types/admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFilters {
  status?: UserStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export const userInterceptor = {
  // ── SWAP POINT: replace with → GET /api/v1/admin/users ──
  getUsers: async (filters?: UserFilters): Promise<{ data: MockUser[]; total: number }> => {
    await delay(300);
    let result = [...mockUsers];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((u) => u.status === filters.status);
    }
    
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    
    const mapped = result.slice((page - 1) * pageSize, page * pageSize).map(u => ({
      ...u,
      isVerified: u.status === 'active', // Simplified mock logic
      joinedAt: u.created_at,
      totalBookings: mockBookings.filter(b => b.renter_id === u.id).length,
    }));

    return {
      data: mapped as MockUser[],
      total: result.length,
    };
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/suspend ──
  suspendUser: async (userId: string, reason: string): Promise<void> => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "suspended";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/ban ──
  banUser: async (userId: string): Promise<void> => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "banned";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/verify ──
  verifyUser: async (userId: string): Promise<void> => {
    await delay(350);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "active";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/activate ──
  activateUser: async (userId: string): Promise<void> => {
    await delay(350);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "active";
  },
};
