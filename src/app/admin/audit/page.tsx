"use client";

import { useEffect, useState, useCallback } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { PageHeader, Table, Th, Td, Skeleton, EmptyState } from "@/components/admin/ui";
import { mockAuditLog, AuditEntry } from "@/mocks/audit";
import { ScrollText, Search } from "lucide-react";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function AuditLogPage() {
  return <RouteGuard moduleId="M10"><AuditLogContent /></RouteGuard>;
}

function AuditLogContent() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  // ── SWAP POINT: replace with → GET /api/v1/admin/audit-log ──
  const fetch = useCallback(async () => {
    setLoading(true);
    await delay(200);
    let result = [...mockAuditLog];
    if (moduleFilter !== "all") result = result.filter(e => e.module === moduleFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.adminName.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    setTotal(result.length);
    setEntries(result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    setLoading(false);
  }, [search, moduleFilter, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const MODULE_COLORS: Record<string, string> = {
    M01: "bg-blue-100 text-blue-700",
    M02: "bg-green-100 text-green-700",
    M03: "bg-purple-100 text-purple-700",
    M04: "bg-red-100 text-red-700",
    M05: "bg-amber-100 text-amber-700",
    M06: "bg-indigo-100 text-indigo-700",
    M07: "bg-cyan-100 text-cyan-700",
    M08: "bg-pink-100 text-pink-700",
    M09: "bg-teal-100 text-teal-700",
    M10: "bg-slate-100 text-slate-600",
  };

  return (
    <>
      <PageHeader
        title="Audit Log"
        subtitle={`${total} total entries — read-only`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by admin, action…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
        <select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
          <option value="all">All Modules</option>
          {["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : entries.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit entries found" description="Try adjusting your search filters" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Timestamp</Th>
              <Th>Admin</Th>
              <Th>Role</Th>
              <Th>Module</Th>
              <Th>Action</Th>
              <Th>Description</Th>
              <Th>Target</Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-accent/40 transition-colors">
                <Td className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(e.timestamp).toLocaleString("en-IN")}
                </Td>
                <Td>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{e.adminName}</p>
                    <p className="text-xs text-slate-400">{e.ipAddress}</p>
                  </div>
                </Td>
                <Td>
                  <span className="text-xs text-slate-500 capitalize">{e.adminRole.replace("_", " ")}</span>
                </Td>
                <Td>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${MODULE_COLORS[e.module] || "bg-slate-100 text-slate-600"}`}>
                    {e.module}
                  </span>
                </Td>
                <Td>
                  <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{e.action}</code>
                </Td>
                <Td className="text-sm text-slate-600">{e.description}</Td>
                <Td>
                  {e.targetId && (
                    <span className="text-xs font-mono text-slate-400">{e.targetId}</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, total)} of {total}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-sm text-slate-600 hover:bg-accent rounded-lg disabled:opacity-40 transition-colors">
              Previous
            </button>
            <button disabled={page * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-sm text-slate-600 hover:bg-accent rounded-lg disabled:opacity-40 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
