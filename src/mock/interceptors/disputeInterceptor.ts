const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { mockDisputes, MockDispute, DisputeVerdict } from "../store/disputes.mock";
import { mockAuditLog } from "../store/auditLog.mock";

export const disputeInterceptor = {

  // ── SWAP POINT: replace with → GET /api/v1/admin/disputes ──
  getDisputes: async (filters?: { status?: string; page?: number }): Promise<{ data: MockDispute[]; total: number }> => {
    await delay(300);
    let result = [...mockDisputes];
    if (filters?.status && filters.status !== "all") {
      result = result.filter((d) => d.status === filters.status);
    }
    const page = filters?.page || 1;
    const pageSize = 10;
    return { data: result.slice((page - 1) * pageSize, page * pageSize), total: result.length };
  },

  // ── SWAP POINT: replace with → GET /api/v1/admin/disputes/:id ──
  getDisputeById: async (id: string): Promise<MockDispute | null> => {
    await delay(200);
    return mockDisputes.find((d) => d.id === id) || null;
  },

  // ── SWAP POINT: replace with → PUT /api/v1/admin/disputes/:id/rule ──
  ruleDispute: async (
    disputeId: string,
    verdict: DisputeVerdict,
    notes: string,
    adminId: string
  ): Promise<void> => {
    await delay(500);
    const dispute = mockDisputes.find((d) => d.id === disputeId);
    if (!dispute) throw new Error("Dispute not found");
    dispute.verdict = verdict;
    dispute.verdictNotes = notes;
    dispute.adminId = adminId;
    dispute.resolvedAt = new Date().toISOString();
    dispute.status =
      verdict === "favor_renter"
        ? "ruled_renter"
        : verdict === "favor_owner"
        ? "ruled_owner"
        : "escalated";

    // Auto-log to audit trail
    mockAuditLog.unshift({
      id: `aud_${Date.now()}`,
      adminId,
      adminName: "Admin",
      adminRole: "super_admin",
      action: "rule_dispute",
      module: "M04",
      targetId: disputeId,
      targetType: "dispute",
      description: `Ruled dispute ${disputeId}: ${verdict}`,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.1",
      metadata: { verdict, notes },
    });
  },
};
