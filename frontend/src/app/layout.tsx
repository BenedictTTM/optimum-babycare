import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/Components/Toast/toast";
import ReactQueryProvider from "@/Components/Providers/ReactQueryProvider";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// SEO Metadata — babylist Hair e-commerce
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
    type: "website",
    siteName: "babylist",
  },
  twitter: {
    title: "babylist – Premium Quality Products",
    description:
      "Shop our flagship products: Shawarma wraps, Cranberry Juice, Nutella Biscuits, Cake Mix, and Spices.",
    card: "summary_large_image",
  },
  // keep basic sensible defaults from previous config
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${poppins.className} antialiased font-sans bg-background text-text-primary`}>
        <ReactQueryProvider>
          {children}
          {/* Keep ToastProvider at root level for global notifications */}
          <ToastProvider
            position="top-right"
            richColors={true}
            closeButton={true}
            expand={true}
            duration={3000}
            theme="light"
          />
       
        </ReactQueryProvider>

        {/* Google Analytics (GA4) - Only in production */}
        {isProd && gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}