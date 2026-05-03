'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Lister Layout shell
 * Shares the same shell as Renter but could be customized further
 */
export default function ListerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
