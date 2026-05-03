const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockConfig, PlatformConfig } from "../store/config.mock";

// In-memory mutable copy
let currentConfig: PlatformConfig = { ...mockConfig };

export const configInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/config ──
  getConfig: async (): Promise<PlatformConfig> => {
    await delay(200);
    return { ...currentConfig };
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/config ──
  saveConfig: async (updates: Partial<PlatformConfig>): Promise<PlatformConfig> => {
    await delay(500);
    currentConfig = { ...currentConfig, ...updates };
    return { ...currentConfig };
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/config/defaults ──
  getDefaults: async (): Promise<PlatformConfig> => {
    await delay(100);
    return { ...mockConfig };
  },
};
