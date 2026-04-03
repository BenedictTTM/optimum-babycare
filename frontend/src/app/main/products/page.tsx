/**
 * Products page component
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  SidebarCategories,
  DiscountBar,
  ProductsGridLayout
} from '@/Components/Products/layouts';
import OfferBanners from '@/Components/Products/cards/offer';

// Lazy-load below-fold sections to prevent white page flash on scroll
const DealOfWeek = dynamic(
  () => import('@/Components/Products/layouts/DealOfWeek'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-[#1a1a1a] animate-pulse" /> }
);

const FeaturedProducts = dynamic(
  () => import('@/Components/Products/layouts/FeaturedProducts'),
  { ssr: false, loading: () => <div className="w-full min-h-[500px] bg-gray-50 animate-pulse rounded-xl" /> }
);
const CategoryShop = dynamic(
  () => import('@/Components/Products/layouts/CategoryShop'),
  { ssr: false, loading: () => <div className="w-full min-h-[300px] bg-gray-50 animate-pulse rounded-xl" /> }
);
const BrandSlider = dynamic(
  () => import('@/Components/Products/layouts/BrandSlider'),
  { ssr: false, loading: () => <div className="w-full min-h-[180px] bg-[#991b1b] animate-pulse" /> }
);
const BlogInsights = dynamic(
  () => import('@/Components/Products/layouts/BlogInsights'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-gray-50 animate-pulse rounded-xl" /> }
);
const FooterFeatures = dynamic(
  () => import('@/Components/Products/layouts/FooterFeatures'),
  { ssr: false, loading: () => <div className="w-full min-h-[140px] bg-gray-50 animate-pulse rounded-xl" /> }
);
const TopListedItems = dynamic(
  () => import('@/Components/Products/layouts/toplisted'),
  { ssr: false, loading: () => <div className="w-full min-h-[400px] bg-gray-50 animate-pulse rounded-xl" /> }
);

import HeroSlider from '@/Components/Hero/slider';
import PromotionalCards from '@/Components/Products/cards/PromotionalCards';


interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
}



const CONFIG = {
  INITIAL_PRODUCTS_DISPLAY: 8,
  API: {
    PRODUCTS: '/products',
  },
  RETRY_DELAY: 3000,
} as const;

const ServiceFeaturesSkeleton = () => (
  <div className="w-full py-16 px-4" aria-hidden="true">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`service-skeleton-${index}`} className="flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-6" />
            <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    </div>
  </div>
);



import { apiClient } from '../../../api/clients';



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
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: 'All Categories',
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    rating: 0,
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const { ref, inView } = useInView();

  useEffect(() => {
    // Only fetch next page if showAllProducts is true (infinite scroll mode)
    // or if we have less than initial display and more exist.
    const shouldFetch = inView && hasNextPage && (showAllProducts || products.length < CONFIG.INITIAL_PRODUCTS_DISPLAY);
    if (shouldFetch) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, showAllProducts, products.length]);

  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load products') : null;

  const toggleViewAll = useCallback(() => {
    setShowAllProducts(prev => !prev);
  }, []);

  // Consolidate filtering logic into a single memo to reduce redundant work
  const { filteredProducts, totalFilteredCount } = useMemo(() => {
    const filtered = applyProductFilters(products, activeFilters);
    return {
      filteredProducts: filtered,
      totalFilteredCount: filtered.length
    };
  }, [products, activeFilters]);

  const displayProducts = useMemo(() => {
    return showAllProducts
      ? filteredProducts
      : filteredProducts.slice(0, CONFIG.INITIAL_PRODUCTS_DISPLAY);
  }, [filteredProducts, showAllProducts]);



  const shouldShowViewAllButton = totalFilteredCount > CONFIG.INITIAL_PRODUCTS_DISPLAY;

  // Stabilize SEO schemas: Only recalculate when the initial products load or significant filters change.
  // We dont need to update SEO tags on every incremental infinite scroll page.
  const schemas = useMemo(() => {
    // Optimization: If we have many products, SEO bots usually only care about the first set
    const seoProducts = displayProducts.slice(0, 20);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sellr.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/main/products`;

    // Critical schemas that must load immediately (no images)
    const criticalSchemas = [
      // Organization Schema (critical for entity recognition)
      generateOrganizationSchema(
        'Sellr',
        baseUrl,
        `${baseUrl}/logo.png`
      ),

      // Website Schema with SearchAction (critical for search)
      generateWebsiteSchema('Sellr', baseUrl, '/search?q={search_term_string}'),

      // WebPage Schema (critical for page identity)
      generateWebPageSchema(
        'Browse Products - Sellr',
        'Discover amazing products with great deals and flash sales. Shop electronics, fashion, home goods, and more.',
        currentUrl
      ),

      // Breadcrumb Schema (high priority for navigation)
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/main/products' },
      ], baseUrl),
    ];

    // Deferred schemas (image-heavy, will lazy load)
    const deferredSchemas = [
      // Product List Schema (contains images - deferred)
      ...(seoProducts.length > 0 ? [generateProductListSchema(seoProducts, baseUrl, 'GHS')] : []),
    ];

    // Combine all schemas (MultipleSchemas will handle prioritization)
    return [...criticalSchemas, ...deferredSchemas];
  }, [displayProducts]);


  // If a products fetch error occurred, throw to Next.js route error boundary
  // so that app/error.tsx renders instead of an inline fallback.
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <MultipleSchemas schemas={schemas} deferImageSchemas={true} />

      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="mt-0 pb-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row ">
            <div className="hidden lg:block">
              <SidebarCategories />
            </div>
            <div className="flex-1 w-full min-w-0">
              <HeroSlider />
            
            </div>
          </div>
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
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-amber-500">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="text-amber-500 font-medium text-lg">Featured</span>
                      <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-amber-500">
                        <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-wider uppercase mb-8">
                      Get Your Fashion Style
                    </h2>

                    {/* Filter Tabs */}
                    <div className="flex items-center justify-center gap-4 text-base font-semibold">
                      <button className="text-amber-500 hover:text-amber-600 transition-colors">Latest</button>
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
        
        <section aria-labelledby="offer-heading" className="w-full py-16 px-4 max-w-7xl mx-auto">
            <div className="mb-10 text-center px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                  <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-[#FF4A3B] font-medium text-lg">Featured</span>
                <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="text-[#FF4A3B]">
                  <path d="M2 5C6 1 10 9 14 5C18 1 22 9 26 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-wider uppercase mb-8">
                Get Your Fashion Style
              </h2>
            </div>
            <OfferBanners />
        </section>

        <TopListedItems />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 flex flex-col gap-12">
          <DealOfWeek />
          <FeaturedProducts />
          <CategoryShop />
        </div>

        <BrandSlider />
        <BlogInsights />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-20">
          <FooterFeatures />
        </div>

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
