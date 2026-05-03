const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFilters {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

import { mockUsers, MockUser } from "../store/users.mock";

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
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    return {
      data: result.slice((page - 1) * pageSize, page * pageSize),
      total: result.length,
    };
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/suspend ──
  suspendUser: async (userId: string, reason: string): Promise<void> => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "suspended";
    user.suspendReason = reason;
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
    user.isVerified = true;
    user.status = "active";
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/users/:id/activate ──
  activateUser: async (userId: string): Promise<void> => {
    await delay(350);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "active";
    user.suspendReason = undefined;
  },
};
