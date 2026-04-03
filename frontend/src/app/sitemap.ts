/**
 * Dynamic Sitemap Generation for babylist
 * Implements Next.js 15 App Router sitemap functionality
 * 
 * Features:
 * - Dynamic product URLs
 * - Category pages
 * - Store pages
 * - Static pages
 * - Proper priority and update frequency
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.babylist.com';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Fetch all active products for sitemap
 */
async function getProducts() {
  try {
    const response = await fetch(`${BACKEND_URL}/products?limit=1000&isActive=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[Sitemap] Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch all users for store pages
 */
async function getStores() {
  try {
    const response = await fetch(`${BACKEND_URL}/users?limit=500`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[Sitemap] Error fetching stores:', error);
    return [];
  }
}

/**
 * Fetch all categories for category pages
 */
async function getCategories() {
  try {
    const response = await fetch(`${BACKEND_URL}/categories`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[Sitemap] Error fetching categories:', error);
    return [];
  }
}

/**
 * Check if backend API is available
 * During build time on Vercel, localhost won't be accessible
 */
async function isBackendAvailable(): Promise<boolean> {
  // If BACKEND_URL is not localhost, assume it's available
  if (!BACKEND_URL.includes('localhost') && !BACKEND_URL.includes('127.0.0.1')) {
    return true;
  }

  // During build, localhost won't be available
  // We can detect this by checking if we're in a build environment
  if (process.env.VERCEL_ENV || process.env.CI) {
    return false;
  }

  return true;
}

/**
 * Generate sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static pages (high priority)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/main/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/main/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/main/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];



  // Check if backend is available before fetching dynamic data
  const backendAvailable = await isBackendAvailable();

  let productPages: MetadataRoute.Sitemap = [];
  let storePages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  if (backendAvailable) {
    // Category pages (dynamic)
    const categoryData = await getCategories();
    categoryPages = categoryData.map((cat: any) => ({
      url: `${SITE_URL}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Product pages (dynamic, medium-high priority)
    const products = await getProducts();
    productPages = products.slice(0, 500).map((product: any) => ({
      url: `${SITE_URL}/main/products/${product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Store pages (dynamic, medium priority)
    const stores = await getStores();
    storePages = stores
      .filter((user: any) => user.username)
      .slice(0, 200)
      .map((user: any) => ({
        url: `${SITE_URL}/store/${user.username}`,
        lastModified: user.updatedAt ? new Date(user.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } else {
    console.log('[Sitemap] Backend not available, generating sitemap with static pages only');
  }

  // Combine all pages
  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...storePages,
  ];
}
