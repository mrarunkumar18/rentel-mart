import { mockPlatformConfig } from "../seed";
import { AdminPlatformConfig } from "@/types/admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const configInterceptor = {
  getConfig: async (): Promise<AdminPlatformConfig> => {
    await delay(200);
    const config: any = {};
    mockPlatformConfig.forEach(c => {
      // Parse values based on their intended type
      if (c.value === 'true') config[c.key] = true;
      else if (c.value === 'false') config[c.key] = false;
      else if (!isNaN(Number(c.value)) && c.key !== 'admin_alert_email') config[c.key] = Number(c.value);
      else config[c.key] = c.value;
    });
    return config as AdminPlatformConfig;
  },

  saveConfig: async (draft: AdminPlatformConfig): Promise<AdminPlatformConfig> => {
    await delay(500);
    Object.entries(draft).forEach(([key, value]) => {
      const entry = mockPlatformConfig.find(c => c.key === key);
      if (entry) {
        entry.value = String(value);
        entry.updated_at = new Date().toISOString();
      }
    });
    return draft;
  },
};
