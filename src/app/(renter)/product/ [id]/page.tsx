import { mockProducts } from '@/mocks/products';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/product/ImageGallery';
import { PricingTable } from '@/components/product/PricingTable';
import { BookingCTA } from '@/components/product/BookingCTA';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * S-03 — Product Detail Page
 * Route: /(renter)/product/[id]
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // PHASE4-SWAP: Replace with real product fetch
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
        <Link href="/(renter)/browse" className="hover:text-[#1886FF]">Browse</Link>
        <span>/</span>
        <Link href={`/(renter)/browse?category=${product.category}`} className="hover:text-[#1886FF]">{product.category}</Link>
        <span>/</span>
        <span className="text-[#171717]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-7 space-y-12">
          <ImageGallery images={product.images} />

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#171717] tracking-tight">Description</h2>
            <p className="text-[#737373] leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* Lister Info */}
          <section className="p-8 rounded-3xl bg-[#F5F5F5] flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#E5E5E5]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1886FF] text-white flex items-center justify-center text-xl font-black">
                {product.lister.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#171717]">Listed by {product.lister.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-sm font-bold text-[#171717]">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.lister.rating}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[#E5E5E5]" />
                  <span className="text-sm text-[#737373]">{product.lister.totalRentals} Rentals</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl border-2 border-[#171717] text-xs font-black uppercase tracking-widest hover:bg-[#171717] hover:text-white transition-all">
              Contact Lister
            </button>
          </section>

          {/* Pricing Info (Redundant but good for SEO/Mobile) */}
          <section className="lg:hidden">
            <PricingTable pricing={product.pricing} />
          </section>
        </div>

        {/* Right Column: Sticky Booking CTA */}
        <div className="lg:col-span-5 space-y-8">
          <div className="hidden lg:block">
            <BookingCTA product={product} />
          </div>
          
          <PricingTable pricing={product.pricing} />

          {/* Security & Features */}
          <div className="p-6 rounded-2xl border border-[#E5E5E5] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#171717]">Verified Lister</p>
                <p className="text-[10px] text-[#737373]">Identity & equipment quality checked</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#171717]">Secure Deposit</p>
                <p className="text-[10px] text-[#737373]">Refunded instantly upon safe return</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
