"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { placeOrder } from "../../../lib/orders";
import { clearCart } from "../../../lib/cart";
import { clearLocalCart } from "../../../lib/localCart";
import type { Product } from "../../../types/products";
import { CheckoutHeader, CheckoutForm, MultiCheckoutForm } from "@/Components/Checkout";
import { PaymentModal } from "@/Components/Payment";
import { OrderPlacedModal } from "./components/OrderPlacedModal";
import { CheckoutLoading } from "./components/CheckoutLoading";
import { CheckoutError } from "./components/CheckoutError";
import { CheckoutSuccess } from "./components/CheckoutSuccess";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params for product checkout or cart checkout
  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  const itemsParam = searchParams.get("items");
  const subtotalParam = searchParams.get("subtotal");

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [productError, setProductError] = useState<string | null>(null);
  // Multi-item state
  const [multiItems, setMultiItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [loadingMulti, setLoadingMulti] = useState<boolean>(false);

  // Form state
  const [quantity, setQuantity] = useState<number>(parseInt(quantityParam || "1", 10) || 1);
  const [hall, setHall] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [callNumber, setCallNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  // Payment & Modal state
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  // Fetch product details
  useEffect(() => {
    // If items param is present we'll fetch multiple products
    if (itemsParam) {
      setLoadingMulti(true);
      setProductError(null);

      const parsed = itemsParam.split(',').map(pair => {
        const [pid, qty] = pair.split(':').map(s => s && s.trim());
        return { productId: Number(pid), quantity: Number(qty || 1) };
      }).filter(p => !isNaN(p.productId));

      let isActive = true;

      (async () => {
        try {
          const fetches = parsed.map(p =>
            // Importing products client dynamically or using the imported one. 
            // We need to valid ids.
            import('../../../api/clients').then(({ products }) => products.getById(p.productId).then(data => data.data || data).catch(() => null))
          );
          const responses = await Promise.all(fetches);

          if (!isActive) return;

          const items: Array<{ product: Product; quantity: number }> = [];
          for (let i = 0; i < responses.length; i++) {
            const payload = responses[i];
            if (!payload) continue;
            items.push({ product: payload as Product, quantity: parsed[i].quantity || 1 });
          }

          if (items.length === 0) {
            setProductError('No valid products found for checkout');
            setMultiItems([]);
          } else {
            setMultiItems(items);
          }
        } catch (err: any) {
          console.error('Multi product fetch error:', err);
          if (isActive) setProductError('Failed to load product details for cart');
        } finally {
          if (isActive) setLoadingMulti(false);
        }
      })();

      return () => { isActive = false; };
    }

    // Single product flow
    if (!productId) {
      setProductError("No product selected. Please return to products page.");
      return;
    }

    let isActive = true;

    (async () => {
      setLoadingProduct(true);
      setProductError(null);

      try {
        const { products } = await import('../../../api/clients');
        // products.getById returns the data directly based on the client implementation we saw
        const payload = await products.getById(parseInt(productId, 10));

        // The client usually returns just the data, but let's be safe
        const productData = (payload?.data ?? payload) as Product;

        if (!isActive) return;

        if (!productData) {
          setProductError("Product not found");
          setProduct(null);
        } else {
          setProduct(productData);
        }
      } catch (err: any) {
        console.error("Product fetch error:", err);
        if (isActive) setProductError("Failed to load product details");
      } finally {
        if (isActive) setLoadingProduct(false);
      }
    })();

    return () => { isActive = false; };
  }, [productId, itemsParam]);

  // Validate form
  const phoneRegex = /^\+?[0-9\s()-]{8,}$/;

  const CheckoutSchema = z.object({
    productId: z
      .number({ required_error: "Product is required" })
      .int()
      .positive(),
    quantity: z
      .number({ required_error: "Quantity is required" })
      .int()
      .min(1, "Quantity must be at least 1"),
    hall: z
      .string()
      .max(120, "Location is too long")
      .optional()
      .or(z.literal("")),
    whatsapp: z
      .string({ required_error: "WhatsApp number is required" })
      .min(1, "WhatsApp number is required")
      .regex(phoneRegex, "Please enter a valid phone number"),
    callNumber: z
      .string({ required_error: "Call number is required" })
      .min(1, "Call number is required")
      .regex(phoneRegex, "Please enter a valid phone number"),
    message: z
      .string()
      .max(500, "Message is too long")
      .optional()
      .or(z.literal("")),
  });

  const validateForm = (): boolean => {
    const pid = productId ? parseInt(productId, 10) : NaN;
    const result = CheckoutSchema.safeParse({
      productId: pid,
      quantity,
      hall,
      whatsapp,
      callNumber,
      message,
    });

    const newErrors: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        // Keep only the first error per field for concise messages
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
    }

    // Stock validation depends on loaded product
    if (product && quantity > (product.stock || 0)) {
      newErrors.quantity = `Only ${product.stock} items available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handleConfirm = async () => {
    // single-product submission
    if (!itemsParam) {
      if (!productId || !product) {
        alert("Product information is missing");
        return;
      }

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const result = await placeOrder({
          productId: parseInt(productId, 10),
          quantity,
          whatsappNumber: whatsapp,
          callNumber,
          location: hall.trim() || undefined,
          message: message.trim() || undefined,
        });

        if (result.success && result.data) {
          setCreatedOrderId(result.data.id);
          setOrderTotal(result.data.totalAmount || subtotal);
          // Show order placed modal instead of payment modal directly
          setShowOrderPlacedModal(true);
        } else {
          setErrors({ submit: result.message || "Failed to place order" });
        }
      } catch (err: any) {
        console.error("Order submission error:", err);
        setErrors({ submit: "An unexpected error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // multi-item submission
    // Basic validation: ensure items loaded and phones valid
    if (multiItems.length === 0) {
      setErrors({ submit: 'No items found for checkout' });
      return;
    }

    const phoneRegex = /^\+?[0-9\s()-]{8,}$/;
    const newErrors: Record<string, string> = {};
    if (!whatsapp || !phoneRegex.test(whatsapp)) newErrors.whatsapp = 'Please enter a valid WhatsApp number';
    if (!callNumber || !phoneRegex.test(callNumber)) newErrors.callNumber = 'Please enter a valid call number';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payloadItems = multiItems.map(i => ({ productId: i.product.id, quantity: i.quantity }));
      const result = await placeOrder({
        items: payloadItems,
        whatsappNumber: whatsapp,
        callNumber,
        location: hall.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (result.success && result.data) {
        setCreatedOrderId(result.data.id);
        const total = result.data.totalAmount ?? Number(subtotalParam ?? computeMultiSubtotal(multiItems));
        setOrderTotal(total);

        // Clear cart (server and local) after successful order
        await clearCart();
        clearLocalCart();

        // Show order placed modal instead of payment modal directly
        setShowOrderPlacedModal(true);
      } else {
        setErrors({ submit: result.message || 'Failed to place order' });
      }
    } catch (err: any) {
      console.error('Multi order submission error:', err);
      setErrors({ submit: 'An unexpected error occurred while placing the order.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const computeMultiSubtotal = (items: Array<{ product: Product; quantity: number }>) => {
    return items.reduce((acc, it) => {
      const unit = it.product.discountedPrice ?? it.product.originalPrice ?? 0;
      return acc + unit * (it.quantity || 1);
    }, 0);
  };

  // Handle successful payment
  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    setShowPaymentModal(false);
    setOrderSuccess(true);
    // Redirect to orders page after 2 seconds
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowPaymentModal(false);
    // Show option to try payment again or view orders
    setErrors({ submit: `Order created but payment failed: ${error}. You can retry payment from your orders page.` });
  };

  const handleProceedToPayment = () => {
    setShowOrderPlacedModal(false);
    setShowPaymentModal(true);
  };

  // Loading state
  if (loadingProduct) {
    return <CheckoutLoading />;
  }

  if (productError) {
    return <CheckoutError message={typeof productError === 'string' ? productError : 'Failed to load checkout details'} />;
  }
  // Success state
  if (orderSuccess) {
    return <CheckoutSuccess />;
  }

  const currency = "GHS"; // Default currency

  // Multi-item view
  if (itemsParam) {
    const calcSubtotal = computeMultiSubtotal(multiItems);
    const useSubtotal = Number(subtotalParam ?? calcSubtotal);

    return (
      <>
        <div className="min-h-screen  py-1 sm:py-2 md:py-2 px-2.5 sm:px-4 md:px-6">
          <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto w-full">
            <CheckoutHeader />
            <MultiCheckoutForm
              items={multiItems}
              currency={currency}
              subtotal={useSubtotal}
              hall={hall}
              whatsapp={whatsapp}
              callNumber={callNumber}
              message={message}
              errors={errors}
              isSubmitting={isSubmitting || loadingMulti}
              onChange={(field, value) => {
                if (field === 'hall') setHall(value);
                else if (field === 'whatsapp') setWhatsapp(value);
                else if (field === 'callNumber') setCallNumber(value);
                else if (field === 'message') setMessage(value);
              }}
              onConfirm={handleConfirm}
              onBack={() => router.back()}
            />
          </div>
        </div>

        {/* Order Placed Modal */}
        <OrderPlacedModal
          isOpen={showOrderPlacedModal}
          onProceed={handleProceedToPayment}
        />

        {createdOrderId && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              router.push("/orders");
            }}
            orderId={createdOrderId}
            amount={orderTotal}
            currency={currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </>
    );
  }

  // Single product view (existing behavior)
  if (!product) {
    return null;
  }

  const unitPrice = product.discountedPrice ?? product.originalPrice ?? 0;
  const subtotal = unitPrice * quantity;

  return (
    <>
      <div className="min-h-screen  py-1 sm:py-2 md:py-2 px-2.5 sm:px-4 md:px-6">
        <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto w-full">
          <CheckoutHeader />
          <CheckoutForm
            product={product}
            quantity={quantity}
            currency={currency}
            unitPrice={unitPrice}
            subtotal={subtotal}
            hall={hall}
            whatsapp={whatsapp}
            callNumber={callNumber}
            message={message}
            errors={errors}
            isSubmitting={isSubmitting || !product}
            onChange={(field, value) => {
              if (field === 'hall') setHall(value);
              else if (field === 'whatsapp') setWhatsapp(value);
              else if (field === 'callNumber') setCallNumber(value);
              else if (field === 'message') setMessage(value);
            }}
            onConfirm={handleConfirm}
            onBack={() => router.back()}
          />
        </div>
      </div>

      {/* Order Placed Modal */}
      <OrderPlacedModal
        isOpen={showOrderPlacedModal}
        onProceed={handleProceedToPayment}
      />

      {/* Payment Modal */}
      {createdOrderId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            // Redirect to orders page even if payment is cancelled
            router.push("/orders");
          }}
          orderId={createdOrderId}
          amount={orderTotal}
          currency={currency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </>
  );
}
