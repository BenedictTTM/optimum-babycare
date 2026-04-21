'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface CategoryFormData {
    name: string;
    description: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    initialData?: CategoryFormData;
    mode: 'add' | 'edit';
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}: CategoryModalProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
    });
    const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset when opened or initialData changes
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || { name: '', description: '' });
            setErrors({});
        }
    }, [isOpen, initialData]);

    const validate = (): boolean => {
        const newErrors: Partial<CategoryFormData> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Category name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Category name must not exceed 50 characters';
        } else if (!/^[a-zA-Z0-9\s\-_&]+$/.test(formData.name)) {
            newErrors.name = 'Only letters, numbers, spaces, hyphens, underscores, and ampersands allowed';
        }
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must not exceed 500 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                description: formData.description.trim(),
            });
            onClose();
        } catch (err) {
            console.error('Error submitting category:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof CategoryFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
        >
            <div
                className="w-full max-w-md sm:max-w-lg rounded-2xl bg-white p-6 shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 id="category-modal-title" className="text-2xl font-bold text-gray-900">
                        {mode === 'add' ? 'Add New Category' : 'Edit Category'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close modal"
                        disabled={isSubmitting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-amber-400">*</span>
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full rounded-lg border ${errors.name ? 'border-amber-400' : 'border-gray-200'} bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-amber-100' : 'focus:ring-amber-100'}`}
                            placeholder="e.g., Snacks & Beverages"
                            disabled={isSubmitting}
                            maxLength={50}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-amber-400" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="category-description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className={`w-full rounded-lg border ${errors.description ? 'border-amber-400' : 'border-gray-200'} bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100`}
                            placeholder="Brief description of this category (optional)"
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-amber-400" role="alert">
                                {errors.description}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.description.length}/500 characters
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Category' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
