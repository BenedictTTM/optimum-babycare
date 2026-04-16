'use client'

import React from 'react'
import Link from 'next/link'

const MARQUEE_ITEMS = [
  { text: 'Open Door To A World Of Fashion', highlight: false },
  { text: 'Discover Now', highlight: true, href: '/main/products' },
  { text: 'Free Shipping On Orders Over $99', highlight: false },
  { text: 'Shop Now', highlight: true, href: '/main/products' },
  { text: 'New Arrivals Every Week — Stay Ahead Of The Curve', highlight: false },
  { text: 'Explore Collection', highlight: true, href: '/main/products' },
  { text: 'Premium Quality. Timeless Style.', highlight: false },
  { text: 'View Lookbook', highlight: true, href: '/main/products' },
]

const Separator = () => (
  <span className="mx-6 opacity-40 select-none" aria-hidden>✦</span>
)

const MarqueeContent = () => (
  <>
    {MARQUEE_ITEMS.map((item, i) => (
      <React.Fragment key={i}>
        {item.highlight && item.href ? (
          <Link
            href={item.href}
            className="
              inline-flex items-center gap-1.5
              font-semibold tracking-[0.18em] uppercase text-[11px]
              text-amber-300 hover:text-white
              underline-offset-2 hover:underline
              transition-colors duration-200
            "
          >
            {item.text}
            <svg
              className="w-3 h-3 shrink-0"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </Link>
        ) : (
          <span className="tracking-[0.14em] uppercase text-[11px] font-light text-white/90">
            {item.text}
          </span>
        )}
        <Separator />
      </React.Fragment>
    ))}
  </>
)

const Topbar = () => {
  return (
    <>
      {/* Keyframe defined once, scoped via a unique class */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .topbar-track {
          animation: marquee-scroll 38s linear infinite;
          will-change: transform;
        }
        .topbar-root:hover .topbar-track {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="
          topbar-root
          hidden sm:flex items-center
          w-full overflow-hidden
          relative
          bg-gradient-to-r from-neutral-900 via-zinc-800 to-neutral-900
          border-b border-white/[0.06]
          h-9
        "
        role="marquee"
        aria-label="Promotional announcements"
      >
        {/* Subtle left/right fade masks */}
        <div
          className="absolute left-0 top-0 h-full w-14 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #171717, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-14 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #171717, transparent)' }}
        />

        {/* Scrolling track — duplicated for seamless loop */}
        <div
          className="topbar-track flex items-center whitespace-nowrap"
        >
          {/* First copy */}
          <MarqueeContent />
          {/* Duplicate copy — creates the seamless loop */}
          <MarqueeContent />
        </div>
      </div>
    </>
  )
}

export default Topbar