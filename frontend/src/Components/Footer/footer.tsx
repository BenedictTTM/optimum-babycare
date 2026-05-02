'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Twitter, Linkedin, Phone, Mail, Package, HeadphonesIcon, RotateCcw, Tags, ArrowRight } from 'lucide-react';
import { apiClient } from '@/api/clients';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/newsletter/subscribe', { email });
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-50 pt-10 pb-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Benefits Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="flex items-center gap-4 px-4 w-full md:w-1/4">
            <Package className="text-red-500 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-gray-900">INTERNATIONAL SHIPMENT</h4>
              <p className="text-xs text-gray-500">Orders are shipped seamlessly between countries</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 w-full md:w-1/4 pt-4 md:pt-0">
            <HeadphonesIcon className="text-red-500 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-gray-900">ONLINE SUPPORT 24/7</h4>
              <p className="text-xs text-gray-500">Orders are shipped seamlessly between countries</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 w-full md:w-1/4 pt-4 md:pt-0">
            <RotateCcw className="text-red-500 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-gray-900">MONEY RETURN</h4>
              <p className="text-xs text-gray-500">Orders are shipped seamlessly between countries</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 w-full md:w-1/4 pt-4 md:pt-0">
            <Tags className="text-red-500 w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-gray-900">MEMBER DISCOUNT</h4>
              <p className="text-xs text-gray-500">Orders are shipped seamlessly between countries</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Solid is the information & experience directed at an end-user</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="text-red-500 w-8 h-8 font-light" strokeWidth={1} />
                <div>
                  <p className="text-xs text-gray-500">Mon - Fri: 9:00-20:00</p>
                  <p className="font-bold text-sm">0020 500 - CALL - 000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-red-500 w-8 h-8 font-light" strokeWidth={1} />
                <div>
                  <p className="text-xs text-gray-500">Get Free Support</p>
                  <p className="font-bold text-sm">info@webmail.com</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><Youtube size={16} /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><Twitter size={16} /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><Linkedin size={16} /></a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-sm mb-6">ABOUT US</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Elegant pink origami design three type of dimensional view and decoration co Great for adding a decorative touch to any room's decor.
            </p>
            <Link href="/contact" className="text-sm font-bold flex items-center gap-1 hover:text-red-500">
              GET IN TOUCH <ArrowRight size={16} />
            </Link>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-sm mb-6">INFORMATION</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-red-500">About</Link></li>
              <li><Link href="/help" className="text-sm text-gray-500 hover:text-red-500">FAQ's</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-red-500">Wishlist</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-500 hover:text-red-500">Cart</Link></li>
              <li><Link href="/checkout" className="text-sm text-gray-500 hover:text-red-500">Checkout</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-bold text-sm mb-6">MY ACCOUNT</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-red-500">Wishlist</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-500 hover:text-red-500">Cart</Link></li>
              <li><Link href="/checkout" className="text-sm text-gray-500 hover:text-red-500">Checkout</Link></li>
              <li><Link href="/profile" className="text-sm text-gray-500 hover:text-red-500">My Account</Link></li>
              <li><Link href="/products" className="text-sm text-gray-500 hover:text-red-500">Shop</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-sm mb-6">GET NEWSLETTER</h3>
            <p className="text-sm text-gray-500 mb-4">Get 10% off your first order! Hurry up</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubscribe();
                }}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:border-red-500"
              />
              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-auto px-6 py-3 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'} {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="font-bold text-sm">Order faster with our App!</span>
            <div className="flex gap-2">
              <button className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-2">
                 <span className="text-xs">Download on the<br/><strong className="text-sm">App Store</strong></span>
              </button>
              <button className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-2">
                 <span className="text-xs">GET IT ON<br/><strong className="text-sm">Google Play</strong></span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 opacity-70 grayscale">
            <span className="font-bold text-sm">Wallet</span>
            <span className="font-bold text-sm italic">Payoneer</span>
            <span className="font-bold text-sm">amazon</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;