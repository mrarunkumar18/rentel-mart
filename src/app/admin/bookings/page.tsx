"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Modal, Skeleton, EmptyState, useToastStore } from "@/components/admin/ui";
import { bookingInterceptor } from "@/mocks/interceptors/bookingInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { MockBooking } from "@/types/admin";
import { Search, CalendarCheck, XCircle } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral" | "info"> = {
  confirmed: "info",
  active: "success",
  returned: "neutral",
  cancelled: "error",
  disputed: "warning",
};

export default function BookingManagementPage() {
  return <RouteGuard moduleId="M03"><BookingContent /></RouteGuard>;
}

function BookingContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [bookings, setBookings] = useState<MockBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [cancelModal, setCancelModal] = useState<MockBooking | null>(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingInterceptor.getBookings({ status: statusFilter, search, page });
      setBookings(res.data);
      setTotal(res.total);
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setActionLoading(true);
    try {
      await bookingInterceptor.cancelBooking(cancelModal.id, reason);
      addToast("Booking cancelled", "success");
      setCancelModal(null); setReason(""); fetch();
    } catch (e: unknown) { addToast((e as Error).message, "error"); }
    finally { setActionLoading(false); }
  };

  return (
    <>
      <PageHeader title="Booking Management" subtitle={`${total} total bookings`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by listing or renter…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="all">All Statuses</option>
          {["confirmed","active","returned","cancelled","disputed"].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings found" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Booking ID</Th>
              <Th>Listing</Th>
              <Th>Renter</Th>
              <Th>Dates</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-accent/40 transition-colors">
                <Td><span className="text-xs font-mono text-slate-500">{b.id}</span></Td>
                <Td className="font-medium text-slate-800 text-sm">{b.listingTitle}</Td>
                <Td className="text-slate-600 text-sm">{b.renterName}</Td>
                <Td className="text-xs text-slate-500">
                  {new Date(b.startDate).toLocaleDateString("en-IN")} →{" "}
                  {new Date(b.endDate).toLocaleDateString("en-IN")}
                </Td>
                <Td className="font-medium text-slate-700">₹{b.totalAmount.toLocaleString("en-IN")}</Td>
                <Td><StatusBadge status={b.status} variant={(STATUS_VARIANT[b.status] as "success" | "warning" | "error" | "neutral") || "neutral"} /></Td>
                <Td>
                  {can("M03", "cancel") && !["cancelled", "returned"].includes(b.status) && (
                    <button onClick={() => setCancelModal(b)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Cancel Booking">
                      <XCircle size={14} />
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {total > 10 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-slate-400">Page {page} of {Math.ceil(total / 10)}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="ghost" size="sm" disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Modal open={!!cancelModal} onClose={() => { setCancelModal(null); setReason(""); }}
        title="Cancel Booking"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setCancelModal(null)}>Back</Button>
          <Button variant="danger" size="sm" loading={actionLoading} disabled={!reason.trim()} onClick={handleCancel}>Cancel Booking</Button>
        </>}
      >
        {cancelModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Booking <span className="font-mono font-medium">{cancelModal.id}</span> for <strong>{cancelModal.listingTitle}</strong></p>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cancellation reason (required)</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for admin cancellation…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" rows={3} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
