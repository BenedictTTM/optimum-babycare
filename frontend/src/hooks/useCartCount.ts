/**
 * useCartCount Hook
 * 
 * Custom hook for managing cart count state with:
 * - Automatic polling for real-time updates
 * - Fallback to local storage for anonymous users
 * - Optimistic UI updates
 * - Animation triggers for visual feedback
 * 
 * @module useCartCount
 * @since 1.0.0
 */

import { useEffect, useState, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';

interface UseCartCountReturn {
  itemCount: number;
  isLoading: boolean;
  shouldPulse: boolean;
  refreshCount: () => Promise<void>;
}

/**
 * Hook for managing cart item count with automatic updates
 * 
 * Features:
 * - Fetches count on mount
 * - Polls every 30 seconds
 * - Triggers pulse animation when count increases
 * - Works for both authenticated and anonymous users
 * 
 * @param options - Configuration options
 * @param options.pollInterval - Polling interval in ms (default: 30000)
 * @param options.enablePulse - Enable pulse animation on count increase (default: true)
 * 
 * @returns Cart count state and controls
 * 
 * @example
 * ```tsx
 * function CartBadge() {
 *   const { itemCount, shouldPulse } = useCartCount();
 *   
 *   return (
 *     <div className={shouldPulse ? 'animate-bounce' : ''}>
 *       {itemCount}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCartCount(options?: {
  pollInterval?: number;
  enablePulse?: boolean;
}): UseCartCountReturn {
  const {
    pollInterval = 30000,
    enablePulse = true,
  } = options || {};

  const itemCount = useCartStore((state) => state.itemCount);
  const fetchItemCount = useCartStore((state) => state.fetchItemCount);
  
  const [isLoading, setIsLoading] = useState(true);
  const [prevCount, setPrevCount] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Refresh cart count manually
  const refreshCount = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchItemCount();
    } finally {
      setIsLoading(false);
    }
  }, [fetchItemCount]);

  // Initial fetch on mount
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Set up polling for automatic updates
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(refreshCount, pollInterval);
    
    return () => clearInterval(interval);
  }, [pollInterval, refreshCount]);

  // Trigger pulse animation when count increases
  useEffect(() => {
    if (!enablePulse) return;

    if (itemCount > prevCount && prevCount > 0) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    
    setPrevCount(itemCount);
  }, [itemCount, prevCount, enablePulse]);

  return {
    itemCount,
    isLoading,
    shouldPulse,
    refreshCount,
  };
}
