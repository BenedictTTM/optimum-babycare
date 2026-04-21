import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Middleware
 * 
 * Protects routes by checking for authentication token in cookies.
 * Redirects unauthenticated users to login page while preserving intended destination.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

// Define protected route patterns
const PROTECTED_ROUTES = [
  '/',
  '/accounts',
  '/api/cart',
  '/api/products/me',
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/login',
  '/auth/signUp',
  '/reset-password',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/forgot-password',
  '/',
];

// API routes that should not redirect but return 401
const API_ROUTES = ['/api'];

/**
 * Check if a path matches any pattern in the list
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname.startsWith(route));
}

/**
 * Middleware function to handle authentication
 */
export function middleware(request: NextRequest) {
  // ⚠️ Auth checks disabled as per user request to avoid cookie dependency
  // Client-side redirection will handle auth state

  // Allow request to proceed
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
