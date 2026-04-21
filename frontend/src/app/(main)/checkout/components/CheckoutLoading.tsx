
import React from 'react';

export function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-10 px-3 sm:px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading product details...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
            </div>
        </div>
    );
}
