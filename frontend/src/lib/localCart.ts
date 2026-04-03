
const LOCAL_CART_KEY = 'anonymous_cart';

export interface LocalCartItem {
  productId: number;
  quantity: number;
  product?: any;
}

export interface LocalCartData {
  items: LocalCartItem[];
  subtotal: number;
}

export const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(LOCAL_CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const getLocalCartData = (): LocalCartData => {
  const items = getLocalCart();
  const subtotal = calculateLocalCartSubtotal(items);
  return { items, subtotal };
};

export const addToLocalCart = (productData: any, quantity: number = 1) => {
  if (typeof window === 'undefined') return;
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex((item) => item.productId === productData.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      productId: productData.id,
      quantity,
      product: productData,
    });
  }
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('local-cart-updated'));
};

export const updateLocalCartItem = (productId: number, quantity: number): LocalCartData => {
  if (typeof window === 'undefined') return { items: [], subtotal: 0 };

  const cart = getLocalCart();
  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('local-cart-updated'));
  }
  return getLocalCartData();
};

export const removeFromLocalCart = (productId: number): LocalCartData => {
  if (typeof window === 'undefined') return { items: [], subtotal: 0 };

  let cart = getLocalCart();
  cart = cart.filter((item) => item.productId !== productId);

  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('local-cart-updated'));
  return getLocalCartData();
};

export const clearLocalCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_CART_KEY);
  window.dispatchEvent(new Event('local-cart-updated'));
}

export const calculateLocalCartSubtotal = (items?: LocalCartItem[]): number => {
  const cartItems = items || getLocalCart();
  return cartItems.reduce((total, item) => {
    const price = item.product?.discountedPrice || item.product?.originalPrice || 0;
    return total + (price * item.quantity);
  }, 0);
};
