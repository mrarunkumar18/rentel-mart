import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E4F9FF] px-4 py-12">
      {/* Rentify brand header */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          aria-label="Back to Rentify home"
        >
          <span className="text-3xl font-bold text-[#1886FF] tracking-tight">
            Rentify
          </span>
        </Link>
        <p className="mt-1 text-sm text-[#737373]">
          Rent anything, from anyone, anywhere.
        </p>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#E5E5E5] p-8">
        {children}
      </div>

      {/* Footer links */}
      <p className="mt-6 text-xs text-[#737373]">
        &copy; {new Date().getFullYear()} Rentify. All rights reserved.
      </p>
    </div>
  );
}

