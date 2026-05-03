'use client';

import Link from 'next/link';
import { mockCategories } from '@/mocks/products';

/**
 * S-15 — Product Category Browse
 * Route: /(renter)/browse/categories
 */
export default function CategoriesPage() {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'electronics':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'outdoor':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      case 'home & garden':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'sports':
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">Browse Categories</h1>
        <p className="text-[#737373] mt-2">Find exactly what you need by exploring our curated categories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCategories.map((category) => (
          <div 
            key={category.id} 
            className="group bg-white rounded-3xl border border-[#E5E5E5] p-8 hover:border-[#1886FF] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#E4F9FF] text-[#1886FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              {getIcon(category.name)}
            </div>
            
            <h2 className="text-xl font-bold text-[#171717] mb-2">{category.name}</h2>
            <p className="text-sm text-[#737373] mb-8">{category.subCategories.length} Subcategories</p>

            <div className="w-full space-y-2 mb-8">
              {category.subCategories.slice(0, 3).map((sub) => (
                <Link 
                  key={sub}
                  href={`/(renter)/browse?category=${category.name}&sub=${sub}`}
                  className="block py-2 px-4 rounded-xl bg-[#F5F5F5] text-xs font-semibold text-[#737373] hover:bg-[#E4F9FF] hover:text-[#1886FF] transition-all"
                >
                  {sub}
                </Link>
              ))}
              {category.subCategories.length > 3 && (
                <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-wider pt-2">
                  + {category.subCategories.length - 3} More
                </p>
              )}
            </div>

            <Link 
              href={`/(renter)/browse?category=${category.name}`}
              className="mt-auto w-full py-3 rounded-2xl bg-[#171717] text-white text-xs font-black uppercase tracking-widest hover:bg-[#1886FF] transition-all shadow-lg active:scale-95"
            >
              Explore All
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
