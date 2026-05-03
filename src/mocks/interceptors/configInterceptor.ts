import { mockPlatformConfig } from "../seed";
import { PlatformConfig } from "@/types/database";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const configInterceptor = {
  getConfig: async (): Promise<PlatformConfig> => {
    await delay(200);
    return mockPlatformConfig;
  },

  updateConfig: async (newConfig: PlatformConfig): Promise<void> => {
    await delay(500);
    Object.assign(mockPlatformConfig, newConfig);
  },
};
