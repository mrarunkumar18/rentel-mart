'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/(renter)/dashboard', icon: 'dashboard' },
  { label: 'Browse', href: '/(renter)/browse', icon: 'search' },
  { label: 'My Orders', href: '/(renter)/orders', icon: 'package' },
  { label: 'My Cart', href: '/(renter)/cart', icon: 'cart' },
  { label: 'My Listings', href: '/(lister)/listings', icon: 'list' },
  { label: 'Requests', href: '/(lister)/requests', icon: 'inbox' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'dashboard':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'search':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'package':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v10l-8 4m16-14l-8 4" />
          </svg>
        );
      case 'cart':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'list':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'inbox':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3.586 3.586a2 2 0 01-2.828 0L6 13m14 0h-3m-7 0H7m0 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      className={`bg-white border-r border-[#E5E5E5] transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex h-[calc(100vh-64px)] sticky top-16`}
    >
      <div className="flex-1 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.replace('(', '').replace(')', ''));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#E4F9FF] text-[#1886FF] font-semibold'
                  : 'text-[#737373] hover:bg-[#F5F5F5] hover:text-[#171717]'
              }`}
            >
              <span className={isActive ? 'text-[#1886FF]' : 'text-[#737373]'}>
                {getIcon(item.icon)}
              </span>
              {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#E5E5E5]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full py-2 text-[#737373] hover:text-[#1886FF] hover:bg-[#F5F5F5] rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
