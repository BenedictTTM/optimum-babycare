/**
 * Payment Hooks - Custom React Hooks for Payment Operations
 * Provides reusable payment logic with state management
 */

import { useState, useCallback } from 'react';
import { PaymentService } from '../services/payment.service';
import type { OrderPaymentResponse, PaymentVerification } from '@/types/payment';

interface UsePaymentState {
  isLoading: boolean;
  error: string | null;
  paymentData: OrderPaymentResponse | null;
}

interface UsePaymentVerificationState {
  isVerifying: boolean;
  verificationError: string | null;
  verificationResult: PaymentVerification | null;
}

/**
 * Hook for initiating payment
 */
export function usePayment() {
  const [state, setState] = useState<UsePaymentState>({
    isLoading: false,
    error: null,
    paymentData: null,
  });

  const initiatePayment = useCallback(async (orderId: number) => {
    setState({ isLoading: true, error: null, paymentData: null });

    try {
      const response = await PaymentService.initiateOrderPayment(orderId);
      
      setState({
        isLoading: false,
        error: null,
        paymentData: response,
      });

      // Open payment window if authorization URL is provided
      if (response.authorization?.authorization_url) {
        PaymentService.openPaymentWindow(response.authorization.authorization_url);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to initialize payment';
      
      setState({
        isLoading: false,
        error: errorMessage,
        paymentData: null,
      });

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, paymentData: null });
  }, []);

  return {
    ...state,
    initiatePayment,
    reset,
  };
}

/**
 * Hook for verifying payment
 */
export function usePaymentVerification() {
  const [state, setState] = useState<UsePaymentVerificationState>({
    isVerifying: false,
    verificationError: null,
    verificationResult: null,
  });

  const verifyPayment = useCallback(async (reference: string) => {
    setState({ isVerifying: true, verificationError: null, verificationResult: null });

    try {
      const result = await PaymentService.verifyPayment(reference);
      
      setState({
        isVerifying: false,
        verificationError: null,
        verificationResult: result,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Payment verification failed';
      
      setState({
        isVerifying: false,
        verificationError: errorMessage,
        verificationResult: null,
      });

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isVerifying: false, verificationError: null, verificationResult: null });
  }, []);

  return {
    ...state,
    verifyPayment,
    reset,
  };
}
