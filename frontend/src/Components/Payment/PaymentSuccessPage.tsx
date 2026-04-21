/**
 * Payment Success Page Component
 * Handles payment verification and displays success/failure state
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { usePaymentVerification } from '@/lib/hooks/usePayment';
import { PaymentService } from '@/lib/services/payment.service';

export const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const { verifyPayment, isVerifying, verificationError, verificationResult } = usePaymentVerification();
  const [countdown, setCountdown] = useState(5);
  const [initialized, setInitialized] = useState(false);

  // Verify payment on mount
  useEffect(() => {
    if (reference) {
      setInitialized(true);
      verifyPayment(reference).catch((error) => {
        console.error('Payment verification error:', error);
      });
    }
  }, [reference, verifyPayment]);

  // Countdown and redirect on success
  useEffect(() => {
    if (verificationResult?.success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0 && verificationResult?.success) {
      router.push('/orders');
    }
  }, [countdown, verificationResult, router]);

  // Loading state — show while verify hasn't started yet or is in progress
  if (!initialized || isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
          {reference && (
            <p className="text-xs text-gray-400 mt-4 font-mono bg-gray-50 p-2 rounded">
              Ref: {reference}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (verificationError || !verificationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Verification Failed</h2>
          <p className="text-gray-600 text-center mb-6">
            {verificationError || 'We couldn\'t verify your payment. Please try again.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>View Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return to Cart
            </button>
          </div>
          
          {reference && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Reference Number</p>
              <p className="text-sm font-mono text-gray-900">{reference}</p>
              <p className="text-xs text-gray-500 mt-2">
                Save this reference for support inquiries
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state
  const isSuccess = verificationResult.status.toLowerCase() === 'success' || 
                    verificationResult.status.toLowerCase() === 'successful';

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Successful!</h2>
          <p className="text-gray-600 text-center mb-6">
            Your payment has been confirmed and your order is being processed.
          </p>

          {/* Payment Details */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">Amount Paid</span>
              <span className="text-2xl font-bold text-gray-900">
                {PaymentService.formatAmount(verificationResult.amount, 'GHS')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {verificationResult.status}
              </span>
            </div>
          </div>

          {/* Redirect countdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600">
              Redirecting to your orders in <span className="font-bold text-blue-600">{countdown}</span> seconds
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>View My Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/products')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Reference */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
            <p className="text-sm font-mono text-gray-900 break-all">{verificationResult.reference}</p>
          </div>
        </div>
      </div>
    );
  }

  // Failed payment
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Payment Incomplete</h2>
        <p className="text-gray-600 text-center mb-6">
          Your payment was not completed. Please try again or contact support if you believe this is an error.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Status:</strong> {verificationResult.status}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/orders')}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/contact')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {reference && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Reference Number</p>
            <p className="text-sm font-mono text-gray-900">{reference}</p>
          </div>
        )}
      </div>
    </div>
  );
};
