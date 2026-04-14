# Quick Start Guide - Payment System

## 🚀 Get Started in 3 Minutes

### Step 1: Import Components (5 seconds)

```tsx
import { PaymentButton, PaymentModal } from "@/Components/Payment";
import { usePayment } from "@/lib/hooks/usePayment";
```

### Step 2: Add to Your Component (30 seconds)

```tsx
"use client";

import { useState } from "react";
import { PaymentButton, PaymentModal } from "@/Components/Payment";

export default function OrderPage({ order }) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p>Total: GH₵ {order.totalAmount}</p>

      {/* Simple Button */}
      <PaymentButton
        amount={order.totalAmount}
        onClick={() => setShowPayment(true)}
        fullWidth
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        orderId={order.id}
        amount={order.totalAmount}
        onSuccess={() => {
          console.log("Payment successful!");
          setShowPayment(false);
        }}
      />
    </div>
  );
}
```

### Step 3: Done! ✅

That's it! Your payment system is ready.

## 📋 Complete Example with Error Handling

```tsx
"use client";

import { useState } from "react";
import { PaymentModal } from "@/Components/Payment";
import { usePayment } from "@/lib/hooks/usePayment";

export default function OrderDetailsPage({ order }) {
  const [showModal, setShowModal] = useState(false);
  const { initiatePayment, isLoading, error, reset } = usePayment();

  const handlePayment = async () => {
    try {
      await initiatePayment(order.id);
      // Payment initiated successfully
      setShowModal(false);
    } catch (err) {
      // Error is already set in hook state
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
        <div className="space-y-2">
          <p>
            Status: <span className="font-semibold">{order.status}</span>
          </p>
          <p>
            Total:{" "}
            <span className="font-bold text-xl">GH₵ {order.totalAmount}</span>
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">{error}</p>
          <button
            onClick={reset}
            className="text-red-600 text-sm font-medium mt-2"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Payment Section */}
      {order.status === "PENDING" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Complete Payment</h2>

          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : `Pay GH₵ ${order.totalAmount}`}
          </button>

          <p className="text-xs text-gray-600 mt-3 text-center">
            Secure payment powered by Paystack
          </p>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderId={order.id}
        amount={order.totalAmount}
        onSuccess={(reference) => {
          console.log("Payment successful:", reference);
          setShowModal(false);
          // Optionally refresh order data
          window.location.reload();
        }}
        onError={(err) => {
          console.error("Payment error:", err);
        }}
      />
    </div>
  );
}
```

## 🎯 Common Use Cases

### 1. Pay Button Only

```tsx
import { PaymentButton } from "@/Components/Payment";

<PaymentButton
  amount={150}
  currency="GHS"
  onClick={handlePay}
  size="lg"
  fullWidth
/>;
```

### 2. Modal Only

```tsx
import { PaymentModal } from "@/Components/Payment";

<PaymentModal isOpen={true} onClose={handleClose} orderId={123} amount={150} />;
```

### 3. Custom Hook

```tsx
import { usePayment } from "@/lib/hooks/usePayment";

const { initiatePayment, isLoading } = usePayment();

// Initiate payment programmatically
await initiatePayment(orderId);
```

### 4. Service Method

```tsx
import { PaymentService } from "@/lib/services/payment.service";

// Format amount
const formatted = PaymentService.formatAmount(150, "GHS");
// Returns: "GH₵ 150.00"

// Validate amount
const { valid, error } = PaymentService.validateAmount(150);

// Verify payment
const result = await PaymentService.verifyPayment(reference);
```

## 🔧 Customization Examples

### Custom Styled Button

```tsx
<PaymentButton
  amount={order.totalAmount}
  onClick={handlePay}
  variant="primary"
  size="lg"
  className="shadow-2xl hover:scale-105 transform transition-transform"
/>
```

### Custom Modal Behavior

```tsx
<PaymentModal
  isOpen={showModal}
  onClose={() => {
    // Custom close logic
    setShowModal(false);
    trackEvent("payment_modal_closed");
  }}
  orderId={order.id}
  amount={order.totalAmount}
  onSuccess={(ref) => {
    // Custom success handling
    toast.success("Payment successful!");
    router.push(`/orders/${order.id}`);
  }}
  onError={(err) => {
    // Custom error handling
    toast.error(err);
    logError(err);
  }}
/>
```

## 🐛 Troubleshooting

### Payment popup blocked?

The system automatically falls back to redirect if popup is blocked.

### Modal not showing?

Check that `isOpen` prop is `true`.

### API errors?

Check backend is running at correct URL in `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Reference not found?

Ensure order ID is valid and user is authenticated.

## 📚 More Information

- Full Documentation: `src/Components/Payment/README.md`
- Complete Summary: `PAYMENT_SYSTEM_SUMMARY.md`
- Example Component: `src/Components/Payment/examples/OrderPaymentExample.tsx`

## 🎉 You're Ready!

Your payment system is production-ready with:

- ✅ Secure payment processing
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility
- ✅ Type safety

**Start accepting payments now!** 🚀
