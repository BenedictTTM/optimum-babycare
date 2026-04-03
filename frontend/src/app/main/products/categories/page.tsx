'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { categoryService, Category } from '@/app/accounts/addCategories/lib/categoryService'; // Adjust path if alias not set, but @ usually maps to src
import { Loader2, ArrowLeft, ShoppingBag, Tag } from 'lucide-react';
import Link from 'next/link';

// Helper to format currency (assuming GHS or USD based on context, defaulting to GHS from screenshots)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(price);
};

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await categoryService.fetchCategory(parseInt(categoryId));
        setCategory(data);
      } catch (err: any) {
        console.error('Error fetching category:', err);
        setError(err.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!categoryId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No Category Selected</h2>
        <p className="mt-2 text-gray-600">Please select a category to view.</p>
        <Link href="/main/products" className="mt-6 rounded-lg bg-amber-600 px-6 py-2 text-white hover:bg-amber-700">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!category) {
    return null; // Should be handled by error state, but safe guard
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 md:py-7 lg:py-16">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-gray-600 transition-colors hover:text-amber-600"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Category Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {category.name}
        </h1>
        <div className="mx-auto h-1 w-24 rounded bg-amber-600"></div>
        {category.description && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {category.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <ShoppingBag className="text-amber-600" />
          Featured Items
        </h2>

        {category.products && category.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product: any) => (
              <Link
                key={product.id}
                href={`/main/products/${product.id}`}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image Aspect Ratio Container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {product.imageUrl && product.imageUrl[0] ? (
                    <img
                      src={product.imageUrl[0]}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ShoppingBag size={48} opacity={0.2} />
                    </div>
                  )}
                  {/* Badge */}
                  {product.condition === 'new' && (
                    <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                      NEW
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Tag size={12} />
                    {category.name}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-amber-600">
                    {product.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice > product.discountedPrice && formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    </div>
                    {product.stock <= 0 && (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-16 text-center border border-dashed border-gray-200">
            <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">
              There are no products in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
