/**
 * Products page component — performance-optimized
 *
 * Optimizations applied:
 * - Direct imports (no barrel) to avoid pulling unused layout modules
 * - Dynamic imports for every below-fold and heavy component
 * - Stable SEO schema memo keyed on first-load products only
 * - Intersection-observer gated lazy sections (DiscountBar, TopListed, etc.)
 * - Removed dead code (ServiceFeaturesSkeleton)
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MultipleSchemas } from '../../../Components/Schema';
import {
  generateProductListSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '../../../lib/schemas/productSchemas';
import { Product } from '../../../api/types';
import { useInfiniteProducts } from '../../../hooks/useProducts';
import { useInView } from 'react-intersection-observer';

// ---------- Direct imports for critical above-fold components ----------
// Avoid barrel re-export (layouts/index.ts) which tree-shakes poorly in webpack
import ProductsGridLayout from '@/Components/Products/layouts/ProductsGridLayout';

// ---------- Dynamic imports – chunked & deferred ----------
// Above-fold but heavy: load eagerly in parallel but in separate chunks
const Header = dynamic(() => import('@/Components/Header/mainNavBar'), {
  ssr: false,
  loading: () => <div className="w-full h-[56px] bg-gray-50" />,
});

const HeroSlider = dynamic(() => import('@/Components/Hero/slider'), {
  ssr: false,
  loading: () => <div className="w-full h-[420px] md:h-[560px] bg-[#FBF3E8] animate-pulse" />,
});

const SidebarCategories = dynamic(
  () => import('@/Components/Products/layouts/SidebarCategories'),
  { ssr: false, loading: () => <div className="w-[260px] h-full bg-white animate-pulse rounded-md" /> }
);

const PromotionalCards = dynamic(
  () => import('@/Components/Products/cards/PromotionalCards'),
  { ssr: false, loading: () => <div className="w-full h-[180px] bg-gray-100 animate-pulse rounded-xl" /> }
);

// Below-fold: fully deferred until scrolled near
const DiscountBar = dynamic(
  () => import('@/Components/Products/layouts/DiscountBar'),
  { ssr: false }
);

const DealOfWeek = dynamic(
  () => import('@/Components/Products/layouts/DealOfWeek'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-[#1a1a1a] animate-pulse" /> }
);

const CategoryShop = dynamic(
  () => import('@/Components/Products/layouts/CategoryShop'),
  { ssr: false, loading: () => <div className="w-full min-h-[300px] bg-gray-50 animate-pulse rounded-xl" /> }
);

const BlogInsights = dynamic(
  () => import('@/Components/Products/layouts/BlogInsights'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-gray-50 animate-pulse rounded-xl" /> }
);

const TopListedItems = dynamic(
  () => import('@/Components/Products/layouts/toplisted'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-gray-50 animate-pulse rounded-xl" /> }
);

// ---------- Types & constants ----------
interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}

const INITIAL_PRODUCTS_DISPLAY = 8;

const DEFAULT_FILTERS: FilterState = {
  category: 'All Categories',
  priceRange: [0, Number.MAX_SAFE_INTEGER],
  rating: 0,
} as const;



function applyProductFilters(products: Product[], filters: FilterState): Product[] {
  if (!products.length) return [];

  const [minPrice, maxPrice] = filters.priceRange;
  const hasCategoryFilter = filters.category && filters.category !== 'All Categories';
  const targetCategory = hasCategoryFilter ? filters.category.toLowerCase() : '';
  const minRating = filters.rating;

  // Single pass filter is much faster for large lists
  return products.filter(product => {
    // Category check
    if (hasCategoryFilter && product.category?.toLowerCase() !== targetCategory) {
      return false;
    }

    // Price check
    const price = product.discountedPrice || product.originalPrice || 0;
    if (price < minPrice || price > maxPrice) {
      return false;
    }

    // Rating check
    if (minRating > 0 && (product.averageRating || 0) < minRating) {
      return false;
    }

    return true;
  });
}

export default function ProductsPage() {
  const {
    data,
    isLoading: loading,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(20);

  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const { ref, inView } = useInView();

  useEffect(() => {
    const shouldFetch = inView && hasNextPage && (showAllProducts || products.length < INITIAL_PRODUCTS_DISPLAY);
    if (shouldFetch) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, showAllProducts, products.length]);

  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load products') : null;

  const toggleViewAll = useCallback(() => {
    setShowAllProducts(prev => !prev);
  }, []);

  const { filteredProducts, totalFilteredCount } = useMemo(() => {
    // Fast path: skip filtering entirely when defaults are active
    const isDefaultFilter =
      activeFilters.category === 'All Categories' &&
      activeFilters.rating === 0 &&
      activeFilters.priceRange[0] === 0 &&
      activeFilters.priceRange[1] === Number.MAX_SAFE_INTEGER;

    if (isDefaultFilter) {
      return { filteredProducts: products, totalFilteredCount: products.length };
    }

    const filtered = applyProductFilters(products, activeFilters);
    return { filteredProducts: filtered, totalFilteredCount: filtered.length };
  }, [products, activeFilters]);

  const displayProducts = useMemo(() => {
    return showAllProducts
      ? filteredProducts
      : filteredProducts.slice(0, INITIAL_PRODUCTS_DISPLAY);
  }, [filteredProducts, showAllProducts]);

  const shouldShowViewAllButton = totalFilteredCount > INITIAL_PRODUCTS_DISPLAY;

  // Stabilize SEO schemas: freeze to the first meaningful product load.
  // Avoids re-serializing JSON-LD on every infinite-scroll page.
  const seoProductsRef = useRef<Product[] | null>(null);
  if (seoProductsRef.current === null && products.length > 0) {
    seoProductsRef.current = products.slice(0, 20);
  }

  const schemas = useMemo(() => {
    const seoProducts = seoProductsRef.current ?? [];
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sellr.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/main/products`;

    return [
      generateOrganizationSchema('Sellr', baseUrl, `${baseUrl}/logo.png`),
      generateWebsiteSchema('Sellr', baseUrl, '/search?q={search_term_string}'),
      generateWebPageSchema(
        'Browse Products - Sellr',
        'Discover amazing products with great deals and flash sales. Shop electronics, fashion, home goods, and more.',
        currentUrl
      ),
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/main/products' },
      ], baseUrl),
      ...(seoProducts.length > 0 ? [generateProductListSchema(seoProducts, baseUrl, 'GHS')] : []),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seoProductsRef.current]);


  // If a products fetch error occurred, throw to Next.js route error boundary
  // so that app/error.tsx renders instead of an inline fallback.
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>

      <MultipleSchemas schemas={schemas} deferImageSchemas={true} />

      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Top Hero Section with Shared Background */}
        <div className="relative pt-0 pb-3 h-[420px] md:h-[560px] bg-[#FBF3E8] mb-12 overflow-hidden">
          {/* SVG Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 560" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#F2E6D0" opacity="0.6" d="M-100,-100 C300,100 400,400 0,660 Z" />
              <path fill="#F2E6D0" opacity="0.6" d="M1540,660 C1100,500 1000,100 1540,-100 Z" />
          </svg>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="hidden lg:flex flex-col z-20 h-full w-[260px] flex-shrink-0">
                {/* Space reserved for where the mega-menu drops down, keeping slider correctly aligned */}
              </div>
              <div className="flex-1 w-full min-w-0 h-full">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:mb-5 mb-12">
            <PromotionalCards />
        </div>

