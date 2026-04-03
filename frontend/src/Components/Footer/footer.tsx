'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Truck, Headphones, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const services = [
    {
      icon: Truck,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
    },
    {
      icon: Headphones,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
    },
    {
      icon: ShieldCheck,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
    },
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [services.length]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    }
  };

  const CurrentIcon = services[currentSlide].icon;

  return (
    <footer className="bg-white py-16 px-6">
      {/* Services Section - Carousel on Mobile, Grid on Desktop */}
      <div className="max-w-6xl mx-auto mb-16">
        {/* Mobile Carousel */}
        <div
          className="md:hidden relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <CurrentIcon className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-bold mb-2 text-black">
              {services[currentSlide].title}
            </h3>
            <p className="text-xs text-gray-600">
              {services[currentSlide].description}
            </p>
          </div>

          {/* Navigation Dots - Mobile Only */}
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-black w-6' : 'bg-gray-300'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid - All 3 Visible */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-md mx-auto text-center">

        {/* Newsletter Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-medium mb-4 text-amber-700" >
            Join Our Newsletter
          </h2>
          <p className="text-gray-700 text-sm mb-8 leading-relaxed">
            Stay updated with the latest trends,<br />
            exclusive offers, and more.
          </p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <button className="w-auto px-8 py-2.5 bg-[#5DADE2] text-white text-sm font-medium rounded-md hover:bg-[#4A9DD6] transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-medium mb-6 text-amber-700" >
            Quick Links
          </h3>
          <ul className="space-y-3">
          
            <li>
              <Link href="/main/products" className="text-gray-700 hover:text-gray-900 transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/main/help" className="text-gray-700 hover:text-gray-900 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/main/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Stay Connected Section */}
        <div>
          <h3 className="text-2xl font-medium mb-6 text-amber-700">
            Stay Connected
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-[#D946A6] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-[#D946A6] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-[#D946A6] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;