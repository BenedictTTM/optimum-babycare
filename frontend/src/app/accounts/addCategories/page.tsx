'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import CategoryTable, { Category } from './components/CategoryTable';
import CategoryModal, { CategoryFormData } from './components/CategoryModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { categoryService } from './lib/categoryService';

type ToastType = 'success' | 'error';

interface Toast {
    message: string;
    type: ToastType;
}

const PAGE_SIZE = 10;

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState<Toast | null>(null);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.fetchCategories();
            setCategories(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load categories';
            setError(message);
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Create
    const handleCreateCategory = async (data: CategoryFormData) => {
        try {
            await categoryService.createCategory(data);
            showToast('Category created successfully!', 'success');
            await fetchCategories();
            setIsAddModalOpen(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create category';
            showToast(message, 'error');
            throw err;
        }
    };

    // Update
    const handleUpdateCategory = async (data: CategoryFormData) => {
        if (!selectedCategory) return;
        try {
            await categoryService.updateCategory(selectedCategory.id, data);
            showToast('Category updated successfully!', 'success');
            await fetchCategories();
            setIsEditModalOpen(false);
            setSelectedCategory(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update category';
            showToast(message, 'error');
            throw err;
        }
    };

    // Delete
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            await categoryService.deleteCategory(selectedCategory.id);
            showToast('Category deleted successfully!', 'success');
            await fetchCategories();
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete category';
            showToast(message, 'error');
            throw err;
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    // Filtering & pagination
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const term = searchTerm.trim().toLowerCase();
        return categories.filter(
            (c) => c.name.toLowerCase().includes(term) || (c.description?.toLowerCase().includes(term) ?? false)
        );
    }, [categories, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
    const page = Math.min(currentPage, totalPages);
    const paginatedCategories = filteredCategories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handlePageChange = (nextPage: number) => {
        if (nextPage >= 1 && nextPage <= totalPages) setCurrentPage(nextPage);
    };

    const totalProducts = categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0);

    return (
        <div className="min-h-screen px-4 py-10 sm:px-2 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <header className="md:mb-8 ms:mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Product Categories</h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Organize and manage your product categories.
                    </p>
                </header>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-white border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Categories</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{categories.length}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="mt-1 text-2xl font-bold text-amber-400">{totalProducts}</p>
                    </div>
                </div>

                {/* Controls */}
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search categories..."
                                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                            />
                        </div>
                        {/* Add button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800"
                        >
                            <Plus className="h-4 w-4" />
                            Add Category
                        </button>
                    </div>

                    {/* Error */}
                    {error && !loading && (
                        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                            <p className="text-sm text-amber-800">{error}</p>
                        </div>
                    )}

                    {/* Table */}
                    <div className="mt-6">
                        <CategoryTable
                            categories={paginatedCategories}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* Pagination */}
                    {!loading && filteredCategories.length > 0 && (
                        <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCategories.length)} of{' '}
                                {filteredCategories.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                    <span>{page}</span>
                                    <span className="text-gray-400">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </footer>
                    )}
                </section>
            </div>

            {/* Modals */}
            <CategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateCategory}
                mode="add"
            />
            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSubmit={handleUpdateCategory}
                initialData={selectedCategory ? { name: selectedCategory.name, description: selectedCategory.description || '' } : undefined}
                mode="edit"
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCategory(null);
                }}
                onConfirm={handleDeleteCategory}
                categoryName={selectedCategory?.name || ''}
                productCount={selectedCategory?._count?.products || 0}
            />

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-amber-400 text-white'}`}
                >
                    <p className="text-sm font-medium">{toast.message}</p>
                </div>
            )}
        </div>
    );
}
