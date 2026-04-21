
import React from 'react';

interface OrderPlacedModalProps {
    isOpen: boolean;
    onProceed: () => void;
}

export function OrderPlacedModal({ isOpen, onProceed }: OrderPlacedModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-600 mb-6">
                    Your order has been successfully recorded. Please proceed to payment to complete your purchase.
                </p>

                <button
                    onClick={onProceed}
                    className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}
