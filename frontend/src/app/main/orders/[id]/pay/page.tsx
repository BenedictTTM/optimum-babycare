'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PaymentModal } from '@/Components/Payment';
import { apiClient } from '@/api/clients';

interface Order {
  id: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  status: string;
}

export default function OrderPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(params.id as string, 10);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!orderId || isNaN(orderId)) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      const data = response.data?.data || response.data;
      setOrder(data);
      
      // Automatically open payment modal if order is unpaid
      if (data.paymentStatus === 'UNPAID') {
        setShowPaymentModal(true);
      }
    } catch (err: any) {
      console.error('Failed to load order:', err);
      setError(err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to load order'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    setShowPaymentModal(false);
    // Redirect to orders page
    router.push('/main/orders');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowPaymentModal(false);
    setError(`Payment failed: ${error}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/main/orders')}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (order.paymentStatus === 'PAID') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already Paid</h2>
          <p className="text-gray-600 mb-6">This order has already been paid for.</p>
          <button
            onClick={() => router.push('/main/orders')}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Pay</h2>
          <p className="text-gray-600 mb-4">Order #{order.id}</p>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            {order.currency} {order.totalAmount.toFixed(2)}
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-3"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => router.push('/main/orders')}
            className="w-full bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          router.push('/main/orders');
        }}
        orderId={orderId}
        amount={order.totalAmount}
        currency={order.currency}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
}
