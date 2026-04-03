"use client";

import React from 'react';
import { User, ShoppingBag, Menu, X, Home, Package, LogIn, ChevronDown } from 'lucide-react';
import { Inter, Montserrat } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartCount } from '@/hooks/useCartCount';
import Link from 'next/link';
import Image from 'next/image';
import SearchComponent from './searchComponent';


const inter = Inter({ subsets: ['latin'] });
const clashDisplay = Montserrat({ subsets: ['latin'], weight: '700' });

export default function MainNavBar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [cartMenuOpen, setCartMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { itemCount, shouldPulse } = useCartCount();
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCartMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setCartMenuOpen(true);
  };

  const scheduleCloseCartMenu = (delay = 200) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setCartMenuOpen(false);
      closeTimeoutRef.current = null;
    }, delay);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>

      <motion.nav
        // Make navbar relative by default, fixed on medium+ screens — avoids positional conflicts that can cause horizontal overflow
        className="backdrop-blur-xs relative md:sticky w-full top-0 z-50 bg-gray-50"
        animate={
          // Reduce nav padding on small screens for a tighter header
          scrolled
            ? (isSmallScreen ? { paddingTop: 0, paddingBottom: 0, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' } : { paddingTop: 1, paddingBottom: 1, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' })
            : (isSmallScreen ? { paddingTop: 1, paddingBottom: 1, boxShadow: '0 8px 20px rgba(0,0,0,0.04)' } : { paddingTop: 2, paddingBottom: 2, boxShadow: '0 12px 30px rgba(0,0,0,0.04)' })
        }
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* Left: Mobile hamburger and Desktop Category Toggle */}
            <div className="flex items-center lg:w-[260px]">
              {isSmallScreen && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors mr-2"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              
              {/* Mobile Search */}
              <div className="md:hidden">
                <SearchComponent />
              </div>

              {/* Desktop Category Toggle - matches sidebar width */}
              <div className="hidden lg:flex items-center justify-between w-full bg-red-500 text-white px-5 py-4 cursor-pointer rounded-tr-md rounded-tl-md">
                <span className="font-bold text-[15px]">All Categories</span>
                <ChevronDown className="w-4 h-4 text-white/90" />
              </div>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center space-x-10">
              <Link href="/main" className={`flex items-center space-x-1 text-[15px] font-bold text-red-500 hover:text-red-600 transition-colors ${clashDisplay.className}`}>
                <span>Home</span>
                <span className="text-red-500 font-medium text-[16px]">+</span>
              </Link>
              <Link href="/main/products" className={`flex items-center space-x-1 text-[15px] font-bold text-black hover:text-red-500 transition-colors ${clashDisplay.className}`}>
                <span>Shop</span>
                <span className="text-gray-400 font-medium text-[16px]">+</span>
              </Link>
              <Link href="#" className={`flex items-center space-x-1 text-[15px] font-bold text-black hover:text-red-500 transition-colors ${clashDisplay.className}`}>
                <span>Pages</span>
                <span className="text-gray-400 font-medium text-[16px]">+</span>
              </Link>
              <Link href="/main/blog" className={`flex items-center space-x-1 text-[15px] font-bold text-black hover:text-red-500 transition-colors ${clashDisplay.className}`}>
                <span>Blog</span>
                <span className="text-gray-400 font-medium text-[16px]">+</span>
              </Link>
              <Link href="/main/contact" className={`text-[15px] font-bold text-black hover:text-red-500 transition-colors ${clashDisplay.className}`}>
                <span>Contact</span>
              </Link>
            </div>
            
            {/* Center Logo for Mobile */}
            <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <Link href="/main">
              <Image
                src="/logo.png"
                alt="babylist logo"
                width={135}
                height={45}
                priority
                className="w-auto h-auto max-h-[52px] object-contain"
              />
            </Link>
          </div>

            {/* Right: navigation and cart + user */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4">
              <div className="hidden md:block">
                <SearchComponent />
              </div>

              <Link
                href="/profile"
                aria-label="Account"
                title="Account"
                className="w-10 h-10 bg-white  flex items-center justify-center rounded-full hover:bg-gray-50 transition group"
              >
                <User className="w-5 h-5 text-gray-800 group-hover:text-red-500 transition-colors" />
              </Link>

              <div className="relative">
                <Link
                  href="/main/cart"
                  aria-label={`Cart with ${itemCount} items`}
                  title={`Cart (${itemCount} items)`}
                  onMouseEnter={openCartMenu}
                  onFocus={openCartMenu}
                  onMouseLeave={() => scheduleCloseCartMenu()}
                  onBlur={() => scheduleCloseCartMenu(0)}
                  onClick={(e) => {
                    if (isSmallScreen) {
                      e.preventDefault();
                      if (cartMenuOpen) scheduleCloseCartMenu(0);
                      else openCartMenu();
                    }
                  }}
                  aria-expanded={cartMenuOpen}
                  className={`w-10 h-10 bg-white  flex items-center justify-center rounded-full transition-all relative group`}
                >
                  <ShoppingBag className="w-5 h-5 text-gray-800 group-hover:text-red-500 transition-colors" />
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute -top-1.5 -right-1.5 flex items-center justify-center
                        bg-red-500 text-white text-[10px]
                        w-5 h-5 rounded-full
                        font-bold shadow-sm ring-2 ring-white
                        ${shouldPulse ? 'animate-bounce' : ''} ${inter.className}`}
                      aria-hidden="true"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </Link>


              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu / Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className={`text-xl font-bold text-gray-900 ${clashDisplay.className}`}>Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Search in Sidebar */}
                <div className="mb-6 relative z-[80]">
                  <SearchComponent />
                </div>

                <Link
                  href="/main/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className={`font-medium ${inter.className}`}>Home</span>
                </Link>

                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className={`font-medium ${inter.className}`}>Login</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className={`font-medium ${inter.className}`}>Profile</span>
                </Link>

                <Link
                  href="/main/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span className={`font-medium ${inter.className}`}>Orders</span>
                </Link>

                <Link
                  href="/main/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className={`font-medium ${inter.className}`}>Cart</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  )
}