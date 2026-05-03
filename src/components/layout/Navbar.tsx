import Link from 'next/link';

/**
 * Navbar — shared top navigation bar for the Rentify app.
 * Used in renter and lister layouts (not in auth layout).
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Rentify Home"
        >
          <span className="text-2xl font-bold tracking-tight text-[#1886FF]">
            Rentify
          </span>
        </Link>

        {/* Search bar (hidden on small screens) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <label htmlFor="global-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              id="global-search"
              type="search"
              placeholder="Search for anything to rent…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#62D0FF] focus:border-[#1886FF] transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-2 shrink-0" aria-label="Top navigation">
          <Link
            href="/(renter)/browse"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-[#171717] hover:text-[#1886FF] transition-colors px-3 py-2 rounded-md hover:bg-[#E4F9FF]"
          >
            Browse
          </Link>
          <Link
            href="/(auth)/login"
            className="text-sm font-medium text-[#171717] hover:text-[#1886FF] transition-colors px-3 py-2 rounded-md hover:bg-[#E4F9FF]"
          >
            Log in
          </Link>
          <Link
            href="/(auth)/register"
            className="text-sm font-medium text-white bg-[#1886FF] hover:bg-[#62D0FF] transition-colors px-4 py-2 rounded-lg shadow-sm"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
