import { mockUsers, mockBookings } from "../seed";
import { User, UserStatus } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userInterceptor = {
  getUsers: async (filters?: { status?: UserStatus | "all"; search?: string; page?: number }): Promise<{ data: any[]; total: number }> => {
    await delay(300);
    let result = [...mockUsers];
    
    if (filters?.status && filters.status !== "all") {
      result = result.filter((u) => u.status === filters.status);
    }
    
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    
    const page = filters?.page || 1;
    const pageSize = 10;
    
    const mapped = result.slice((page - 1) * pageSize, page * pageSize).map(u => {
      const bookingsCount = mockBookings.filter(b => b.renter_id === u.id || b.lister_id === u.id).length;
      return {
        ...u,
        isVerified: u.status === 'active',
        bookingsCount,
        joinedAt: u.created_at,
      };
    });

    return { data: mapped, total: result.length };
  },

  suspendUser: async (userId: string): Promise<void> => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "suspended";
  },

  banUser: async (userId: string): Promise<void> => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "banned";
  },

  activateUser: async (userId: string): Promise<void> => {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = "active";
  },
};
