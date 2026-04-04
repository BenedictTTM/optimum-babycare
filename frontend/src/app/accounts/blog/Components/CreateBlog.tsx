'use client';

import React, { useState, useRef } from 'react';
import { apiClient } from '@/api/clients';
import { toast } from 'sonner';
import { CloudUpload, Rocket, Bold, Italic, List } from 'lucide-react';
import BlogCard from './BlogCard';

export default function CreateBlog({ initialData, onSuccess }: { initialData?: any; onSuccess?: () => void }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [status, setStatus] = useState(initialData?.status || 'DRAFT');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverImage || initialData?.coverImageUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const wordCount = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    const estimatedRead = wordCount > 0 ? Math.ceil(wordCount / 200) : '--';
    const isPublishDisabled = isLoading || !title.trim() || !content.trim();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const wrapSelection = (wrapper: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = content.slice(0, start);
        const selected = content.slice(start, end);
        const after = content.slice(end);
        const newText = before + wrapper + selected + wrapper + after;
        setContent(newText);
        const newStart = start + wrapper.length;
        const newEnd = newStart + selected.length;
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = newStart;
            ta.selectionEnd = newEnd;
        });
    };

    const toggleList = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = content.slice(0, start);
        const selected = content.slice(start, end) || '';
        const after = content.slice(end);
        const lines = selected.split('\n');
        const allHaveDash = lines.length > 0 && lines.every((l: string) => l.trim().startsWith('- '));
        const newSel = allHaveDash
            ? lines.map((l: string) => l.replace(/^\s*-\s+/, '')).join('\n')
            : lines.map((l: string) => (l.trim().length > 0 ? `- ${l}` : l)).join('\n');
        const newText = before + newSel + after;
        setContent(newText);
        const newStart = start;
        const newEnd = start + newSel.length;
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = newStart;
            ta.selectionEnd = newEnd;
        });
    };

    const handleClearImage = () => {
        setCoverImage(null);
        setImagePreview(null);
    };

    const handleAction = async (forcedStatus?: string) => {
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required.');
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('status', forcedStatus || status);
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            if (initialData?.id) {
                await apiClient.put(`/blog/${initialData.id}`, formData);
                toast.success(`Blog post ${forcedStatus === 'PUBLISHED' ? 'updated & published' : 'updated'} successfully!`);
            } else {
                await apiClient.post('/blog', formData);
                toast.success(`Blog post ${forcedStatus === 'PUBLISHED' ? 'published' : 'saved'} successfully!`);
            }
            setTitle('');
            setContent('');
            setCategory('');
            setStatus('DRAFT');
            setCoverImage(null);
            setImagePreview(null);
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error('Error saving blog post:', error);
            toast.error(error.response?.data?.message || 'Failed to save blog post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 ">
                <div>
                    <h1 className="text-3xl font-bold text-[#222222] tracking-tight">Design the Narrative</h1>
                    <p className="text-[#6b6b6b] mt-1">Every great story starts with a single word. Compose your masterpiece.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button 
                        onClick={() => handleAction('DRAFT')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#FFD23F] hover:bg-[#ffcf36] text-black text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                    >
                        Save as Placeholder
                    </button>
                    <button 
                        className="px-4 py-2 border border-amber-300 hover:border-amber-400 text-black text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsPreviewOpen(true);
                        }}
                    >
                        Preview Post
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column (Main Form) */}
                <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-xs border border-gray-100">
                    <form className="space-y-6">
                        {/* Title input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Blog Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full border-0 bg-gray-50 rounded-sm text-gray-900 focus:ring-0 text-base sm:text-lg px-4 py-3 placeholder:text-gray-300 font-medium"
                                placeholder="Enter a compelling title..."
                            />
                        </div>

                        {/* Category & Status row */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="block w-full border-0 bg-gray-50 rounded-sm text-gray-900 focus:ring-0 sm:text-sm px-4 py-2.5 placeholder:text-gray-300"
                                    placeholder="e.g., Technology"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="block w-full border-0 bg-gray-50 rounded-sm text-gray-900 focus:ring-0 sm:text-sm px-4 py-2.5 appearance-none cursor-pointer"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content textarea with fake toolbar */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-100 rounded-sm overflow-hidden flex flex-col">
                                <div className="bg-gray-100 px-4 py-2 flex items-center gap-4 text-gray-600 border-b border-gray-100">
                                    <button type="button" onClick={() => wrapSelection('**')} title="Bold" className="hover:text-black p-1">
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => wrapSelection('*')} title="Italic" className="hover:text-black p-1">
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={toggleList} title="List" className="hover:text-black p-1">
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    required
                                    rows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="block w-full border-0 focus:ring-0 sm:text-sm px-3 py-3 bg-gray-50 placeholder:text-gray-300 min-h-[120px] sm:min-h-[220px] md:min-h-[360px] resize-none sm:resize-vertical outline-none"
                                    placeholder="Start typing your story here..."
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column */}
                <div className="w-full md:w-80 lg:w-72 flex flex-col gap-4">
                    {/* Cover image widget */}
                    <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cover Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-sm p-4 flex flex-col items-center justify-center text-center relative hover:bg-[#FFF7E0] transition-colors">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Cover Preview" className="w-full h-40 sm:h-48 object-cover rounded-sm bg-white" />
                            ) : (
                                <>
                                    <CloudUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Drag image or <span className="text-indigo-600">browse</span></p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG UP TO 5MB</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-xs">
                            <span className="text-gray-400 italic font-medium truncate">
                                {coverImage ? coverImage.name : 'No file chosen'}
                            </span>
                            {coverImage && (
                                <button type="button" onClick={handleClearImage} className="text-red-500 hover:text-red-700 font-bold ml-2">Clear</button>
                            )}
                        </div>
                    </div>

                    {/* Summary widget */}
                    <div className="bg-[#FFF7E6] p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Post Summary</h3>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Estimated Read</span>
                            <span className="font-semibold text-gray-800">{estimatedRead} min</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Word Count</span>
                            <span className="font-semibold text-gray-800">{wordCount} words</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">SEO Score</span>
                            <span className="text-[10px] font-bold px-2 py-1 bg-[#FFF3CC] text-[#B76A00] rounded uppercase tracking-wider">Neutral</span>
                        </div>
                    </div>

                    {/* Create Action Button area */}
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => handleAction('PUBLISHED')}
                            disabled={isPublishDisabled}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm font-bold transition-colors ${
                                isPublishDisabled 
                                ? 'bg-[#9cadce] cursor-not-allowed text-white opacity-80' 
                                : 'bg-[#768bd6] hover:bg-indigo-600 text-white'
                            }`}
                        >
                            <Rocket className="w-5 h-5 text-indigo-100" />
                            {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
                        </button>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-3">
                            Please fill in title and content to publish
                        </span>
                    </div>
                </div>
            </div>

            {/* Full-Screen Preview (card-only with blurred backdrop) */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <BlogCard 
                            title={title || 'Untitled Post'}
                            excerpt={content ? (content.substring(0, 150) + '...') : ''}
                            content={content}
                            author="Author"
                            date={new Date().toLocaleDateString()}
                            imageUrl={imagePreview || undefined}
                            tags={category ? [category] : []}
                            status={status === 'DRAFT' ? 'draft' : 'published'}
                            disablePreview={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
