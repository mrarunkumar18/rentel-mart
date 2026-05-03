"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, StatusBadge, PageHeader, Table, Th, Td, Modal, EmptyState, useToastStore } from "@/components/admin/ui";
import { useRBAC } from "@/hooks/useRBAC";
import { mockAdminAccounts } from "@/mocks/admin";
import { AdminAccount } from "@/types/admin";
import { AdminRole } from "@/types/admin";
import { ShieldCheck, Plus, Pencil, Trash2 } from "lucide-react";

const TIER_COLORS: Record<number, string> = {
  1: "bg-purple-100 text-purple-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-green-100 text-green-700",
  4: "bg-amber-100 text-amber-700",
  5: "bg-slate-100 text-slate-600",
};

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  ops_sub_admin: "Ops Sub-Admin",
  finance_sub_admin: "Finance Sub-Admin",
  content_sub_admin: "Content Sub-Admin",
  custom: "Custom",
};

export default function RBACManagementPage() {
  return <RouteGuard moduleId="M06"><RBACContent /></RouteGuard>;
}

function RBACContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<AdminAccount | null>(null);
  const [deleteModal, setDeleteModal] = useState<AdminAccount | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "ops_sub_admin" as AdminRole });
  const [loading, setLoading] = useState(false);

  useEffect(() => { setAccounts([...mockAdminAccounts]); }, []);

  const handleCreate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newAccount: AdminAccount = {
      id: `adm_${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      tier: { super_admin: 1, ops_sub_admin: 2, finance_sub_admin: 3, content_sub_admin: 4, custom: 5 }[form.role],
      createdAt: new Date().toISOString(),
      lastLogin: "-",
      isActive: true,
    };
    mockAdminAccounts.push(newAccount);
    setAccounts([...mockAdminAccounts]);
    addToast(`Admin account created for ${form.name}`, "success");
    setCreateModal(false); setForm({ name: "", email: "", role: "ops_sub_admin" });
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const idx = mockAdminAccounts.findIndex(a => a.id === deleteModal.id);
    if (idx !== -1) mockAdminAccounts.splice(idx, 1);
    setAccounts([...mockAdminAccounts]);
    addToast("Admin account removed", "success");
    setDeleteModal(null); setLoading(false);
  };

  return (
    <>
      <PageHeader
        title="RBAC Management"
        subtitle="Manage admin accounts and role permissions"
        actions={can("M06", "create") ? (
          <Button size="sm" onClick={() => setCreateModal(true)}>
            <Plus size={14} /> Invite Admin
          </Button>
        ) : undefined}
      />

      {accounts.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No admin accounts" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Tier</Th>
              <Th>Status</Th>
              <Th>Last Login</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} className="hover:bg-accent/40 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs">{a.name[0]}</div>
                    <span className="font-medium text-sm text-slate-800">{a.name}</span>
                  </div>
                </Td>
                <Td className="text-slate-500 text-sm">{a.email}</Td>
                <Td><span className="text-sm text-slate-700">{ROLE_LABELS[a.role]}</span></Td>
                <Td>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TIER_COLORS[a.tier]}`}>
                    Tier {a.tier}
                  </span>
                </Td>
                <Td><StatusBadge status={a.isActive ? "Active" : "Inactive"} variant={a.isActive ? "success" : "neutral"} /></Td>
                <Td className="text-xs text-slate-400">
                  {a.lastLogin === "-" ? "Never" : new Date(a.lastLogin).toLocaleDateString("en-IN")}
                </Td>
                <Td>
                  <div className="flex gap-1">
                    {can("M06", "edit") && a.tier > 1 && (
                      <button onClick={() => { setEditModal(a); setForm({ name: a.name, email: a.email, role: a.role }); }}
                        className="p-1.5 text-primary hover:bg-accent rounded-md transition-colors" title="Edit">
                        <Pencil size={14} />
                      </button>
                    )}
                    {can("M06", "delete") && a.tier > 1 && (
                      <button onClick={() => setDeleteModal(a)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                    {a.tier === 1 && <span className="text-xs text-slate-400 px-2">Protected</span>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Invite Admin"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
          <Button size="sm" loading={loading} disabled={!form.name || !form.email} onClick={handleCreate}>Create Account</Button>
        </>}
      >
        <div className="space-y-3">
          {(["name","email"] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{field}</label>
              <input type={field === "email" ? "email" : "text"} value={form[field]}
                onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
              {(Object.keys(ROLE_LABELS) as AdminRole[]).filter(r => r !== "super_admin").map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remove Admin Account"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>Remove Account</Button>
        </>}
      >
        {deleteModal && (
          <p className="text-sm text-slate-600">Remove <strong>{deleteModal.name}</strong> ({ROLE_LABELS[deleteModal.role]}) from the admin panel? This cannot be undone.</p>
        )}
      </Modal>
    </>
  );
}
