/**
 * Payment Button Component
 * Reusable button component for initiating payments
 */

'use client';

import React from 'react';
import { Loader2, CreditCard } from 'lucide-react';

export interface PaymentButtonProps {
  /** Amount to be paid */
  amount: number;
  /** Currency code */
  currency?: string;
  /** Button text */
  text?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Custom class name */
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = 'GHS',
  text = 'Pay Now',
  isLoading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const formatAmount = (amt: number, curr: string): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(amt);
  };

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      aria-label={`Pay ${formatAmount(amount, currency)}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <span>{text}</span>
          <span className="font-bold">{formatAmount(amount, currency)}</span>
        </>
      )}
    </button>
  );
};
