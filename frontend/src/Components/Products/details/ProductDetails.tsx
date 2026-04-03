'use client';

import React, { useState } from "react";
import { Product } from "../../../types/products";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const placeholderImage = "/placeholder-image.png";

  return (
    <section className="mt-4 sm:mt-6 w-full px-3 sm:px-5 lg:px-8 max-w-4xl mx-auto">
      {/* Tabs */}
      <nav className="border-b border-gray-200">
        <ul className="flex flex-wrap gap-3 sm:gap-6">
          {["details", "reviews"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab as "details" | "reviews")}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  }`}
                >
                  {tab === "details" ? "Product Details" : "Reviews"}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-5">
        {activeTab === "details" ? (
          <div className="space-y-5">
            {/* Product Description */}
            <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description ??
                "Discover the Oraimo SpacePods, engineered for immersive sound and comfort. Featuring noise-cancellation, long battery life, and an ergonomic design — perfect for music, calls, and more."}
            </p>

          
          </div>
        ) : (
          /* Reviews Section */
          <div className="text-center py-6 px-3 sm:px-5">
            <p className="text-[11px] sm:text-xs text-gray-700">
              {product.totalReviews || 0} reviews • Average rating{" "}
              <span className="font-semibold text-gray-900">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
            </p>

            {product.totalReviews === 0 && (
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-2">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
