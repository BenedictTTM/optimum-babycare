'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text Reveal
            gsap.fromTo(
                textRef.current?.querySelectorAll('.char') ?? [],
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.05,
                    ease: 'power4.out',
                    delay: 0.2, // Faster reveal since background is simple
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center">
            {/* Soft background decor */}
            <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-light/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-[-5vh]">
                <p className="uppercase tracking-[0.2em] text-sm font-medium mb-6 text-text-secondary whitespace-nowrap">
                    Premium Quality
                </p>

                <h1 ref={textRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary leading-[1.2] overflow-hidden max-w-5xl py-2">
                    <span className="block overflow-hidden"><span className="char inline-block">E</span><span className="char inline-block">v</span><span className="char inline-block">e</span><span className="char inline-block">r</span><span className="char inline-block">y</span><span className="char inline-block">d</span><span className="char inline-block">a</span><span className="char inline-block">y</span></span>
                    <span className="block overflow-hidden"><span className="char inline-block">E</span><span className="char inline-block">s</span><span className="char inline-block">s</span><span className="char inline-block">e</span><span className="char inline-block">n</span><span className="char inline-block">t</span><span className="char inline-block">i</span><span className="char inline-block">a</span><span className="char inline-block">l</span><span className="char inline-block">s</span></span>
                </h1>

                <p className="mt-6 font-light text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                    A curated selection of objects for daily life, designed with purpose and crafted for longevity.
                </p>

                <div className="mt-12 flex items-center justify-center">
                    <Link href="/main/products" className="group relative px-10 py-5 bg-primary text-text-primary font-semibold tracking-wide rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20">
                        <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                            Shop Collection <ArrowDownRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300" />
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
                <span className="text-text-secondary text-xs uppercase tracking-widest font-medium">Scroll</span>
            </div>
        </div>
    );
}
