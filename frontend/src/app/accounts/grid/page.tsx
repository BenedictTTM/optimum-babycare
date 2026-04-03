'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Grid3x3,
  Printer,
  Edit2,
  Trash2,
  Share2,
  X,
} from 'lucide-react';
import { fetchAllProducts, updateProduct, deleteProduct } from '../../../lib/products';
import { Product } from '../../../types/products';
import { formatGhs, calculateDiscountPercent } from '../../../utilities/formatGhs';
import { useToast } from '../../../Components/Toast/toast';


export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const getStoreUrl = async () => {
    try {
      const authResponse = await fetch('/auth/me', {
        credentials: 'include',
      });

      if (!authResponse.ok) return '';

      const authData = await authResponse.json();
      const currentUserId = authData.user?.id || authData.id;

      if (currentUserId && typeof window !== 'undefined') {
        return `${window.location.origin}/store/${currentUserId}`;
      }
    } catch (err) {
      console.error('Error getting store URL:', err);
    }
    return '';
  };

  const copyStoreLink = async () => {
    const storeUrl = await getStoreUrl();
    if (!storeUrl) return showWarning('Store link not available yet');
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSuccess('Store link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showError('Failed to copy link');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchAllProducts();

      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        setError(result.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.isSold || !product.stock || product.stock === 0)
      return { label: 'Sold Out', color: 'text-amber-700 bg-red-50' };
    if (product.stock <= 5)
      return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const toggleSelectAll = () =>
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map((p) => p.id)
    );

  const toggleSelect = (id: number) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Product> = {
        title: editingProduct.title,
        description: editingProduct.description,
        originalPrice: editingProduct.originalPrice,
        discountedPrice: editingProduct.discountedPrice,
        category: editingProduct.category,
        stock: editingProduct.stock,
      };

      const result = await updateProduct(editingProduct.id, updates);

      if (result.success) {
        // Update the product in the list
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updates } : p))
        );
        setEditingProduct(null);
        showSuccess('Product updated successfully!');
      } else {
        showError(result.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      showError('An error occurred while updating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    setIsSubmitting(true);
    try {
      const result = await deleteProduct(deletingProduct.id);

      if (result.success) {
        // Remove the product from the list
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
        setDeletingProduct(null);
        showSuccess('Product deleted successfully!');
      } else {
        showError(result.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('An error occurred while deleting the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-amber-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
          <p className="text-sm text-red-900 mt-1">
            Track stock levels, availability, and restocking needs in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Product</span>
          </button>

          <button
            onClick={copyStoreLink}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${copied
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Share Store'}</span>
          </button>

          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            aria-label="Print product list"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Grid3x3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Create your first product to get started.</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      aria-label="Select all products"
                    />
                  </th>
                  {[
                    'Product ID',
                    'Name',
                    'Category',
                    'Price',
                    'Views',
                    'Stock',
                    'Action',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const discountPercent = calculateDiscountPercent(
                    product.originalPrice,
                    product.discountedPrice
                  );

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 sm:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                          aria-label={`Select product ${product.title}`}
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        #{product.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">{product.title}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {product.category || 'Uncategorized'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <span className="font-medium text-gray-900">
                          {formatGhs(product.discountedPrice)}
                        </span>
                        {discountPercent > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatGhs(product.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        {product.views || 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                            aria-label={`Edit ${product.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 text-gray-600 hover:text-amber-700 hover:bg-red-50 rounded"
                            aria-label={`Delete ${product.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{products.length}</span>{' '}
              product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value === '' ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.discountedPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountedPrice: e.target.value === '' ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value === '' ? 0 : parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Product?
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete &quot;{deletingProduct.title}&quot;? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
