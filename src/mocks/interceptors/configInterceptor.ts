import { mockPlatformConfig } from "../seed";
import { PlatformConfig } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const configInterceptor = {
  getConfig: async (): Promise<PlatformConfig[]> => {
    await delay(200);
    return [...mockPlatformConfig];
  },

  updateConfig: async (settings: Record<string, string>): Promise<void> => {
    await delay(500);
    Object.entries(settings).forEach(([key, value]) => {
      const entry = mockPlatformConfig.find(c => c.key === key);
      if (entry) {
        entry.value = value;
        entry.updated_at = new Date().toISOString();
      }
    });
  },
};
