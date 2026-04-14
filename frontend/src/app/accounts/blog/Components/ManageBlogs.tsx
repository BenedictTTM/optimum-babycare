'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/clients';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, RefreshCw } from 'lucide-react';
import CreateBlog from './CreateBlog';

interface Blog {
    id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
    coverImage?: string;
    coverImageUrl?: string;
    content: string;
}

export default function ManageBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/blog');
            // Depending on the API format, adjust mapping. Assuming array or { data: [] }
            const data = response.data?.data || response.data || [];
            setBlogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            toast.error('Failed to load blog posts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        
        try {
            await apiClient.delete(`/blog/${id}`);
            toast.success('Blog post deleted successfully');
            setBlogs(blogs.filter(blog => blog.id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog post');
        }
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setViewMode('EDIT');
    };

    const handleCreateNew = () => {
        setEditingBlog(null);
        setViewMode('CREATE');
    };

    const handleFormSuccess = () => {
        setViewMode('LIST');
        setEditingBlog(null);
        fetchBlogs();
    };

    const handleCancel = () => {
        setViewMode('LIST');
        setEditingBlog(null);
    };

    if (viewMode === 'CREATE' || viewMode === 'EDIT') {
        return (
            <div className="w-full">
                <div className="px-6 pt-4">
                    <button 
                        onClick={handleCancel}
                        className="text-sm text-gray-500 hover:text-black font-medium mb-4 flex items-center gap-2"
                    >
                        &larr; Back to all posts
                    </button>
                </div>
                <CreateBlog 
                    initialData={editingBlog} 
                    onSuccess={handleFormSuccess} 
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#222222] tracking-tight">Manage Blogs</h1>
                    <p className="text-amber-800 mt-1">Review, edit, and publish your stories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchBlogs}
                        disabled={isLoading}
                        className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-md transition-colors"
                        title="Refresh list"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                        onClick={handleCreateNew}
                        className="px-4 py-2 bg-amber-300 hover:bg-bg-amber-400 text-black text-sm font-bold rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 " />
                        New Post
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading blog posts...</div>
                ) : blogs.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">You haven't written any blog posts yet.</p>
                        <button 
                            onClick={handleCreateNew}
                            className="px-4 py-2 bg-[#F2C94C] hover:bg-[#e6b83b] text-black text-sm font-bold rounded-md transition-colors inline-block"
                        >
                            Start Writing
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {blog.title || 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {blog.category || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded-sm uppercase tracking-wider ${
                                                blog.status === 'PUBLISHED' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(blog)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(blog.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
