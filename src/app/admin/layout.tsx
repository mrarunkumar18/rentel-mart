export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* T3 STEP-1: Add Admin Sidebar + Auth Guard here */}
      <main className="flex-1 p-6 bg-muted">{children}</main>
    </div>
  );
}
