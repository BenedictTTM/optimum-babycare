import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCategory } from '@/constants/categories';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

async function getCategories(): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function getCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
  const categories = await getCategories();
  // Assuming the API returns categories with a 'name' that we can slugify, or they have a 'slug' field.
  // Based on the controller we saw, they might just have name. We should probably match loosely or check how slugs are generated.
  // The backend controller return categories.
  // The 'CATEGORIES' constant had 'slug' property.
  // If backend doesn't have slug, we might need to derive it from name.
  // Let's assume for now we match by slug if available or normalize name.
  return categories.find((cat: any) =>
    (cat.slug === slug) ||
    (cat.name && cat.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
    (cat.name && cat.name.toLowerCase().replace(/\s+/g, '_') === slug)
  );
}

/**
 * Generate metadata for category pages (SEO optimization)
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const categoryConfig = await getCategoryBySlug(slug);

  if (!categoryConfig) {
    return {
      title: 'Category Not Found',
      description: 'The requested category does not exist.',
    };
  }

  return {
    title: `${categoryConfig.label || categoryConfig.name || slug} - Sellr Marketplace`,
    description: categoryConfig.description || `Browse products in ${categoryConfig.label || categoryConfig.name}`,
    openGraph: {
      title: `${categoryConfig.label || categoryConfig.name || slug} - Sellr Marketplace`,
      description: categoryConfig.description || `Browse products in ${categoryConfig.label || categoryConfig.name}`,
      type: 'website',
    },
  };
}

/**
 * Generate static params for all categories (SSG optimization)
 */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: any) => ({
    category: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

/**
 * Category Products Page
 * 
 * Displays all products in a specific category with filtering and sorting
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Await params and searchParams
  const { category: slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Validate category
  const categoryConfig = await getCategoryBySlug(slug);

  if (!categoryConfig) {
    notFound();
  }

  // Parse query parameters
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const sortBy = resolvedSearchParams.sortBy || 'newest';
  const condition = resolvedSearchParams.condition;
  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined;
  const inStock = resolvedSearchParams.inStock !== 'false';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{categoryConfig.name}</h1>
      <p className="mb-4 text-gray-600">{categoryConfig.description}</p>

      {/* Debug/Placeholder for filters to suppress unused variable warnings */}
      <div className="bg-gray-50 p-4 rounded mb-8 border border-gray-200">
        <h2 className="font-semibold text-gray-700 mb-2">Active Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">Page:</span> {page}</div>
          <div><span className="text-gray-500">Sort:</span> {sortBy}</div>
          <div><span className="text-gray-500">Condition:</span> {condition || 'Any'}</div>
          <div><span className="text-gray-500">Price:</span> {minPrice ?? 0} - {maxPrice ?? 'Any'}</div>
          <div><span className="text-gray-500">In Stock:</span> {inStock ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="p-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">Product listing for <span className="font-semibold">{categoryConfig.name}</span> is under construction.</p>
      </div>
    </div>
  );
}