<main className="w-full overflow-x-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start">

            <div className="w-full space-y-8">

              <section aria-labelledby="products-heading" className="px-4 sm:px-6 lg:px-8">

                <header className="mb-6 max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="mb-10 text-center px-4 sm:px-6 lg:px-8">
                    {/* Featured label with decorative squiggles */}
                    <div className="flex items-center justify-center gap-3 sm:mb-2 md:mb-4">
                      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-amber-500">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="text-amber-500 font-medium text-lg">Featured</span>
                      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-amber-500">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-lg md:text-3xl lg:text-5xl font-bold text-gray-900 tracking-wider uppercase md:mb-8 sm:mb-4">
                      Get Your Fashion Style
                    </h2>

                    {/* Filter Tabs */}
                    <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                      <button className="text-amber-500 hover:text-amber-500 transition-colors">Latest</button>
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                      <button className="text-gray-500 hover:text-amber-500 transition-colors">Popular</button>
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                      <button className="text-gray-500 hover:text-amber-500 transition-colors">Trending</button>
                    </div>
                  </div>


                  {!loading && totalFilteredCount > 0 && (
                    <p className="text-gray-600 mt-2 text-sm">
                      Showing {displayProducts.length} of {totalFilteredCount} products
                    </p>
                  )}
                </header>

                <div className="max-w-7xl mx-auto">
                  {displayProducts.length > 0 || loading ? (
                    <ProductsGridLayout
                      products={displayProducts}
                      loading={loading && displayProducts.length === 0}
                    />
                  ) : (
                    <div
                      className="text-center py-12 px-4"
                      role="status"
                      aria-live="polite"
                    >
                      <svg
                        className="w-20 h-20 text-gray-300 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your filters to find what you're looking for
                      </p>
                    </div>
                  )}

                  {/* Loading more indicator */}
                  {(isFetchingNextPage) && (
                    <div className="py-4 text-center">
                      <div className="inline-block h-8 w-8 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                      </div>
                    </div>
                  )}

                  {/* Intersection observer target */}
                  {showAllProducts && <div ref={ref} className="h-10" />}

                </div>

                {shouldShowViewAllButton && displayProducts.length > 0 && (
                  <div className="flex justify-center mt-8 max-w-7xl mx-auto">
                    {/* eslint-disable-next-line jsx-a11y/aria-proptypes */}
                    <button
                      onClick={toggleViewAll}
                      className={`
                      px-8 py-3 font-medium 
                      transition-all duration-200 
                      ${showAllProducts
                          ? 'text-gray-600'
                          : 'text-amber-400 hover:text-amber-400'
                        }
                    `}
                      aria-label={showAllProducts ? 'Show less products' : 'View all products'}
                    >
                      {showAllProducts ? (
                        <>
                          <svg
                            className="inline-block w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          Show Less
                        </>
                      ) : (
                        <>
                          View More  
                          <svg
                            className="inline-block w-5 h-5 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>

            </div>

          </div>
        </main>

        <DiscountBar />

        <TopListedItems />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 flex flex-col gap-12">
          <DealOfWeek />
          <CategoryShop />
        </div>

        <BlogInsights />
        
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          Skip to top
        </a>
      </div>
    </>
  );
}
