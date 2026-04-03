'use client';
import React from 'react';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        title: string;
        price: string;
        image: string;
        description: string;
    } | null;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(contentRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
            );
        } else {
            document.body.style.overflow = '';
            gsap.to(modalRef.current, { opacity: 0, duration: 0.3 });
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    return createPortal(
        <div ref={modalRef} className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/80 backdrop-blur-md p-4">
            <div
                ref={contentRef}
                className="relative bg-[#FDFDFD] w-full max-w-4xl h-[80vh] grid grid-cols-1 md:grid-cols-2 shadow-2xl border border-neutral-100 overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                >
                    <X className="w-6 h-6 text-neutral-900" />
                </button>

                <div className="relative h-full bg-[#f0f0f0]">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2 block">New Arrival</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-light text-neutral-900 mb-4">{product.title}</h2>
                        <p className="text-xl text-neutral-600 font-medium mb-8">{product.price}</p>
                        <p className="text-neutral-500 leading-relaxed max-w-sm">
                            {product.description}
                        </p>
                    </div>

                    <button className="w-full py-4 bg-[#1A1A1A] text-white uppercase tracking-widest text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
