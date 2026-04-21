import React from "react";
import { notFound } from "next/navigation";
import { Product } from "../../../../types/products";
import {
  ShareProduct,
} from "../../../../Components/Products/common";
import {
  ProductGallery,
  ProductHeader,
  ProductInfo,
  ProductOptionsClient,
  ProductDetails,
  ProductReviews,
  ProductActionsClient,
  RelatedProducts,
} from "../../../../Components/Products/details";
import { generateProductSchema, generateBreadcrumbSchema } from "../../../../lib/schemas/productSchemas";
import { MultipleSchemas } from "../../../../Components/Schema";

// Enable static params generation for dynamic routes
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

// Helper function to extract valid image URLs from product
function getValidImages(product: Product): string[] {
  const images: string[] = [];

  // Priority 1: images array from database (each image has { id, url } structure)
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      if (img && typeof img === 'object' && img.url && typeof img.url === 'string') {
        images.push(img.url);
      }
    });
  }

  // Priority 2: imageUrl array (direct string array)
  if (images.length === 0 && product.imageUrl && Array.isArray(product.imageUrl)) {
    product.imageUrl.forEach((url: string) => {
      if (url && typeof url === 'string' && url.trim() !== '') {
        images.push(url);
      }
    });
  }

  // Return valid images or empty array
  return images;
}

// Fetch product data on the server
async function getProduct(productId: string): Promise<Product | null> {
  try {
    // Direct backend call is better for SSR and avoids loopback issues
    const url = `${API_URL}/products/${productId}`;

    console.log(`[SSR] Fetching product ${productId} from: ${url}`);
    console.log(`[SSR] Environment:`, {
      API_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    // Use ISR with revalidate; do NOT mix `cache: 'no-store'` with `next.revalidate`.
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    console.log(`[SSR] Response status: ${response.status}`);

    if (!response.ok) {
      // Read the body once as text, then try to parse JSON safely.
      const text = await response.text();
      let errorData: unknown = text;
      try {
        errorData = JSON.parse(text);
      } catch {
        // leave as text
      }
      console.error(`[SSR] Failed to fetch product ${productId}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return null;
    }

    // Read response once and parse
    const body = await response.json();
    console.log(`[SSR] Response body:`, JSON.stringify(body).substring(0, 200));

    const product = (body && (body.data ?? body)) ?? null;

    if (product) {
      console.log(`[SSR] Product fetched successfully: ${product.title}`);
    } else {
      console.error(`[SSR] Product data is null or undefined`);
    }

    return product;
  } catch (error) {
    console.error(`[SSR] Error fetching product ${productId}:`, error);
    return null;
  }
}


// Generate metadata for SEO (runs on server)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found — babylist',
      description: 'The requested product could not be found.',
    };
  }

  const images = getValidImages(product);

  // Short, keyword-rich title
  const title = `${product.title} — babylist`;

  // 1-2 sentence description for students
  const description = product.description?.substring(0, 150)
    || `${product.title}. ${product.condition || 'Good'} condition. Meet on campus at University of Ghana. Message to haggle.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://babylist.shop';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${id}`,
    },
    openGraph: {
      title: product.title,
      description,
      type: 'website',
      url: `${baseUrl}/products/${id}`,
      images: images.slice(0, 4).map((img) => ({
        url: img,
        width: 800,
        height: 600,
        alt: `${product.title} — campus marketplace`,
      })),
      siteName: 'babylist',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.slice(0, 1),
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch product data on the server - this runs before the page is sent to client
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Pre-calculate data on server
  const images = getValidImages(product);
  const inStock = (product?.stock ?? 0) > 0 && !product?.isSold;
  const sizes =
    product?.tags?.filter((t) =>
      /^(s|m|l|xl|xxl|3xl|4xl|5xl)$/i.test(t)
    ) ?? ["S", "M", "L", "XL", "XXL"];

  // Generate JSON-LD schemas
  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "https://babylist.shop" },
    { name: "Products", url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://babylist.shop"}/products` },
    { name: product.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://babylist.shop"}/products/${id}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <MultipleSchemas schemas={[productSchema, breadcrumbSchema]} />

      {/* Spacer for fixed navbar */}
      <div className="h-10 md:h-12 lg:h-17" aria-hidden="true" />

      <div className="px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12   min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
            {/* Left: Product Gallery - Render immediately */}
            <div className="lg:col-span-1 space-y-4">
              <ProductGallery
                images={images}
                title={product.title}
                selectedImageIndex={0}
              />
              <div className="mt-4 sm:mt-6">
                <ShareProduct />
              </div>
            </div>

            {/* Right: Product Details - Render immediately */}
            <div className="lg:col-span-2 space-y-8">
              {/* Critical above-the-fold content */}
              <ProductHeader product={product} />
              <ProductInfo product={product} inStock={inStock} />

              {/* Interactive elements - render directly (no skeletons) */}
              <ProductOptionsClient sizes={sizes} />

              {/* Client-side interactive actions - render directly (no skeletons) */}
              <ProductActionsClient
                product={product}
                inStock={inStock}
              />

              {/* Non-critical below-the-fold content - render directly (no skeletons) */}
              <ProductDetails product={product} />


              <ProductReviews product={product} />
            </div>
          </div>

          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </div>
    </>
  );
}
