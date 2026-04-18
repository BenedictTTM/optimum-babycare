'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { AuthService } from '@/lib/auth';

interface UseAuthGuardOptions {
  /** Where to redirect unauthenticated users. Defaults to '/auth/login'. */
  redirectTo?: string;
  /** If true, appends `?redirect=<currentPath>` to the redirect URL. */
  preserveRedirect?: boolean;
}

/**
 * Single auth-guard hook for all protected pages.
 *
 * - **Fast-rejects** if no token exists in localStorage (0ms, no network call).
 * - **Deduplicates** `/auth/me` calls via the Zustand store.
 * - Returns the cached user on subsequent navigations (no re-fetch).
 *
 * @example
 * ```tsx
 * export default function ProfilePage() {
 *   const { user, isLoading } = useAuthGuard();
 *   if (isLoading) return <Skeleton />;
 *   if (!user) return null; // redirect in progress
 *   return <ProfileContent user={user} />;
 * }
 * ```
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/auth/login', preserveRedirect = false } = options;
  const router = useRouter();
  const { user, isLoading, fetchUser } = useUserStore();

  useEffect(() => {
    // Fast-reject: no token → instant redirect, no network call
    if (!AuthService.isAuthenticated()) {
      const url = preserveRedirect
        ? `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`
        : redirectTo;
      router.replace(url);
      return;
    }

    // Token exists → hydrate user from store (deduped, cached)
    fetchUser();
  }, [fetchUser, redirectTo, preserveRedirect, router]);

  return { user, isLoading, isAuthenticated: !!user };
}
