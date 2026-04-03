'use client';

import React from 'react';
import ProductsCard from './ProductsCard';
import { Product } from '@/types/products';

export type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export type ProductsGridProps = {
  products: Product[];
};

export function SimpleStarRating({ rating = 0, totalReviews = 0, size = 12 }: { rating?: number; totalReviews?: number; size?: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-${size} h-${size} ${i < Math.floor(rating || 0) ? 'text-gray-900' : 'text-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-500">({totalReviews})</span>
    </div>
  );
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 text-center py-12 sm:py-20">
        <p className="text-gray-500 text-sm sm:text-base">No products available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductsCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsCard;

export type { Product };
