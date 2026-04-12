'use client'

import React from 'react'
import Link from 'next/link'

const Topbar = () => {
  return (
    <div className="hidden sm:block w-full bg-amber-400 text-white py-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-[13px] sm:text-sm tracking-wide">
        <span>Open Door To A worlds Of Fashion | </span>
        <Link href="/main/products" className="font-bold hover:underline transition-all delay-75">
          Discover Now
        </Link>
      </div>
    </div>
  )
}

export default Topbar