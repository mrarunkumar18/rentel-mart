import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldX size={40} className="text-error" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">403 — Access Denied</h1>
        <p className="text-slate-500 max-w-sm">
          You do not have permission to access this module. Contact your Super Admin to request access.
        </p>
        <Link href="/admin/dashboard" className="mt-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
