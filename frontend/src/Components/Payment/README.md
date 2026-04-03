# Payment Component System - Documentation

## Overview

A production-ready, enterprise-grade payment system built with clean architecture principles, following 40+ years of software engineering best practices.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (React Components - UI/UX)                                  │
│  • PaymentButton.tsx                                         │
│  • PaymentModal.tsx                                          │
│  • PaymentSuccessPage.tsx                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    Application Layer                         │
│  (Business Logic & State Management)                         │
│  • usePayment.ts (Custom Hooks)                             │
│  • usePaymentVerification.ts                                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     Domain Layer                             │
│  (Business Entities & Rules)                                 │
│  • payment.service.ts (Payment Logic)                       │
│  • payment.ts (Types & Interfaces)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  (External Services & APIs)                                  │
│  • /api/orders/[id]/payment (Next.js API Route)            │
│  • /api/payments/verify (Verification Endpoint)             │
│  • Backend Service (Node.js/NestJS)                         │
└─────────────────────────────────────────────────────────────┘
```

## Features

### ✨ Core Features

- **Secure Payment Processing**: PCI-compliant integration with Paystack
- **Multiple Payment Methods**: Mobile Money, Cards, Bank Transfer
- **Real-time Verification**: Automatic payment status verification
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Smooth UX with loading indicators
- **Responsive Design**: Mobile-first, works on all devices
- **Accessibility**: WCAG 2.1 compliant, keyboard navigation

### 🏗️ Architecture Features

- **Clean Architecture**: Separation of concerns, easy to maintain
- **Type Safety**: Full TypeScript coverage
- **Reusability**: Component-based, easy to integrate
- **Testability**: Loosely coupled, easy to mock and test
- **Scalability**: Easy to add new payment providers
- **Maintainability**: Well-documented, follows SOLID principles

## Installation

No additional dependencies needed. Uses existing project dependencies:

- React 19
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- lucide-react (icons)

## Quick Start

### 1. Basic Payment Button

```tsx
import { PaymentButton } from "@/Components/Payment";

function OrderPage({ order }) {
  const handlePayment = () => {
    // Your payment logic
  };

  return (
    <PaymentButton
      amount={order.totalAmount}
      currency="GHS"
      onClick={handlePayment}
      fullWidth
    />
  );
}
```

### 2. Complete Payment Flow with Modal

```tsx
import { useState } from "react";
import { PaymentButton, PaymentModal } from "@/Components/Payment";

function CheckoutPage({ order }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PaymentButton
        amount={order.totalAmount}
        onClick={() => setShowModal(true)}
      />

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderId={order.id}
        amount={order.totalAmount}
        onSuccess={(ref) => console.log("Paid:", ref)}
        onError={(err) => console.error(err)}
      />
    </>
  );
}
```

### 3. Using Payment Hooks

```tsx
import { usePayment } from "@/lib/hooks/usePayment";

function OrderActions({ orderId, amount }) {
  const { initiatePayment, isLoading, error } = usePayment();

  const handlePay = async () => {
    try {
      await initiatePayment(orderId);
      // Payment window opened
    } catch (err) {
      // Handle error
    }
  };

  return (
    <button onClick={handlePay} disabled={isLoading}>
      {isLoading ? "Processing..." : `Pay ${amount}`}
    </button>
  );
}
```

## Component API Reference

### PaymentButton

```tsx
interface PaymentButtonProps {
  amount: number; // Amount to pay
  currency?: string; // Currency code (default: 'GHS')
  text?: string; // Button text (default: 'Pay Now')
  isLoading?: boolean; // Loading state
  disabled?: boolean; // Disabled state
  onClick: () => void; // Click handler
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean; // Full width button
  className?: string; // Custom classes
}
```

### PaymentModal

```tsx
interface PaymentModalProps {
  isOpen: boolean; // Modal visibility
  onClose: () => void; // Close handler
  orderId: number; // Order ID to pay for
  amount: number; // Payment amount
  currency?: string; // Currency code
  onSuccess?: (reference: string) => void; // Success callback
  onError?: (error: string) => void; // Error callback
}
```

## Service Methods

### PaymentService

```typescript
// Initialize payment for order
PaymentService.initiateOrderPayment(orderId: number): Promise<OrderPaymentResponse>

// Verify payment by reference
PaymentService.verifyPayment(reference: string): Promise<PaymentVerification>

