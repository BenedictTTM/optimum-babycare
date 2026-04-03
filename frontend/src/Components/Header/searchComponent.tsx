'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { DotLoader } from '@/Components/Loaders';
import { useRouter } from 'next/navigation';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // kept for UX if needed later
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();


  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false); // Remove backdrop when search is triggered
      setQuery('');
    }
  };

  // Simple Enter handling: submit search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    // Keep focus state active when clearing to maintain UX
    // Keep focus state active when clearing to maintain UX
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Backdrop blur overlay when search is focused */}
      {isFocused && (
        <div
          className="fixed inset-0  z-40 transition-all duration-300"
          onClick={() => {
            setIsFocused(false);
          }}
        />
      )}

      <div
        className={`transition-all duration-300 ease-out ${isFocused
          ? 'fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50'
          : 'relative w-fit'
          }`}
        ref={searchRef}
      >
        <div className={`flex items-center w-full transition-all duration-300 ${isFocused
          ? 'px-6 py-3 bg-white rounded-full border-2 shadow-2xl border-amber-500'
          : 'p-0 border-transparent'
          }`}>
          {isFocused && (
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-transparent outline-none text-sm flex-1 min-w-0 mr-2 placeholder-gray-400"
            />
          )}

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Loading spinner */}
            {isFocused && isLoading && (
              <DotLoader size={16} color="#6B7280" ariaLabel="Searching" />
            )}

            {/* Clear button */}
            {isFocused && query && !isLoading && (
              <button
                onClick={handleClear}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}

            {/* Search button */}
            <button
              onClick={() => {
                if (!isFocused) {
                  setIsFocused(true);
                } else {
                  handleSearch();
                }
              }}
              className={`hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ${isFocused ? 'p-1' : 'w-10 h-10 flex items-center justify-center bg-white '
                }`}
              aria-label="Search"
            >
              <Search className={`${isFocused ? 'w-4 h-4 text-gray-400' : 'w-5 h-5 text-gray-700'}`} />
            </button>
          </div>
        </div>

        {/* No autocomplete dropdown (removed for performance) */}
      </div>
    </>
  );
};

export default SearchComponent;