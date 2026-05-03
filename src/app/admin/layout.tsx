import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastContainer } from "@/components/admin/ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
