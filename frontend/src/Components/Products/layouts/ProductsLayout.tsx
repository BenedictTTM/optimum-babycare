'use client';

import React from 'react';
import { useProducts } from '../../../hooks/useProducts';
import ProductsGridLayout from './ProductsGridLayout';

interface ProductsLayoutProps {
  page?: number;
  limit?: number;
}

export default function ProductsLayout({ page = 1, limit = 20 }: ProductsLayoutProps) {
  const { data, isLoading, error } = useProducts(page, limit);

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (error) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-20 h-20 text-red-300 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProductsGridLayout products={products} loading={isLoading} />

      {pagination && pagination.hasNextPage && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>
      )}
    </div>
  );
}
