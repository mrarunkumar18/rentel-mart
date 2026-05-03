"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Modal, Skeleton, EmptyState, useToastStore } from "@/components/admin/ui";
import { paymentInterceptor } from "@/mocks/interceptors/paymentInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { MockPayment } from "@/mocks/payments.mock";
import { Search, CreditCard, RotateCcw, Flag } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  completed: "success",
  refunded: "neutral",
  failed: "error",
  flagged: "warning",
};

export default function FinancePage() {
  return <RouteGuard moduleId="M05"><FinanceContent /></RouteGuard>;
}

function FinanceContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [payments, setPayments] = useState<MockPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [refundModal, setRefundModal] = useState<MockPayment | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentInterceptor.getPayments({ status: statusFilter, search, page });
      setPayments(res.data); setTotal(res.total);
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRefund = async () => {
    if (!refundModal) return;
    setActionLoading(true);
    try {
      await paymentInterceptor.processRefund(refundModal.id, refundReason);
      addToast("Refund processed successfully", "success");
      setRefundModal(null); setRefundReason(""); fetch();
    } catch (e: unknown) { addToast((e as Error).message, "error"); }
    finally { setActionLoading(false); }
  };

  const gmv = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const totalFees = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.platformFee, 0);

  return (
    <>
      <PageHeader title="Finance & Payments" subtitle={`${total} transactions`} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total GMV", value: `₹${(gmv / 100000).toFixed(1)}L`, color: "text-primary" },
          { label: "Platform Fees", value: `₹${(totalFees / 1000).toFixed(0)}K`, color: "text-green-600" },
          { label: "Refunds", value: payments.filter(p => p.status === "refunded").length, color: "text-amber-600" },
          { label: "Flagged", value: payments.filter(p => p.status === "flagged").length, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by user or transaction ref…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No transactions found" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Ref</Th>
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Fee</Th>
              <Th>Method</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-accent/40 transition-colors">
                <Td><span className="font-mono text-xs text-slate-400">{p.transactionRef.slice(-8)}</span></Td>
                <Td className="text-sm text-slate-700">{p.userName}</Td>
                <Td className="font-semibold text-slate-800">₹{p.amount.toLocaleString("en-IN")}</Td>
                <Td className="text-slate-500">₹{p.platformFee.toLocaleString("en-IN")}</Td>
                <Td className="text-sm text-slate-600">{p.method}</Td>
                <Td><StatusBadge status={p.status} variant={STATUS_VARIANT[p.status] || "neutral"} /></Td>
                <Td className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString("en-IN")}</Td>
                <Td>
                  <div className="flex gap-1">
                    {can("M05", "refund") && p.status === "completed" && (
                      <button onClick={() => setRefundModal(p)}
                        className="p-1.5 text-primary hover:bg-accent rounded-md transition-colors" title="Refund">
                        <RotateCcw size={14} />
                      </button>
                    )}
                    {can("M05", "flag_fraud") && p.status === "completed" && (
                      <button onClick={async () => { await paymentInterceptor.flagPayment(p.id, "Fraud suspected"); addToast("Payment flagged", "info"); fetch(); }}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-md transition-colors" title="Flag Fraud">
                        <Flag size={14} />
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {total > 15 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-slate-400">Page {page}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="ghost" size="sm" disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Modal open={!!refundModal} onClose={() => { setRefundModal(null); setRefundReason(""); }}
        title="Process Refund"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setRefundModal(null)}>Cancel</Button>
          <Button size="sm" loading={actionLoading} disabled={!refundReason.trim()} onClick={handleRefund}>Process Refund</Button>
        </>}
      >
        {refundModal && (
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-slate-800">₹{refundModal.amount.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-500">{refundModal.userName} · {refundModal.method}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Refund reason (required)</label>
              <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Reason for processing this refund…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none" rows={3} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
