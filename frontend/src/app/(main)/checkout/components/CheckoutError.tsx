
import React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CheckoutErrorProps {
    message: string;
}

export function CheckoutError({ message }: CheckoutErrorProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-10 px-3 sm:px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ooups no product selected</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Go Back
                    </button>
                    <Link
                        href="/products"
                        className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
