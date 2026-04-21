'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    categoryName: string;
    productCount?: number;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
    productCount = 0,
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error deleting category:', error);
            // Error handling is done in parent component
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    const hasProducts = productCount > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <AlertTriangle className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h2 id="delete-modal-title" className="text-xl font-bold text-gray-900">
                            Delete Category
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {hasProducts ? (
                                <>
                                    Cannot delete <span className="font-semibold">&quot;{categoryName}&quot;</span> because it has{' '}
                                    <span className="font-semibold">{productCount}</span> associated product
                                    {productCount !== 1 ? 's' : ''}.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete{' '}
                                    <span className="font-semibold">&quot;{categoryName}&quot;</span>? This action cannot be
                                    undone.
                                </>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close modal"
                        disabled={isDeleting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {hasProducts && (
                    <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-sm text-amber-800">
                            Please reassign or remove all products from this category before deleting it.
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    {!hasProducts && (
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="flex-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Category'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
