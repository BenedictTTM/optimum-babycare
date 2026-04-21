'use client';

import { useEffect, useState, useCallback } from 'react';
import { updateOrderStatus, deleteOrder } from '../../../lib/orders';
import { apiClient } from '@/api/clients';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/Components/Toast/toast';

interface Product {
  id: number;
  title: string;
  imageUrl: string[];
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  product: Product;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  buyerId: number;
  whatsappNumber: string;
  callNumber: string;
  location?: string | null;
  buyerMessage: string;
  status: string;
  paymentStatus?: string;
  currency: string;
  totalAmount: number;
  items: OrderItem[];
}

interface OrdersResponse {
  success: boolean;
  data?: Order[];
  message?: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { user } = useUserStore();
  const isAdmin = user?.role === 'ADMIN';

  const { showSuccess, showError, showWarning } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isAdmin ? '/orders/admin' : '/orders';
      const response = await apiClient.get(endpoint);

      const result: OrdersResponse = response.data;

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (result.success === false) {
        throw new Error(result.message || 'Failed to fetch orders');
      } else {
        setOrders(result.data || []);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      // For initial load, we might still want to show the full screen error, 
      // but let's also toast it for visibility if it's a soft error
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, nextStatus: string) => {
    if (!isAdmin) return;
    setActionLoading(orderId);
    const res = await updateOrderStatus(orderId, nextStatus);
    if (!res.success) {
      showError(res.message || 'Failed to update status');
    } else {
      showSuccess(`Order status updated to ${nextStatus}`);
      fetchOrders();
    }
    setActionLoading(null);
  };

  const handleDelete = (orderId: number) => {
    if (!isAdmin) return;

    showWarning('Delete order permanently? This will restore stock.', {
      action: {
        label: 'Confirm Delete',
        onClick: () => executeDelete(orderId),
      },
      duration: 6000,
    });
  };

  const executeDelete = async (orderId: number) => {
    setActionLoading(orderId);
    const res = await deleteOrder(orderId);
    if (!res.success) {
      showError(res.message || 'Failed to delete order');
    } else {
      showSuccess('Order deleted successfully');
      setOrders((prev) => prev.filter(o => o.id !== orderId));
    }
    setActionLoading(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'UNPAID':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'FAILED':
        return 'bg-red-100 text-amber-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-400 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-md shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
                    <p className="text-xs text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-wrap gap-1.5 justify-end mb-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      {order.paymentStatus && (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus === 'UNPAID' ? '💳 Unpaid' : order.paymentStatus === 'PAID' ? '✓ Paid' : order.paymentStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {order.currency} {order.totalAmount.toFixed(2)}
                    </p>
                    {isAdmin && (
                      <div className="mt-2 flex flex-wrap gap-1 justify-end">
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                          <button
                            disabled={!!actionLoading}
                            onClick={() => handleStatusChange(order.id, order.status === 'SHIPPED' ? 'DELIVERED' : 'SHIPPED')}
                            className="text-xs px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
                          >
                            {actionLoading === order.id ? '...' : order.status === 'SHIPPED' ? 'Mark Delivered' : 'Mark Shipped'}
                          </button>
                        )}
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                          <button
                            disabled={!!actionLoading}
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            className="text-xs px-2 py-1 rounded bg-amber-400 text-white disabled:opacity-50"
                          >
                            {actionLoading === order.id ? '...' : 'Cancel'}
                          </button>
                        )}
                        <button
                          disabled={!!actionLoading}
                          onClick={() => handleDelete(order.id)}
                          className="text-xs px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                        >
                          {actionLoading === order.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-4 py-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                      {item.product?.imageUrl?.[0] ? (
                        <Image
                          src={item.product.imageUrl[0]}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-0.5">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-600">
                        Unit Price: {order.currency} {item.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        Subtotal: {order.currency} {(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Contact & Details */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-semibold">WhatsApp:</span> {order.whatsappNumber}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Call:</span> {order.callNumber}
                    </p>
                    {order.location && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Location:</span> {order.location}
                      </p>
                    )}
                  </div>
                  {order.buyerMessage && (
                    <div>
                      <p className="font-semibold text-gray-600 mb-0.5">Message:</p>
                      <p className="text-gray-700 italic">&quot;{order.buyerMessage}&quot;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
