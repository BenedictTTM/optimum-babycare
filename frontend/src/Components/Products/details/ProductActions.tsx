'use client';

import React from "react";
import { useRouter } from "next/navigation";
import QuantitySelector from "../common/QuantitySelector";
import AddToCartButton from "../../Cart/AddToCartButton";

interface ProductActionsProps {
  productId: number;
  quantity: number;
  maxQuantity?: number;
  inStock: boolean;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart?: () => void;
  productData?: any; // Full product data for local storage cart
}

export default function ProductActions({
  productId,
  quantity,
  maxQuantity,
  inStock,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
  productData,
}: ProductActionsProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    if (!inStock) return;
    router.push(`/checkout?productId=${productId}&quantity=${quantity}`);
  };

  return (
    <section className="mt-8 w-full px-2 sm:px-4 md:px-6 space-y-5 sm:space-y-6">
      {/* Quantity Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
            Quantity:
          </label>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={maxQuantity}
            onIncrease={onIncreaseQuantity}
            onDecrease={onDecreaseQuantity}
          />
          {maxQuantity && maxQuantity > 0 && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              ({maxQuantity} available)
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {inStock ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <AddToCartButton
            productId={productId}
            quantity={quantity}
            variant="default"
            productData={productData}
            onSuccess={() => {
              console.log(`✅ Added ${quantity} item(s) to cart`);
              onAddToCart?.();
            }}
            onError={(msg) => {
              console.error("❌ Add to cart failed:", msg);
              alert(`Failed to add to cart: ${msg}`);
            }}
            className="w-full sm:flex-1 py-2 sm:py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
          />

          <a
            href={`tel:${'0544566921'}`}
            title="Call seller to buy"
            aria-label="Call seller to buy"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 text-amber-400 hover:text-red-700 text-sm font-semibold rounded-lg  transition-all hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l.7 2.11a2 2 0 01-.45 2.05L8.91 11.09a16.06 16.06 0 007 7l2.51-1.02a2 2 0 012.05-.45l2.11.7A2 2 0 0121 17.72V21a2 2 0 01-2 2A19 19 0 013 5z" />
            </svg>
            Call to buy
          </a>
        </div>
      ) : (
        <button
          disabled
          className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-6 py-2 sm:py-2.5 bg-gray-300 text-white text-sm font-semibold rounded-lg cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </section>
  );
}
