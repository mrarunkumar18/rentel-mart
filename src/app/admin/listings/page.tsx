"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Modal, Skeleton, EmptyState, useToastStore } from "@/components/admin/ui";
import { listingInterceptor } from "@/mocks/interceptors/listingInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { MockListing } from "@/types/admin";
import { Search, LayoutGrid, CheckCircle, XCircle, Flag, Trash2 } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  approved: "success",
  pending: "warning",
  rejected: "error",
  flagged: "error",
};

export default function ListingManagementPage() {
  return <RouteGuard moduleId="M02"><ListingContent /></RouteGuard>;
}

function ListingContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [listings, setListings] = useState<MockListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ listing: MockListing; type: "reject" | "flag" | "remove" } | null>(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listingInterceptor.getListings({ status: statusFilter, search, page });
      setListings(res.data);
      setTotal(res.total);
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAction = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      if (modal.type === "reject") await listingInterceptor.rejectListing(modal.listing.id, reason);
      if (modal.type === "flag") await listingInterceptor.flagListing(modal.listing.id, reason);
      if (modal.type === "remove") await listingInterceptor.removeListing(modal.listing.id);
      addToast(`Listing ${modal.type}ed successfully`, "success");
      setModal(null); setReason(""); fetch();
    } catch (e: unknown) { addToast((e as Error).message, "error"); }
    finally { setActionLoading(false); }
  };

  const approve = async (id: string) => {
    try {
      await listingInterceptor.approveListing(id);
      addToast("Listing approved", "success"); fetch();
    } catch (e: unknown) { addToast((e as Error).message, "error"); }
  };

  return (
    <>
      <PageHeader title="Listing Management" subtitle={`${total} total listings`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search listings…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : listings.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No listings found" description="Adjust your filters to see listings" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Listing</Th>
              <Th>Owner</Th>
              <Th>Category</Th>
              <Th>Price/Day</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="hover:bg-accent/40 transition-colors">
                <Td>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{l.title}</p>
                    <p className="text-xs text-slate-400">{l.location} · {l.id}</p>
                  </div>
                </Td>
                <Td className="text-slate-600 text-sm">{l.ownerName}</Td>
                <Td><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{l.category}</span></Td>
                <Td className="font-medium text-slate-700">₹{l.pricePerDay.toLocaleString("en-IN")}</Td>
                <Td><StatusBadge status={l.status} variant={STATUS_VARIANT[l.status] || "neutral"} /></Td>
                <Td>
                  <div className="flex items-center gap-1">
                    {can("M02", "approve") && l.status === "pending" && (
                      <button onClick={() => approve(l.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Approve">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {can("M02", "reject") && l.status !== "rejected" && (
                      <button onClick={() => setModal({ listing: l, type: "reject" })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                        <XCircle size={14} />
                      </button>
                    )}
                    {can("M02", "flag") && l.status !== "flagged" && (
                      <button onClick={() => setModal({ listing: l, type: "flag" })} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-md transition-colors" title="Flag">
                        <Flag size={14} />
                      </button>
                    )}
                    {can("M02", "remove") && (
                      <button onClick={() => setModal({ listing: l, type: "remove" })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Remove">
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

      {total > 10 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">Page {page}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="ghost" size="sm" disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={() => { setModal(null); setReason(""); }}
        title={modal?.type === "reject" ? "Reject Listing" : modal?.type === "flag" ? "Flag Listing" : "Remove Listing"}
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setModal(null)}>Cancel</Button>
          <Button size="sm" variant="danger" loading={actionLoading}
            disabled={modal?.type !== "remove" && !reason.trim()} onClick={handleAction}>Confirm</Button>
        </>}
      >
        {modal && (
          <div className="space-y-3">
            <p className="font-medium text-slate-800">{modal.listing.title}</p>
            {modal.type !== "remove" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Reason (required)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                  placeholder={`Reason for ${modal.type}ing this listing…`}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" rows={3} />
              </div>
            )}
            {modal.type === "remove" && <p className="text-sm text-red-600">This will permanently remove the listing. This cannot be undone.</p>}
          </div>
        )}
      </Modal>
    </>
  );
}
