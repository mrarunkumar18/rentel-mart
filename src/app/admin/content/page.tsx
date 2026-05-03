"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Skeleton, EmptyState, useToastStore } from "@/components/admin/ui";
import { useRBAC } from "@/hooks/useRBAC";
import { mockContent } from "@/mocks/content";
import { MockContent } from "@/types/admin";
import { FileImage, CheckCircle, Trash2, Eye } from "lucide-react";
import { Modal } from "@/components/admin/ui";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ContentModerationPage() {
  return <RouteGuard moduleId="M08"><ContentModerationContent /></RouteGuard>;
}

function ContentModerationContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [items, setItems] = useState<MockContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [preview, setPreview] = useState<MockContent | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── SWAP POINT: replace with → GET /api/v1/admin/content/queue ──
  const fetch = useCallback(async () => {
    setLoading(true);
    await delay(250);
    const filtered = statusFilter === "all" ? mockContent : mockContent.filter(c => c.status === statusFilter);
    setItems([...filtered]);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  // ── SWAP POINT: replace with → PUT /api/v1/admin/content/:id/moderate ──
  const moderate = async (id: string, action: "approved" | "removed") => {
    setActionLoading(id);
    await delay(400);
    const item = mockContent.find(c => c.id === id);
    if (item) { item.status = action; item.moderatedAt = new Date().toISOString(); item.moderatedBy = "adm_001"; }
    addToast(`Content ${action}`, "success");
    setActionLoading(null);
    fetch();
  };

  return (
    <>
      <PageHeader title="Content Moderation" subtitle="Review flagged content submitted by users" />

      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {["pending","approved","removed","all"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${statusFilter === s ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-accent"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={FileImage} title="No content in this queue" description="All flagged content has been reviewed" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Content</Th>
              <Th>Owner</Th>
              <Th>Report Reason</Th>
              <Th>Status</Th>
              <Th>Reported</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-accent/40 transition-colors">
                <Td>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {item.type.replace("_", " ")}
                  </span>
                </Td>
                <Td>
                  <p className="text-sm text-slate-700 max-w-xs truncate">
                    {item.contentText || `[Image: ${item.contentUrl}]`}
                  </p>
                </Td>
                <Td className="text-sm text-slate-600">{item.ownerName}</Td>
                <Td className="text-sm text-slate-500">{item.reportReason}</Td>
                <Td>
                  <StatusBadge
                    status={item.status}
                    variant={item.status === "approved" ? "success" : item.status === "removed" ? "error" : "warning"}
                  />
                </Td>
                <Td className="text-xs text-slate-400">{new Date(item.reportedAt).toLocaleDateString("en-IN")}</Td>
                <Td>
                  <div className="flex gap-1">
                    <button onClick={() => setPreview(item)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors" title="Preview">
                      <Eye size={14} />
                    </button>
                    {can("M08", "approve") && item.status === "pending" && (
                      <button
                        onClick={() => moderate(item.id, "approved")}
                        disabled={actionLoading === item.id}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50" title="Approve">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {can("M08", "remove") && item.status !== "removed" && (
                      <button
                        onClick={() => moderate(item.id, "removed")}
                        disabled={actionLoading === item.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50" title="Remove">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Content Preview"
        footer={<>
          {preview && can("M08", "approve") && preview.status === "pending" && (
            <Button size="sm" onClick={() => { if (preview) { moderate(preview.id, "approved"); setPreview(null); } }}>Approve</Button>
          )}
          {preview && can("M08", "remove") && preview.status !== "removed" && (
            <Button size="sm" variant="danger" onClick={() => { if (preview) { moderate(preview.id, "removed"); setPreview(null); } }}>Remove</Button>
          )}
        </>}
      >
        {preview && (
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Type: {preview.type}</p>
              {preview.contentText && <p className="text-sm text-slate-700">{preview.contentText}</p>}
              {preview.contentUrl && (
                <div className="w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-slate-500 text-sm mt-2">
                  Image Preview (real image in Phase 4)
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500">
              <p>Owner: {preview.ownerName}</p>
              <p>Report: {preview.reportReason}</p>
              <p>Reported: {new Date(preview.reportedAt).toLocaleString("en-IN")}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
