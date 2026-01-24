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
                const increment = Math.floor(Math.random() * 10) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-tm-navy text-tm-slate overflow-hidden font-mono"
                >
                    {/* Top/Center Content */}
                    <div className="relative w-full max-w-5xl px-6 flex flex-col items-start md:items-center">

                        {/* Animated Icons / Graphic Placeholder */}
                        <div className="flex gap-1 mb-4 select-none">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                                    className="w-4 h-4 md:w-6 md:h-6 bg-tm-slate"
                                    style={{ clipPath: i === 2 ? 'circle(50% at 50% 50%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                                />
                            ))}
                        </div>

                        {/* Loader Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs md:text-sm tracking-widest font-bold mb-2 uppercase"
                        >
                            [ LOADING ... <span className="tabular-nums">{progress}</span>% ]
                        </motion.div>

                    </div>

                    {/* Bottom Line Progress Bar */}
                    <div className="absolute bottom-10 left-6 right-6 md:left-12 md:right-12 h-[1px] bg-tm-navy-lighter overflow-hidden">
                        <motion.div
                            className="h-full bg-tm-slate"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
