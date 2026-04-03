import { apiClient } from '@/api/clients';
import { getLocalCart, clearLocalCart } from './localCart';

export const hasLocalCartItems = (): boolean => {
  const cart = getLocalCart();
  return cart.length > 0;
};

export const mergeAnonymousCart = async (): Promise<{ success: boolean; itemCount?: number; message?: string }> => {
  const cartItems = getLocalCart();

  if (cartItems.length === 0) {
    return { success: true, itemCount: 0, message: 'No items to merge' };
  }

  try {
    // Transform local items to match MergeCartDto
    const itemsToMerge = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const response = await apiClient.post('/cart/merge', {
      items: itemsToMerge
    });

    // Clear local cart after successful merge
    clearLocalCart();

    return {
      success: true,
      itemCount: cartItems.length,
      message: `Merged ${cartItems.length} items from your guest cart`
    };

  } catch (error) {
    console.error('Error merging cart:', error);
    return { success: false, message: 'Failed to merge cart items' };
  }
};
