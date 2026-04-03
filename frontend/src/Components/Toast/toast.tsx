'use client'

import { Toaster, toast } from 'sonner';

// ToastProvider Component
interface ToastProviderProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  visibleToasts?: number;
  duration?: number;
  theme?: 'light' | 'dark' | 'system';
  className?: string;
}


export function ToastProvider({
  position = 'top-right',
  expand = true,
  richColors = true,
  closeButton = true,
  visibleToasts = 3,
  duration = 4000,
  theme = 'light',
  className = '',
}: ToastProviderProps = {}) {
  return (
    <Toaster
      position={position}
      expand={expand}
      richColors={richColors}
      closeButton={closeButton}
      visibleToasts={visibleToasts}
      theme={theme}
      className={className}
      toastOptions={{
        duration,
        style: {
          background: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          border: '1px solid #e5e7eb',
        },
      }}
    />
  );
}

// Simple toast options interface
interface ToastOptions {
  description?: string;
  duration?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  };
  cancel?: {
    label: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  };
}


export const useToast = () => {

  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: options?.icon || '✅',
      action: options?.action,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => toast.dismiss())
      } : undefined,
    })
  }

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: options?.icon || '',
      action: options?.action,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => toast.dismiss())
      } : undefined,
    })
  }

  // Warning toast
  const showWarning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: options?.icon || '⚠️',
      action: options?.action,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => toast.dismiss())
      } : undefined,
    });
  };

  // Info toast
  const showInfo = (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: options?.icon || 'ℹ️',
      action: options?.action,
      cancel: options?.cancel ? {
        label: options.cancel.label,
        onClick: options.cancel.onClick || (() => toast.dismiss())
      } : undefined,
    });
  };

  // Loading toast
  const showLoading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  };

  // Dismiss functions
  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
}