"use client";

import { useState, useEffect } from "react";
import OrdersLoading from './loading';
import { useRouter, usePathname } from "next/navigation";
import { fetchMyOrders } from "../../../lib/orders";
import NoOrders from '../../../Components/Order/NoOder';
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: number;
    title: string;
    imageUrl: string | string[];
  };
}

interface Order {
  id: number;
  buyerId: number;
  sellerId: number;
  whatsappNumber: string;
  callNumber: string;
  hall?: string;
  buyerMessage?: string;
  status: string;
  paymentStatus?: string;
  currency: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // Re-fetch orders when the user returns to this tab (e.g. after completing payment in Paystack window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadOrders();
      }
    };

    const handleFocus = () => {
      loadOrders();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMyOrders();
      if ((result as any).status === 401) {
        // Not authenticated → redirect to login preserving target route
        const target = encodeURIComponent(pathname || "/main/orders");
        router.push(`/auth/login?redirect=${target}`);
        return;
      }

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.message || "Failed to load orders");
      }
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus.toUpperCase()) {
      case "PAID":
        return "bg-green-50 text-green-700 border border-green-300";
      case "UNPAID":
        return "bg-orange-50 text-orange-700 border border-orange-300";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border border-yellow-300";
      case "FAILED":
        return "bg-red-50 text-red-700 border border-red-300";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductImage = (item: OrderItem): string => {
    if (item.product?.imageUrl) {
      if (Array.isArray(item.product.imageUrl)) {
        return item.product.imageUrl[0] || "/placeholder-image.png";
      }
      return item.product.imageUrl;
    }
    return "/placeholder-image.png";
  };

  const handleProceedToCheckout = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    const primary = order.items[0];
    const productId = primary.productId;
    const qty = primary.quantity || 1;
    router.push(`/main/checkout?productId=${productId}&quantity=${qty}`);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const { cancelOrder } = await import('../../../lib/orders');
      const result = await cancelOrder(orderId);

      if (result.success) {
        // Optimistically remove or reload
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        alert(result.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('An error occurred while cancelling');
    }
  };

  // Render the route-level loading UI while fetching orders
  if (loading) {
    return <OrdersLoading />;
  }

  if (error) {
    throw new Error(typeof error === 'string' ? error : 'Failed to load orders');
  }

  return (
    <div className="min-h-screen bg-white py-25 sm:py-20 md:py-25 lg:py-30 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 md:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => router.push("/main/products")}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm text-amber-700 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <NoOrders />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden w-full sm:max-w-2xl sm:mx-auto">
                {/* Order Header */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 px-4 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3">
                  <div className="flex-1">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">Order #{order.id}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <span className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                    </span>
                    {order.paymentStatus && (
                      <span className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus === 'UNPAID' ? '💳 Unpaid' : order.paymentStatus === 'PAID' ? '✓ Paid' : order.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-5 pb-2 sm:pb-3 border-b border-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-3 py-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14  rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.productName}</h3>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {order.currency}{item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Information */}
                <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Contact Information</h4>
                  <div className="text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-start sm:gap-6">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-2">
                        <span className="text-gray-500 font-medium sm:w-20">WhatsApp</span>
                        <span className="text-gray-900 break-all">{order.whatsappNumber}</span>
                      </div>

                      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-2">
                        <span className="text-gray-500 font-medium sm:w-10">Call</span>
                        <span className="text-gray-900 break-all">{order.callNumber}</span>
                      </div>

                      {order.hall && (
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-2 col-span-2 sm:col-span-1">
                          <span className="text-gray-600 font-medium sm:w-20">Location</span>
                          <span className="text-gray-900">{order.hall}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* (Call Now removed here) */}

                {/* Note */}
                {order.buyerMessage && (
                  <div className="px-4 sm:px-5 py-3 bg-amber-50">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1.5">Note</h4>
                    <p className="text-xs sm:text-sm text-gray-700 leading-snug break-words">{order.buyerMessage}</p>
                  </div>
                )}

                {/* Total Amount and Payment Button (Call Now placed beside Pay Now) */}
                <div className="px-4 sm:px-5 py-3 sm:py-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      {order.currency}{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={`tel:${'0554493554'}`}
                      title={order.callNumber || 'Call seller'}
                      aria-label={`Call ${order.callNumber || 'seller'}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-amber-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.9 1.37l.7 2.11a2 2 0 01-.45 2.05L8.91 11.09a16.06 16.06 0 007 7l2.51-1.02a2 2 0 012.05-.45l2.11.7A2 2 0 0121 17.72V21a2 2 0 01-2 2A19 19 0 013 5z" />
                      </svg>
                      <span className="hidden sm:inline text-amber-700 ">Lets Talk</span>
                    </a>

                    {order.paymentStatus === 'UNPAID' && (
                      <button
                        onClick={() => router.push(`/main/orders/${order.id}/pay`)}
                        className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Pay Now</span>
                      </button>
                    )}

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
