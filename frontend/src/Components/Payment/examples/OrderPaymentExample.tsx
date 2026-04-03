/**
 * Example: Payment Integration in Order Page
 * Demonstrates how to use the payment components in a real scenario
 */

'use client';

import React, { useState } from 'react';
import { PaymentButton, PaymentModal } from '@/Components/Payment';
import { usePayment } from '@/lib/hooks/usePayment';

interface Order {
  id: number;
  totalAmount: number;
  currency: string;
  status: string;
}

interface OrderPaymentExampleProps {
  order: Order;
  onPaymentSuccess?: () => void;
}

/**
 * Example component showing payment integration
 */
export const OrderPaymentExample: React.FC<OrderPaymentExampleProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { initiatePayment, isLoading, error } = usePayment();

  const handlePayClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    setShowPaymentModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handlePaymentError = (err: string) => {
    console.error('Payment error:', err);
  };

  // Only show payment button if order is pending
  if (order.status !== 'PENDING') {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <PaymentButton
        amount={order.totalAmount}
        currency={order.currency}
        text="Pay for Order"
        isLoading={isLoading}
        onClick={handlePayClick}
        fullWidth
        size="lg"
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderId={order.id}
        amount={order.totalAmount}
        currency={order.currency}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {/* Payment Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>✓ Secure payment via Paystack</p>
        <p>✓ Supports Mobile Money, Cards & Bank Transfer</p>
        <p>✓ Your data is encrypted and secure</p>
      </div>
    </div>
  );
};
