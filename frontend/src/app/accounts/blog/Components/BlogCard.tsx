"use client";

import React, { useState } from 'react';
import { BsTags } from "react-icons/bs";
export interface BlogCardProps {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  onEdit?: () => void;
  onDelete?: () => void;
  disablePreview?: boolean;
}

export default function BlogCard({
  title,
  excerpt,
  content,
  author = 'Admin',
  date = new Date().toLocaleDateString(),
  imageUrl,
  tags = [],
  status = 'published',
  onEdit,
  onDelete,
  disablePreview = false,
}: BlogCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
        {imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden bg-gray-100">
            <img 
              src={imageUrl} 
              alt={title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-slate-50 flex items-center justify-center text-slate-300 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
        {tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 px-2">
              <BsTags className="text-amber-400 w-4 h-4 flex-shrink-0" />
              {tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className=" text-amber-400 text-[10px] uppercase font-semibold tracking-wider px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-amber-400 self-center font-medium">+{tags.length - 3}</span>
              )}
            </div>
          )}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{title}</h3>
            {status === 'draft' && (
              <span className="shrink-0 bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-medium border border-yellow-200">
                Draft
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-4 space-x-2">
            <span className="italic">{date}</span>
            <span>&bull;</span>
            <span className="font-thin text-gray-700">{author}</span>
          </div>

          <p className="text-gray-800 text-sm line-clamp-3 leading-relaxed flex-grow">
            {excerpt}
          </p>

          

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            { !disablePreview && (
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md transition-colors border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-gray-500"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </button>
            )}
            <div className="flex items-center space-x-1">
              {onEdit && (
                <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit post">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete post">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {isPreviewOpen && !disablePreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl shrink-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">Preview Mode</span>
                {status === 'draft' && (
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">Draft</span>
                )}
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto px-6 py-8 md:px-10 md:py-12 bg-white">
              <article className="max-w-3xl mx-auto">
                {imageUrl && (
                  <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <img 
                      src={imageUrl} 
                      alt={title} 
                      className="w-full h-auto max-h-[400px] object-cover" 
                    />
                  </div>
                )}
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="text-blue-600 bg-blue-50 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                  {title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-10 pb-8 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{author}</p>
                    <p className="text-sm text-gray-500">{date} &bull; 5 min read</p>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 space-y-6">
                  {/* Rendering simple content with newlines converting to paragraphs */}
                  {content ? content.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? <p key={i} className="leading-relaxed">{paragraph}</p> : <br key={i} />
                  )) : (
                    <p className="text-gray-400 italic">No content available.</p>
                  )}
                </div>
              </article>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0 flex justify-end gap-3 rounded-b-xl">
              {onEdit && (
                <button onClick={() => { setIsPreviewOpen(false); onEdit(); }} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                  Edit Post
                </button>
              )}
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
