'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DotLoader } from '@/Components/Loaders';
import { useUserStore } from '@/store/userStore';
import { AuthService } from '@/lib/auth';

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
 * - Uses Zustand store as single source of truth (no duplicate /auth/me calls)
 * - Fast-rejects unauthenticated users without a network call
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
  const { user, isLoading, fetchUser } = useUserStore();

  useEffect(() => {
    // Fast-reject: no token in localStorage → instant redirect, no network call
    if (!AuthService.isAuthenticated()) {
      const signupUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(signupUrl);
      return;
    }

    // Token exists → hydrate user via store (deduped across all components)
    fetchUser();
  }, [pathname, redirectTo, router, fetchUser]);

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
  if (!user) {
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
