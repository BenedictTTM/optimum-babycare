'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        // Initial hide until mouse moves
        gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, opacity: 0 });

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, opacity: 1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, opacity: 1, ease: 'power2.out' });
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .magnetic-target');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        // Cleanup and Re-bind for dynamic content (simple observer could be better for SPA, but this is a light pass)
        const observer = new MutationObserver((mutations) => {
            const newElements = document.querySelectorAll('a, button, input, textarea, .magnetic-target');
            newElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
                el.addEventListener('mouseenter', handleHoverStart);
                el.addEventListener('mouseleave', handleHoverEnd);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            observer.disconnect();
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, []);

    useEffect(() => {
        if (isHovering) {
            gsap.to(cursorRef.current, { scale: 0.5, duration: 0.3 });
            gsap.to(followerRef.current, { scale: 1.5, backgroundColor: 'rgba(26, 26, 26, 0.1)', borderColor: 'transparent', duration: 0.3 });
        } else {
            gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
            gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: '#1A1A1A', duration: 0.3 });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-neutral-900 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-neutral-900 rounded-full pointer-events-none z-[9998] transition-transform"
            />
        </>
    );
}
