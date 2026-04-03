'use client'

import React from 'react'
import { ChevronDown, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const UnderTop = () => {
    return (
        <div className="hidden md:block w-full bg-white border-b border-gray-100 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 sm:gap-6">

                {/* Left: Logo */}
                <div className="flex items-center justify-center w-full sm:w-auto gap-3">
                    <Link href="/main">
                        <Image
                            src="/logo.png"
                            alt="babylist logo"
                            width={140}
                            height={45}
                            priority
                            className="w-auto h-auto max-h-[50px] object-contain"
                        />
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                    <div className="flex w-full items-center border border-gray-200 rounded overflow-hidden bg-white h-12">
                        <button className="flex items-center gap-1.5 px-6 text-[15px] font-bold text-gray-800 hover:text-black transition-colors whitespace-nowrap bg-white">
                            All Catagories <ChevronDown className="w-4 h-4 text-black" strokeWidth={2.5} />
                        </button>
                        <div className="h-5 w-[1px] bg-gray-200"></div>
                        <input
                            type="text"
                            placeholder="Keyword here..."
                            className="flex-1 w-full bg-transparent px-5 text-[15px] outline-none placeholder-gray-400 text-gray-700"
                        />
                    </div>
                </div>

                {/* Right: Contact & Selectors */}
                <div className="flex flex-wrap items-center gap-8 ml-auto lg:ml-0">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="text-gray-500">
                            {/* Custom SVG for solid phone to match design */}
                            <svg xmlns="http://www.w3.org/Drafts/SVG/1.1" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </div>
                        <div className="text-[15px] tracking-wide">
                            <span className="text-gray-500">Need help? </span>
                            <span className="font-extrabold text-black ml-1">Call us: + 0020 500</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-[15px] text-gray-500">
                        <button className="flex items-center hover:text-black transition-colors font-medium">
                            English <ChevronDown className="w-4 h-4 ml-1.5 text-gray-400" />
                        </button>
                        <button className="flex items-center hover:text-black transition-colors font-medium">
                            USD <ChevronDown className="w-4 h-4 ml-1.5 text-gray-400" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UnderTop
