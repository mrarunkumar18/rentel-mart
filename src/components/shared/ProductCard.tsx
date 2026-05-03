import { Product } from '@/mocks/products';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  const conditionLabels = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair'
  };

  return (
    <Link 
      href={`/(renter)/product/${product.id}`}
      className="group bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status/Condition Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#171717] uppercase tracking-wider shadow-sm">
            {conditionLabels[product.condition]}
          </span>
          {product.status === 'rented' && (
            <span className="px-2.5 py-1 rounded-lg bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Rented
            </span>
          )}
        </div>
        {/* Wishlist Button Placeholder */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#737373] hover:text-[#EF4444] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[10px] font-bold text-[#1886FF] uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-[#171717]">
            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.lister.rating}
          </div>
        </div>
        
        <h3 className="text-sm font-bold text-[#171717] line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        <div className="mt-auto pt-3 border-t border-[#E5E5E5] flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#737373]">Starts from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#171717]">₹{product.pricing.perDay}</span>
              <span className="text-[10px] text-[#737373]">/ day</span>
            </div>
          </div>
          
          <div className="text-[10px] font-semibold text-[#1886FF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View Details
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
