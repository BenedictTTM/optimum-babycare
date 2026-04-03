'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../../types/products';

interface ProductsCardProps {
  product: Product;
}

export default function ProductsCard({ product }: ProductsCardProps) {
  const price = product.discountedPrice || product.originalPrice;
  const originalPrice = product.discountedPrice ? product.originalPrice : null;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const imageUrl = product.imageUrl?.[0] || product.images?.[0] || '/placeholder-product.jpg';

  return (
    <div className="group flex flex-col h-full bg-white relative">
      <button
        aria-label="Add to cart"
        className="absolute left-3 top-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md z-30 border border-gray-100"
      >
        <svg className="w-4 h-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>

      <Link href={`/main/products/${product.id}`} className="block flex-grow flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5] rounded-sm">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-12 bg-[#FF4545] text-white px-2 py-0.5 rounded-sm text-[10px] font-bold z-10 tracking-wider">
              -{discountPercentage}%
            </div>
          )}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold z-10 tracking-wider">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="text-gray-900 font-bold tracking-wider uppercase text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col flex-grow justify-between bg-white text-left">
          <div>
            <h3 className="font-medium text-[13px] text-gray-900 mb-2 leading-snug">
              {product.title}
            </h3>

            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'text-gray-900 fill-current'
                        : 'text-gray-200 fill-current'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[12px] text-gray-500 font-medium">
                ({product.totalReviews || 0})
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-3">
              <span className="text-[18px] font-bold text-gray-900">${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-[13px] font-medium text-gray-400 line-through decoration-gray-400">${originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
