"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import {
  Button, StatusBadge, PageHeader, Table, Th, Td,
  Modal, Skeleton, EmptyState, useToastStore,
} from "@/components/admin/ui";
import { userInterceptor } from "@/mock/interceptors/userInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { MockUser } from "@/mock/store/users.mock";
import { Search, Users, MoreHorizontal, Ban, UserCheck, ShieldOff } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  active: "success",
  suspended: "warning",
  pending_verify: "neutral",
  banned: "error",
};

export default function UserManagementPage() {
  return (
    <RouteGuard moduleId="M01">
      <UserManagementContent />
    </RouteGuard>
  );
}

function UserManagementContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();

  const [users, setUsers] = useState<MockUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [actionModal, setActionModal] = useState<{ user: MockUser; type: "suspend" | "ban" | "verify" | "activate" } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userInterceptor.getUsers({ status: statusFilter, search, page, pageSize: 15 });
      setUsers(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async () => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      if (actionModal.type === "suspend") await userInterceptor.suspendUser(actionModal.user.id, suspendReason);
      if (actionModal.type === "ban") await userInterceptor.banUser(actionModal.user.id);
      if (actionModal.type === "verify") await userInterceptor.verifyUser(actionModal.user.id);
      if (actionModal.type === "activate") await userInterceptor.activateUser(actionModal.user.id);
      addToast(`User ${actionModal.type === "activate" ? "reactivated" : actionModal.type + "ed"} successfully`, "success");
      setActionModal(null);
      setSuspendReason("");
      fetchUsers();
    } catch (e: unknown) {
      addToast((e as Error).message || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle={`${total} total users`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending_verify">Pending Verify</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your filters" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Verified</Th>
              <Th>Bookings</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.id}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-slate-500">{u.email}</Td>
                <Td>
                  <StatusBadge
                    status={u.status.replace("_", " ")}
                    variant={STATUS_VARIANT[u.status] || "neutral"}
                  />
                </Td>
                <Td>
                  <span className={`text-xs font-medium ${u.isVerified ? "text-green-600" : "text-amber-600"}`}>
                    {u.isVerified ? "Verified" : "Unverified"}
                  </span>
                </Td>
                <Td className="text-slate-600">{u.totalBookings}</Td>
                <Td className="text-slate-500 text-xs">{new Date(u.joinedAt).toLocaleDateString("en-IN")}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    {can("M01", "suspend") && u.status === "active" && (
                      <button
                        onClick={() => setActionModal({ user: u, type: "suspend" })}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                        title="Suspend User"
                      >
                        <ShieldOff size={14} />
                      </button>
                    )}
                    {can("M01", "ban") && u.status !== "banned" && (
                      <button
                        onClick={() => setActionModal({ user: u, type: "ban" })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Ban User"
                      >
                        <Ban size={14} />
                      </button>
                    )}
                    {can("M01", "verify") && !u.isVerified && (
                      <button
                        onClick={() => setActionModal({ user: u, type: "verify" })}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Verify User"
                      >
                        <UserCheck size={14} />
                      </button>
                    )}
                    {can("M01", "suspend") && u.status === "suspended" && (
                      <button
                        onClick={() => setActionModal({ user: u, type: "activate" })}
                        className="p-1.5 text-primary hover:bg-accent rounded-md transition-colors text-xs font-medium"
                        title="Reactivate"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">Showing {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} of {total}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="ghost" size="sm" disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      <Modal
        open={!!actionModal}
        onClose={() => { setActionModal(null); setSuspendReason(""); }}
        title={
          actionModal?.type === "suspend" ? "Suspend User" :
          actionModal?.type === "ban" ? "Ban User" :
          actionModal?.type === "verify" ? "Verify User" : "Reactivate User"
        }
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button
              size="sm"
              variant={actionModal?.type === "ban" ? "danger" : "primary"}
              loading={actionLoading}
              disabled={actionModal?.type === "suspend" && !suspendReason.trim()}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        {actionModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {actionModal.type === "suspend" && "This will prevent the user from making bookings or listing items."}
              {actionModal.type === "ban" && "This will permanently ban the user from the platform. This action is severe."}
              {actionModal.type === "verify" && "This will mark the user as verified and activate their account."}
              {actionModal.type === "activate" && "This will restore the user's ability to use the platform."}
            </p>
            <p className="text-sm font-medium text-slate-800">User: {actionModal.user.name} ({actionModal.user.email})</p>
            {actionModal.type === "suspend" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Reason (required)</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Describe the reason for suspension…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
