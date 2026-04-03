/**
 * Payment Modal Component
 * Full-featured payment modal with error handling and loading states
 */

'use client';

import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { PaymentService } from '@/lib/services/payment.service';
import { apiClient } from '@/api/clients';

export interface PaymentModalProps {
  /** Modal open state */
  isOpen: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Order ID to pay for */
  orderId: number;
  /** Order amount */
  amount: number;
  /** Currency */
  currency?: string;
  /** Success callback */
  onSuccess?: (reference: string) => void;
  /** Error callback */
  onError?: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  currency = 'GHS',
  onSuccess,
  onError,
}) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'loading') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, status, onClose]);

  const handlePayment = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await apiClient.post(`/orders/${orderId}/pay`);
      const data = response.data;

      // If payment was reused (already exists), show success
      if (data.reused) {
        setStatus('success');
        if (onSuccess) {
          onSuccess(data.payment.providerPaymentId || 'reused');
        }
        return;
      }

      // Open payment window
      if (data.authorization?.authorization_url) {
        PaymentService.openPaymentWindow(data.authorization.authorization_url);
        setStatus('success');
        if (onSuccess) {
          onSuccess(data.authorization.reference);
        }
      } else {
        throw new Error('No payment authorization URL received');
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Payment failed');
      setStatus('error');
      setErrorMessage(errMsg);
      if (onError) {
        onError(errMsg);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && status !== 'loading') {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment</h2>
          </div>
          {status !== 'loading' && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Display */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <p className="text-sm font-medium text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-900">
              {PaymentService.formatAmount(amount, currency)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Order #{orderId}</p>
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Payment Failed</p>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Payment Initiated</p>
                <p className="text-sm text-green-700 mt-1">
                  Complete your payment in the opened window
                </p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Secure payment powered by Paystack</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Your payment information is encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Supports Mobile Money, Cards & Bank Transfer</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Initiated</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span className='whitespace-nowrap'>Proceed to Pay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
