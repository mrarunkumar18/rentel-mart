"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { DisputeStatus } from "@/types/database";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Skeleton, EmptyState, useToastStore } from "@/components/admin/ui";
import { disputeInterceptor } from "@/mocks/interceptors/disputeInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { useAdminSession } from "@/hooks/useRBAC";
import { MockDispute, DisputeVerdict } from "@/types/admin";
import { ShieldAlert, X, ZoomIn, ChevronLeft } from "lucide-react";
import Image from "next/image";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  open: "warning",
  ruled_renter: "success",
  ruled_owner: "neutral",
  escalated: "error",
};

export default function DisputeResolutionPage() {
  return <RouteGuard moduleId="M04"><DisputeContent /></RouteGuard>;
}

function DisputeContent() {
  const { can } = useRBAC();
  const { session } = useAdminSession();
  const { addToast } = useToastStore();
  const [disputes, setDisputes] = useState<MockDispute[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "all">("all");
  const [selected, setSelected] = useState<MockDispute | null>(null);
  const [verdict, setVerdict] = useState<DisputeVerdict | "">("");
  const [notes, setNotes] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await disputeInterceptor.getDisputes({ status: statusFilter });
      setDisputes(res.data); setTotal(res.total);
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRuling = async () => {
    if (!selected || !verdict || !session) return;
    setSubmitLoading(true);
    try {
      await disputeInterceptor.ruleDispute(selected.id, verdict as DisputeVerdict, notes, session.id);
      addToast("Ruling submitted and logged to audit trail", "success");
      setSelected(null); setVerdict(""); setNotes("");
      fetch();
    } catch (e: unknown) { addToast((e as Error).message, "error"); }
    finally { setSubmitLoading(false); }
  };

  const canSubmit = verdict !== "" && notes.trim().length >= 20;

  // --- Detail view ---
  if (selected) {
    return (
      <div>
        <button onClick={() => { setSelected(null); setVerdict(""); setNotes(""); }}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
          <ChevronLeft size={16} /> Back to disputes
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dispute {selected.id}</h1>
            <p className="text-sm text-slate-500">Booking {selected.bookingId} · {selected.listingTitle}</p>
          </div>
          <StatusBadge status={selected.status.replace("_", " ")} variant={STATUS_VARIANT[selected.status] || "neutral"} />
        </div>

        {/* Claims */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Renter Claim</p>
            <p className="text-sm text-slate-700">{selected.renterClaim}</p>
            <p className="text-xs text-slate-400 mt-2">{selected.renterName}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Owner Claim</p>
            <p className="text-sm text-slate-700">{selected.ownerClaim}</p>
            <p className="text-xs text-slate-400 mt-2">{selected.ownerName}</p>
          </div>
        </div>

        {/* Photo comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pickup photos */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Pickup Photos (taken by renter)</p>
            {selected.pickupPhotos.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg">
                No photos submitted
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selected.pickupPhotos.map((p, i) => (
                  <div key={i} className="relative group">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden cursor-pointer relative"
                      onClick={() => setLightbox(p.url)}>
                      <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-200 flex items-center justify-center text-xs text-slate-500">
                        Photo {i + 1}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{new Date(p.timestamp).toLocaleTimeString("en-IN")}</p>
                    {p.gps && <p className="text-xs text-slate-300">{p.gps}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Return photos */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Return Photos (taken by owner)</p>
            {selected.returnPhotos.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg">
                No photos submitted
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selected.returnPhotos.map((p, i) => (
                  <div key={i} className="relative group">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setLightbox(p.url)}>
                      <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-200 flex items-center justify-center text-xs text-slate-500">
                        Photo {i + 1}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{new Date(p.timestamp).toLocaleTimeString("en-IN")}</p>
                    {p.gps && <p className="text-xs text-slate-300">{p.gps}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verdict form */}
        {can("M04", "rule") && selected.status === "open" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Submit Ruling</h3>
            <div className="flex gap-3 mb-4">
              {(["favor_renter", "favor_owner", "escalate"] as DisputeVerdict[]).map((v) => (
                <button key={v} onClick={() => setVerdict(v)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    verdict === v
                      ? v === "favor_renter" ? "border-green-500 bg-green-50 text-green-700"
                        : v === "favor_owner" ? "border-primary bg-accent text-primary"
                        : "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}>
                  {v === "favor_renter" ? "Favor Renter" : v === "favor_owner" ? "Favor Owner" : "Escalate"}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Notes <span className="text-slate-400">(min 20 characters — required)</span>
              </label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your ruling rationale in detail…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                rows={4} />
              <p className={`text-xs mt-1 ${notes.length >= 20 ? "text-green-600" : "text-slate-400"}`}>
                {notes.length}/20 minimum characters
              </p>
            </div>
            <Button onClick={handleRuling} loading={submitLoading} disabled={!canSubmit}>
              Submit Ruling
            </Button>
          </div>
        )}

        {/* Already ruled */}
        {selected.status !== "open" && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-700">Ruling: <span className="text-primary">{selected.verdict?.replace("_", " ")}</span></p>
            {selected.verdictNotes && <p className="text-sm text-slate-500 mt-1">{selected.verdictNotes}</p>}
            {selected.resolvedAt && <p className="text-xs text-slate-400 mt-1">Resolved: {new Date(selected.resolvedAt).toLocaleString("en-IN")}</p>}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}><X size={24} /></button>
            <div className="w-96 h-96 bg-slate-700 rounded-xl flex items-center justify-center text-white">
              Photo Preview (real image in Phase 4)
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- List view ---
  return (
    <>
      <PageHeader title="Dispute Resolution" subtitle={`${total} total disputes`} />
      <div className="mb-6">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as DisputeStatus | "all"); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="ruled_renter">Ruled — Renter</option>
          <option value="ruled_owner">Ruled — Owner</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : disputes.length === 0 ? (
        <EmptyState icon={ShieldAlert} title="No disputes found" description="All disputes have been resolved" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Dispute ID</Th>
              <Th>Listing</Th>
              <Th>Renter</Th>
              <Th>Owner</Th>
              <Th>Deposit</Th>
              <Th>Status</Th>
              <Th>Opened</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => (
              <tr key={d.id} className="hover:bg-accent/40 transition-colors cursor-pointer" onClick={() => setSelected(d)}>
                <Td><span className="font-mono text-xs text-slate-500">{d.id}</span></Td>
                <Td className="font-medium text-sm text-slate-800">{d.listingTitle}</Td>
                <Td className="text-sm text-slate-600">{d.renterName}</Td>
                <Td className="text-sm text-slate-600">{d.ownerName}</Td>
                <Td className="font-medium text-slate-700">₹{d.depositAmount.toLocaleString("en-IN")}</Td>
                <Td><StatusBadge status={d.status.replace("_", " ")} variant={STATUS_VARIANT[d.status] || "neutral"} /></Td>
                <Td className="text-xs text-slate-400">{new Date(d.openedAt).toLocaleDateString("en-IN")}</Td>
                <Td>
                  <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(d); }}>
                    Review
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
