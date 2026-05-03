export default function ListerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* T2 STEP-6: Add Lister Navbar + Sidebar here */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
