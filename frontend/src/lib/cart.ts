import { apiClient } from '@/api/clients';
import { Cart } from '@/types/cart';

// POST /cart
export const addToCart = async (productId: number, quantity: number, options?: { idempotencyKey?: string }) => {
  try {
    const response = await apiClient.post('/cart', {
      productId,
      quantity,
    }, {
      headers: options?.idempotencyKey ? {
        'Idempotency-Key': options.idempotencyKey
      } : {}
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { success: false, statusCode: 401, message: 'Unauthorized' };
    }
    return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
  }
};

// GET /cart
export const fetchCart = async () => {
  try {
    const response = await apiClient.get<Cart>('/cart');
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { success: true, data: null, message: 'Cart not found' };
    }
    return { success: false, message: error.response?.data?.message || 'Failed to fetch cart' };
  }
};

// PATCH /cart/:itemId
export const updateCartItem = async (itemId: number, quantity: number) => {
  try {
    const response = await apiClient.patch(`/cart/${itemId}`, {
      quantity,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Failed to update cart item' };
  }
};

// DELETE /cart/:itemId
export const removeCartItem = async (itemId: number) => {
  try {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Failed to remove cart item' };
  }
};

// DELETE /cart
export const clearCart = async () => {
  try {
    const response = await apiClient.delete('/cart');
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Failed to clear cart' };
  }
};

// GET Cart Item Count
export const getCartItemCount = async () => {
  try {
    const response = await fetchCart();
    if (response.success && response.data) {
      return { success: true, count: response.data.totalItems };
    }
    return { success: false, count: 0 };
  } catch (error) {
    return { success: false, count: 0 };
  }
};
