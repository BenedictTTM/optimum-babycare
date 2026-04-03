'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DotLoader } from '@/Components/Loaders';
import { apiClient } from '@/api/clients';

/**
 * ProtectedRoute Component
 * 
 * Client-side authentication guard that wraps protected pages.
 * Provides loading state while checking authentication.
 * Redirects to login if user is not authenticated.
 * 
 * Best Practices:
 * - Works with middleware for defense-in-depth
 * - Shows loading state during auth check
 * - Preserves intended destination in redirect URL
 * - Handles session expiry gracefully
 * 
 * @example
 * ```tsx
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <YourPageContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/auth/signUp',
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call session check endpoint

      await apiClient.get('/auth/me');

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      // Redirect on error (network issue, etc.)
      const signupUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(signupUrl);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, redirectTo, router]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <DotLoader size={48} color="#E43C3C" ariaLabel="Verifying authentication" />
            <p className="text-gray-600 font-medium">Please wait</p>
          </div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Higher-Order Component (HOC) version for wrapping page components
 * 
 * @example
 * ```tsx
 * export default withAuth(DashboardPage);
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string }
) {
  return function WithAuthComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={options?.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
