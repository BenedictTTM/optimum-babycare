'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Metadata } from 'next';
import { searchProducts } from '@/services/searchService';
import { useProducts } from '@/hooks/useProducts';
import { SearchResult } from '@/types/search';
import { SlidersHorizontal, Phone, MessageCircle, SearchX } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import ProductCard from '@/Components/Products/cards/ProductCard';
import Link from 'next/link';
import SearchComponent from '@/Components/Header/searchComponent';
import { MultipleSchemas } from '@/Components/Schema';
import {
  generateProductListSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/schemas/productSchemas';


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'relevance';

  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const selectedCategory = category;
  const selectedSort = sortBy;
  const [showFilters, setShowFilters] = useState(false);

  // Fetch recommended products for empty state
  const { data: recommendedData } = useProducts(1, 4);
  const recommendedProducts = recommendedData?.data || [];

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        console.log('🔍 SearchPage: Fetching results for:', {
          query,
          category: selectedCategory,
          sortBy: selectedSort,
          page: currentPage,
        });

        const data = await searchProducts({
          q: query,
          category: selectedCategory || undefined,
          sortBy: selectedSort as any,
          page: currentPage,
          limit: 20,
        });

        console.log('✅ SearchPage: Got data:', {
          total: data.total,
          productsCount: data.products?.length,
          products: data.products,
        });

        setResults(data);

        // Store categories if they exist and we don't have them yet
        /*if (data.filters?.categories && data.filters.categories.length > 0) {
          setAllCategories(data.filters.categories);
        }*/
      } catch (error) {
        console.error('❌ SearchPage: Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCategory, selectedSort, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedSort]);

  // Generate SEO schemas for search results
  const schemas = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sellr.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/search`;

    // Build page title and description based on search
    const pageTitle = query
      ? `Search Results for "${query}" - Sellr`
      : 'Search Products - Sellr';

    const pageDescription = query
      ? `Found ${results?.total || 0} products matching "${query}". ${selectedCategory ? `Category: ${selectedCategory}. ` : ''}Shop the best deals on Sellr.`
      : 'Search for products on Sellr. Find amazing deals on electronics, fashion, home goods, and more.';

    // Build breadcrumb path
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Search', url: '/search' },
    ];

    if (query) {
      breadcrumbs.push({ name: query, url: `/search?q=${encodeURIComponent(query)}` });
    }

    // Critical schemas that load immediately
    const criticalSchemas = [
      // Organization Schema (critical for entity recognition)
      generateOrganizationSchema(
        'Sellr',
        baseUrl,
        `${baseUrl}/logo.png`
      ),

      // Website Schema with SearchAction
      generateWebsiteSchema('Sellr', baseUrl, '/search?q={search_term_string}'),

      // WebPage Schema (critical for page identity)
      generateWebPageSchema(
        pageTitle,
        pageDescription,
        currentUrl
      ),

      // Breadcrumb Schema
      generateBreadcrumbSchema(breadcrumbs, baseUrl),
    ];

    // Deferred schemas (image-heavy)
    const deferredSchemas = [
      // Product List Schema (contains images - deferred)
      ...(results?.products && results.products.length > 0
        ? [generateProductListSchema(results.products as any, baseUrl, 'GHS')]
        : []
      ),
    ];

    return [...criticalSchemas, ...deferredSchemas];
  }, [query, selectedCategory, results]);

  if (isLoading && !results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DotLoader
          size={60}
          color="#2563EB"
          ariaLabel="Searching products"
        />
      </div>
    );
  }

  return (
    <>
      {/* 
        Progressive Schema Loading:
        - Critical schemas (Organization, Website, WebPage, Breadcrumb) load immediately
        - Image-heavy schemas (ProductList) are deferred
        - Dynamic metadata based on search query and results
      */}
      <MultipleSchemas schemas={schemas} deferImageSchemas={true} />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Search Component */}
        <div className="mb-6">
          <SearchComponent />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Search
            </Link>
            {query && (
              <>
                <span>/</span>
                <span className="text-gray-700 font-medium">{query}</span>
              </>
            )}
          </nav>
          <p className="text-gray-600">
            {results?.total || 0} products found
          </p>
        </div>

        <div className="flex gap-6">

          {/* Results */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <DotLoader
                  size={50}
                  color="#2563EB"
                  ariaLabel="Loading results"
                />
              </div>
            ) : results?.products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-3">
                  <SearchX className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find what you were looking for. If you can't find it here,
                  you can contact us directly to check availability.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center px-4">
                  <a
                    href="tel:+233544566921"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm hover:shadow-md active:scale-95 duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Owner</span>
                  </a>
                  <a
                    href="https://wa.me/233544566921"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors font-medium shadow-sm hover:shadow-md active:scale-95 duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Recommended Products Section */}
                {recommendedProducts.length > 0 && (
                  <div className="mt-16 w-full text-left">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 auto-rows-fr text-left">
                      {recommendedProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 auto-rows-fr">
                  {results?.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {results && results.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {results.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(results.totalPages, p + 1))}
                      disabled={currentPage === results.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
