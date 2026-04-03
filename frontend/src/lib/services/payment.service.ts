/**
 * Payment Service - Business Logic Layer
 * Handles all payment-related operations following clean architecture principles
 */

import type {
  PaymentInitialization,
  PaymentVerification,
  OrderPaymentResponse,
} from '@/types/payment';
import { apiClient } from '@/api/clients';

/**
 * Payment Service Class
 * Encapsulates all payment business logic and API interactions
 */
export class PaymentService {
  /**
   * Initialize payment for an order
   * @param orderId - The order ID to create payment for
   * @returns Payment initialization response with authorization URL
   */
  static async initiateOrderPayment(
    orderId: number
  ): Promise<OrderPaymentResponse> {
    try {
      const response = await apiClient.post(`/orders/${orderId}/pay`);
      return response.data;
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      throw error?.response?.data?.message
        ? new Error(error.response.data.message)
        : error instanceof Error
          ? error
          : new Error('An unexpected error occurred during payment initialization');
    }
  }

  /**
   * Verify payment by reference
   * @param reference - Payment reference from provider
   * @returns Verification result
   */
  static async verifyPayment(
    reference: string
  ): Promise<PaymentVerification> {
    try {
      if (!reference || reference.trim() === '') {
        throw new Error('Payment reference is required');
      }

      const response = await apiClient.post('/payments/verify', { reference });
      return response.data;
    } catch (error: any) {
      console.error('Payment verification error:', error);
      throw error?.response?.data?.message
        ? new Error(error.response.data.message)
        : error instanceof Error
          ? error
          : new Error('An unexpected error occurred during payment verification');
    }
  }

  /**
   * Get user's payment history
   * @param userId - User ID
   * @returns List of payments
   */
  static async getUserPayments(userId: number): Promise<PaymentInitialization[]> {
    try {
      const response = await apiClient.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Fetch payment history error:', error);
      throw error?.response?.data?.message
        ? new Error(error.response.data.message)
        : error instanceof Error
          ? error
          : new Error('An unexpected error occurred while fetching payment history');
    }
  }

  /**
   * Format amount for display
   * @param amount - Amount in minor units (kobo, pesewas, cents)
   * @param currency - Currency code
   * @returns Formatted currency string
   */
  static formatAmount(amount: number, currency: string = 'GHS'): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Validate payment amount
   * @param amount - Amount to validate
   * @param min - Minimum allowed amount
   * @param max - Maximum allowed amount
   * @returns Validation result
   */
  static validateAmount(
    amount: number,
    min: number = 1,
    max: number = 1000000
  ): { valid: boolean; error?: string } {
    if (!amount || typeof amount !== 'number') {
      return { valid: false, error: 'Amount must be a number' };
    }

    if (amount < min) {
      return {
        valid: false,
        error: `Amount must be at least ${this.formatAmount(min)}`,
      };
    }

    if (amount > max) {
      return {
        valid: false,
        error: `Amount cannot exceed ${this.formatAmount(max)}`,
      };
    }

    return { valid: true };
  }

  /**
   * Open payment popup/redirect
   * @param authorizationUrl - Payment provider authorization URL
   */
  static openPaymentWindow(authorizationUrl: string): void {
    // Use popup for better UX on desktop, redirect on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Redirect on mobile devices
      window.location.href = authorizationUrl;
    } else {
      // Open popup on desktop
      const popup = window.open(
        authorizationUrl,
        'payment',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup blocked, fallback to redirect
        window.location.href = authorizationUrl;
      }
    }
  }
}
