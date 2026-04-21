'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../../types/products';
import AddToCartButton from '../../Cart/AddToCartButton';

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
      <Link href={`/products/${product.id}`} className="block flex-grow flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5] rounded-sm">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discountPercentage > 20 && (
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

        <div className="pt-4 px-3 flex flex-col flex-grow justify-between bg-white text-left">
          <div>
            <h3 className="font-medium text-[13px] text-gray-900 mb-2 leading-snug">
              {product.title}
            </h3>

            <div className="flex items-center gap-1.5 md:mb-2.5 mb-1">
              <span className="text-[12px] text-gray-500 font-medium">
                ({product.totalReviews || 0})
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="md:text-lg sm:text-sm  font-bold text-gray-900">${price.toFixed(2)}</span>
                {/* {originalPrice && (
                  <span className="text-[12px] text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                )} */}
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <AddToCartButton
                  productId={product.id}
                  quantity={1}
                  variant="cart-icon"
                  productData={product}
                  className="w-10 h-10 rounded-xl bg-[#111827] text-white hover:bg-black flex justify-center items-center shadow-md active:scale-95"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
