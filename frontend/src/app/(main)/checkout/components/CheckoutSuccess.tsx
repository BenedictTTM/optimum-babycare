
import React from 'react';

export function CheckoutSuccess() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-10 px-3 sm:px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-5 text-center">
                <div className="text-green-600 mb-3">
                    <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1.5">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-1.5 text-sm">Your order has been confirmed.</p>
                <p className="text-xs text-gray-500 mb-5">Redirecting to your orders...</p>
            </div>
        </div>
    );
}
