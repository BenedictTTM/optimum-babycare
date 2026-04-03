/**
 * Integration Example: Adding Payment to Existing Orders Page
 * Shows how to integrate the payment system into your existing order pages
 */

'use client';

import React, { useState } from 'react';
import { PaymentModal } from '@/Components/Payment';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: number;
  totalAmount: number;
  currency: string;
  status: string;
  items: any[];
  createdAt: string;
}

interface OrderCardWithPaymentProps {
  order: Order;
  onPaymentSuccess?: () => void;
}

/**
 * Enhanced Order Card Component with Payment Integration
 * Drop this into your existing orders page
 */
export const OrderCardWithPayment: React.FC<OrderCardWithPaymentProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    setShowPaymentModal(false);

    // Refresh order data
    if (onPaymentSuccess) {
      onPaymentSuccess();
    } else {
      // Default: reload page
      window.location.reload();
    }
  };

  const isPending = order.status === 'PENDING';

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${isPending
              ? 'bg-yellow-100 text-yellow-800'
              : order.status === 'CONFIRMED'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'DELIVERED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
          >
            {order.status}
          </span>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.productName}</span>
              <span className="text-gray-900 font-medium">
                {item.quantity}x GH₵ {item.unitPrice}
              </span>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              {order.currency} {order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Button (only for PENDING orders) */}
        {isPending && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay Now</span>
            <span className="font-bold">GH₵ {order.totalAmount.toFixed(2)}</span>
          </button>
        )}

        {/* Action Buttons for other statuses */}
        {!isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `/main/orders/${order.id}`}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderId={order.id}
        amount={order.totalAmount}
        currency={order.currency}
        onSuccess={handlePaymentSuccess}
        onError={(error) => {
          console.error('Payment error:', error);
          // Optionally show toast/alert
        }}
      />
    </>
  );
};

/**
 * Example: Updated Orders Page Component
 */
export default function OrdersPageExample() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

      {/* Pending Orders First */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pending Payment
        </h2>
        <div className="space-y-4">
          {orders
            .filter((order) => order.status === 'PENDING')
            .map((order) => (
              <OrderCardWithPayment
                key={order.id}
                order={order}
                onPaymentSuccess={fetchOrders}
              />
            ))}
        </div>
      </div>

      {/* Other Orders */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order History
        </h2>
        <div className="space-y-4">
          {orders
            .filter((order) => order.status !== 'PENDING')
            .map((order) => (
              <OrderCardWithPayment
                key={order.id}
                order={order}
                onPaymentSuccess={fetchOrders}
              />
            ))}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link
            href="/main/products"
            className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
