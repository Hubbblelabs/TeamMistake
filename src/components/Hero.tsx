'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import GlowButton from './ui/GlowButton';
import GradientText from './ui/GradientText';

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
    <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-tm-navy px-4">
      {/* Three.js Background Canvas - Lazy loaded */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <ThreeCanvas />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center text-center mix-blend-exclusion">

        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 overflow-hidden"
        >
          <span className="font-mono text-sm md:text-base text-tm-slate tracking-[0.2em] uppercase">
            Interactive Production Studio
          </span>
        </motion.div>

        {/* Main Heading - Split for impact */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center leading-[0.85] font-bold text-tm-white tracking-tighter"
        >
          <span className="text-[15vw] md:text-[12vw] 2xl:text-[180px]">TEAM</span>
          <span className="text-[15vw] md:text-[12vw] 2xl:text-[180px] text-transparent stroke-text" style={{ WebkitTextStroke: '2px #dfff00', color: 'transparent' }}>
            MISTAKE
          </span>
        </motion.h1>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-tm-slate/50">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-tm-slate/0 via-tm-slate/50 to-tm-slate/0" />
      </motion.div>
    </section>
  );
};

export default Hero;
