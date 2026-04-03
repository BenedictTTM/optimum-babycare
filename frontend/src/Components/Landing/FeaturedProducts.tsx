'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductModal from './ProductModal';

gsap.registerPlugin(ScrollTrigger);

const featuredProducts = [
    {
        id: 1,
        title: 'Velvet Matte Lipstick',
        price: '$32.00',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop',
        description: 'A long-wearing, hydrating matte lipstick that delivers intense color payoff in a single stroke.',
    },
    {
        id: 2,
        title: 'Hydrating Face Serum',
        price: '$48.00',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
        description: 'Formulated with hyaluronic acid and vitamin B5 to replenish moisture and restore radiance.',
    },
    {
        id: 3,
        title: 'Ceramic Diffuser',
        price: '$85.00',
        image: 'https://plus.unsplash.com/premium_photo-1672406540156-b3dc8c27de02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGlmZnVzZXJ8ZW58MHx8MHx8fDA%3D',
        description: 'Handcrafted ceramic essential oil diffuser. Silent ultrasonic technology with ambient light.',
    },
];

export default function FeaturedProducts() {
    const [selectedProduct, setSelectedProduct] = useState<typeof featuredProducts[0] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.product-card', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-32 bg-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-16 text-center">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 whitespace-nowrap">Selected Works</span>
                    <h2 className="mt-4 text-4xl font-serif text-neutral-900">Essentials for Living</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {featuredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="product-card group cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <span className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-semibold shadow-xl whitespace-nowrap">Quick View</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-lg font-medium text-neutral-900 mb-1">{product.title}</h3>
                                <p className="text-neutral-500 font-serif italic">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </section>
    );
}
