'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Small delay before removing loader
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                // Random increment for more realistic feel
                const increment = Math.floor(Math.random() * 8) + 2;
                return Math.min(prev + increment, 100);
            });
        }, 120);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-tm-navy overflow-hidden"
                >
                    {/* Center Content */}
                    <div className="relative flex flex-col items-start px-6 md:px-0">

                        {/* Animated Icons - Yellow */}
                        <div className="flex gap-1 mb-6">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: 0.4 - (i * 0.1),
                                        duration: 0.3,
                                        ease: 'easeOut'
                                    }}
                                    className="w-5 h-5 md:w-6 md:h-6 bg-[#ffd700]"
                                    style={{
                                        clipPath: i === 0
                                            ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                            : i === 1
                                                ? 'circle(50% at 50% 50%)'
                                                : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Main Logo / Title - Yellow */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="mb-4"
                        >
                            <h1 className="text-[12vw] md:text-[6vw] font-bold text-[#ffd700] leading-[0.85] tracking-[-0.06em] uppercase">
                                TEAM<br />
                                MISTAKE
                            </h1>
                        </motion.div>

                        {/* Loading Status - Yellow */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="font-mono text-[10px] md:text-xs text-[#ffd700] tracking-widest uppercase"
                        >
                            [ LOADING ... <span className="tabular-nums w-8 inline-block text-right">{progress}</span>% ]
                        </motion.div>
                    </div>

                    {/* Bottom Progress Bar - Yellow */}
                    <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12">
                        {/* Dashed background track */}
                        <div
                            className="h-[1px] w-full"
                            style={{
                                background: `repeating-linear-gradient(
                                    to right,
                                    #ffd700 0,
                                    #ffd700 4px,
                                    transparent 4px,
                                    transparent 8px
                                )`,
                                opacity: 0.3
                            }}
                        />
                        {/* Solid progress */}
                        <motion.div
                            className="absolute top-0 left-0 h-[1px] bg-[#ffd700]"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: 'linear' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
