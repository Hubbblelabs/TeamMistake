'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy-load Three.js Canvas to reduce initial JS bundle and main thread blocking
const ThreeCanvas = dynamic(
  () => import('./HeroCanvas'),
  {
    ssr: false,
    loading: () => null // No loading indicator - seamless experience
  }
);

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-tm-navy">
      {/* Three.js Background Canvas - Lazy loaded */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <ThreeCanvas />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6">

        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <span className="font-mono text-xs md:text-sm text-tm-slate tracking-[0.2em] uppercase">
            Experience the Excellence in Our Solution
          </span>
        </motion.div>

        {/* Main Heading - Extra Large Typography */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center leading-[0.82] font-bold text-tm-white tracking-[-0.06em] uppercase mix-blend-exclusion"
        >
          <span className="text-[18vw] md:text-[14vw] lg:text-[12vw]">TEAM</span>
          <span
            className="text-[18vw] md:text-[14vw] lg:text-[12vw] text-transparent"
            style={{
              WebkitTextStroke: '2px var(--tm-green)',
              color: 'transparent'
            }}
          >
            MISTAKE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-base md:text-lg text-tm-slate/70 max-w-[600px] font-mono"
        >
          We Deliver What You NEED, Not What We HAVE
        </motion.p>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/40">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-12 bg-gradient-to-b from-tm-slate/50 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
