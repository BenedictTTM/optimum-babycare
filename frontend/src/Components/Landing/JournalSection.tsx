'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function JournalSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(imgRef.current, { scale: 1.1 }, {
                scale: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-[#F5F5F0] overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                        <div ref={imgRef} className="absolute inset-0 w-full h-full">
                            <Image
                                src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop"
                                alt="Studio atmosphere"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 whitespace-nowrap">The Journal</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-light text-neutral-900 leading-tight">
                            Crafting the Future of <br /> Everyday Luxury.
                        </h2>
                        <p className="text-neutral-600 text-lg leading-relaxed max-w-md">
                            We believe that the objects we surround ourselves with shape our daily rituals. Our mission is to elevate the mundane through considered design and exceptional quality.
                        </p>
                        <a href="/journal" className="inline-block border-b border-neutral-900 pb-1 text-sm font-medium uppercase tracking-wide hover:text-neutral-600 transition-colors whitespace-nowrap">
                            Read Our Story
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
