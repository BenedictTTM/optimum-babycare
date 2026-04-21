'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { DotLoader } from '@/Components/Loaders';
import { addToCart } from '@/lib/cart';
import { addToLocalCart } from '@/lib/localCart';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/Components/Toast/toast';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  variant?: 'default' | 'icon' | 'small' | 'cart-icon';
  className?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  productData?: any; // Full product data for local storage (used when not authenticated)
}

/**
 * Improved AddToCartButton
 * - Supports both authenticated and anonymous users
 * - Authenticated: Adds to server cart
 * - Anonymous: Adds to local storage cart
 * - Prevents multi-line text wrapping
 * - Uses gradient background, smooth hover, and consistent sizing
 * - Shows loader and success feedback
 */
export default function AddToCartButton({
  productId,
  quantity = 1,
  variant = 'default',
  className = '',
  onSuccess,
  onError,
  productData,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const fetchItemCount = useCartStore((state) => state.fetchItemCount);
  const incrementCount = useCartStore((state) => state.incrementCount);
  const rollbackCountRef = useRef<number | null>(null);
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async () => {
    // Prevent duplicate spamming while optimistic state is visible
    if (success) return;

    // 1. Optimistic Update: Update UI & Global State Immediately
    const prevCount = useCartStore.getState().itemCount;
    incrementCount(quantity);
    setSuccess(true);

    // Show success toast
    const productName = productData?.name || 'Product';
    showSuccess(`${productName} added to cart`, {
      description: quantity > 1 ? `${quantity} items added` : undefined,
    });

    // Auto-revert the success icon/text after 2 seconds for a seamless loop
    const successTimeout = setTimeout(() => setSuccess(false), 2000);

    const idempotencyKey = (globalThis as any)?.crypto?.randomUUID
      ? (globalThis as any).crypto.randomUUID()
      : `${Date.now()}-${productId}-${Math.random().toString(36).slice(2)}`;

    // 2. Background Async Request (Fire and Reconcile)
    try {
      const result = await addToCart(productId, quantity, { idempotencyKey });

      if (result.success) {
        // Success: silently verify real server count in background
        fetchItemCount();
        onSuccess?.();
      } else if (result.statusCode === 401) {
        // Anonymous fallback
        if (!productData) throw new Error('Product data is required for local cart');
        addToLocalCart(productData, quantity);
        fetchItemCount();
        onSuccess?.();
      } else {
        throw new Error(result.message || 'Failed to add to remote cart');
      }
    } catch (error: any) {
      // 3. Graceful Rollback on Failure
      console.error('Optimistic Cart Add Failed. Rolling back:', error);

      // Revert the global counter
      useCartStore.getState().setItemCount(prevCount);

      // Immediately revert the button UI
      clearTimeout(successTimeout);
      setSuccess(false);

      // Notify the user of the failure so they understand the rollback
      const errorMessage = error?.message || 'Network error. Failed to add item.';
      showError(errorMessage);
      onError?.(errorMessage);
    }
  };

  // Shared base styles
  const baseStyle = `
    flex items-center justify-center gap-2 
    font-semibold text-white rounded-xl md:rounded-2xl 
    transition-all duration-300 shadow-sm 
    hover:shadow-md hover:-translate-y-0.5 
    disabled:opacity-50 disabled:cursor-not-allowed 
    whitespace-nowrap
  `;

  // 🔘 Icon-only button (circular + style)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Add to cart"
      >
        {loading ? (
          <DotLoader size={16} ariaLabel="Adding to cart" />
        ) : success ? (
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        ) : (
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" strokeWidth={1.5} />
        )}
      </button>
    );
  }

  // � Cart Icon-only variant
  if (variant === 'cart-icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Add to cart"
      >
        {loading ? (
          <DotLoader size={18} ariaLabel="Adding to cart" />
        ) : success ? (
          <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
        ) : (
          <MdOutlineAddShoppingCart className="h-2 w-3 sm:h-5 sm:w-5" />
        )}
      </button>
    );
  }

  // �🔹 Small variant
  if (variant === 'small') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className={`${baseStyle} px-5 py-1 text-sm bg-amber-400 ${className}`}
      >
        {loading ? (
          <>
            <DotLoader size={14} ariaLabel="Adding" />
            Adding...
          </>
        ) : success ? (
          <>
            <Check className="h-4 w-4 text-green-300" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </>
        )}
      </button>
    );
  }

  // 🔺 Default variant
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || success}
      className={`${baseStyle} w-full px-6 py-2.5 text-sm sm:text-base bg-amber-400 ${className}`}
    >
      {loading ? (
        <>
          <DotLoader size={18} ariaLabel="Adding to cart" />
          Adding...
        </>
      ) : success ? (
        <>
          <Check className="h-5 w-5 text-green-300" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}
