import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "babylist Products – Premium Quality Products",
  description:
    "Shop premium products at babylist. We offer high-quality Shawarma wraps, Organic Cranberry Juice, Nutella Biscuits, Cake Mix flour, Spices, and more.",
  keywords:
    "babylist products, buy groceries online, premium food products, shawarma wraps, organic cranberry juice, nutella biscuits, cake mix flour, authentic spices",
  openGraph: {
    title: "babylist – Your No.1 Premium Store",
    description:
      "Discover top-tier products at babylist. From delicious Shawarma wraps to Organic Cranberry Juice, get the best quality items.",
    type: 'website',
    siteName: 'babylist',
  },
  twitter: {
    title: 'babylist – Premium Quality Products',
    description:
      'Shop our flagship products: Shawarma wraps, Cranberry Juice, Nutella Biscuits, Cake Mix, and Spices.',
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