// Get user payment history
PaymentService.getUserPayments(userId: number): Promise<Payment[]>

// Format amount for display
PaymentService.formatAmount(amount: number, currency?: string): string

// Validate payment amount
PaymentService.validateAmount(amount: number, min?: number, max?: number): ValidationResult

// Open payment window
PaymentService.openPaymentWindow(authorizationUrl: string): void
```

## Hooks API

### usePayment()

```typescript
const {
  isLoading: boolean,
  error: string | null,
  paymentData: OrderPaymentResponse | null,
  initiatePayment: (orderId: number) => Promise<OrderPaymentResponse>,
  reset: () => void
} = usePayment();
```

### usePaymentVerification()

```typescript
const {
  isVerifying: boolean,
  verificationError: string | null,
  verificationResult: PaymentVerification | null,
  verifyPayment: (reference: string) => Promise<PaymentVerification>,
  reset: () => void
} = usePaymentVerification();
```

## Backend Integration

### Required Backend Endpoints

1. **POST /orders/:id/payment** - Initialize payment
2. **POST /payments/verify** - Verify payment
3. **POST /payments/webhook** - Handle provider webhooks

### Example Backend Response

```json
{
  "orderId": 123,
  "payment": {
    "id": 456,
    "amount": 150.0,
    "currency": "GHS",
    "status": "pending"
  },
  "authorization": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "payment-456-1234567890"
  }
}
```

## Payment Flow

```
User clicks "Pay" → PaymentModal opens → User confirms
    ↓
Initialize Payment API call
    ↓
Backend creates Payment record & initializes Paystack
    ↓
Frontend receives authorization URL
    ↓
Open payment window (popup/redirect)
    ↓
User completes payment on Paystack
    ↓
Paystack redirects to /payment-success?reference=xxx
    ↓
Frontend calls verification API
    ↓
Backend verifies with Paystack & updates Payment status
    ↓
Show success/failure to user
    ↓
Redirect to orders page
```

## Best Practices

### Security

- ✅ Never expose payment provider secrets in frontend
- ✅ Always verify payments on backend
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Handle webhooks securely with signature verification

### UX/UI

- ✅ Show loading states for all async operations
- ✅ Provide clear error messages
- ✅ Display payment amount prominently
- ✅ Support keyboard navigation
- ✅ Use optimistic UI updates where appropriate

### Performance

- ✅ Lazy load payment components
- ✅ Debounce rapid clicks
- ✅ Cache payment history
- ✅ Minimize re-renders

### Error Handling

- ✅ Graceful degradation
- ✅ Retry mechanisms for network failures
- ✅ User-friendly error messages
- ✅ Logging for debugging

## Customization

### Styling

All components use Tailwind CSS classes. Customize by:

1. **Using className prop**:

```tsx
<PaymentButton className="custom-class" />
```

2. **Theming via Tailwind config**:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        payment: {
          primary: "#your-color",
          // ...
        },
      },
    },
  },
};
```

### Adding New Payment Providers

1. Update `PaymentProvider` enum in `types/payment.ts`
2. Add provider logic in `payment.service.ts`
3. Update backend payment initialization
4. Add provider-specific UI if needed

## Testing

### Unit Tests Example

```typescript
// payment.service.test.ts
describe("PaymentService", () => {
  test("formats amount correctly", () => {
    const result = PaymentService.formatAmount(150, "GHS");
    expect(result).toBe("GH₵ 150.00");
  });

  test("validates amount range", () => {
    const result = PaymentService.validateAmount(0.5, 1, 1000);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Integration Tests Example

```typescript
// payment-flow.test.tsx
describe("Payment Flow", () => {
  test("completes payment successfully", async () => {
    render(<OrderPaymentExample order={mockOrder} />);

    const payButton = screen.getByText("Pay for Order");
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

### Payment popup blocked

**Solution**: Fallback to redirect automatically. Check `PaymentService.openPaymentWindow()`

### Verification fails

**Solution**: Check backend webhook signature. Ensure Paystack secret key is correct.

### Payment status not updating

**Solution**: Verify webhook URL is registered with Paystack. Check backend logs.

## Support

For issues or questions:

1. Check backend logs: `docker logs [container-name]`
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Check Paystack dashboard for transaction status

## License

Proprietary - Part of babylist Platform

---

**Built with ❤️ following Clean Architecture & SOLID Principles**
