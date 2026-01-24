'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
    children: React.ReactNode;
    speed?: number;
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
    className?: string;
}

export default function Marquee({
    children,
    speed = 50,
    direction = 'left',
    pauseOnHover = false,
    className = '',
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const firstChild = containerRef.current.children[0] as HTMLElement;
            if (firstChild) {
                setContentWidth(firstChild.offsetWidth);
            }
        }
    }, [children]);

    const duration = contentWidth / speed;
    const xFrom = direction === 'left' ? 0 : -contentWidth;
    const xTo = direction === 'left' ? -contentWidth : 0;

    return (
        <div
            className={`overflow-hidden whitespace-nowrap ${className}`}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            <motion.div
                ref={containerRef}
                className="inline-flex"
                animate={{
                    x: [xFrom, xTo],
                }}
                transition={{
                    x: {
                        duration: duration || 20,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatType: 'loop',
                    },
                }}
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                {/* Duplicate content for seamless loop */}
                <div className="inline-flex shrink-0">{children}</div>
                <div className="inline-flex shrink-0">{children}</div>
            </motion.div>
        </div>
    );
}

// Pre-styled marquee text component
interface MarqueeTextProps {
    text: string;
    speed?: number;
    direction?: 'left' | 'right';
    separator?: React.ReactNode;
}

export function MarqueeText({
    text,
    speed = 40,
    direction = 'left',
    separator = <span className="mx-8 text-tm-green">★</span>
}: MarqueeTextProps) {
    const items = Array(6).fill(text);

    return (
        <Marquee speed={speed} direction={direction} className="py-4 border-y border-tm-slate/10">
            {items.map((item, i) => (
                <span
                    key={i}
                    className="inline-flex items-center text-4xl md:text-6xl lg:text-8xl font-bold text-tm-white uppercase tracking-tighter"
                >
                    {item}
                    {separator}
                </span>
            ))}
        </Marquee>
    );
}
