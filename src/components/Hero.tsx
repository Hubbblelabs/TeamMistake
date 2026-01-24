'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      {/* Three.js Background Canvas - Lazy loaded */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <ThreeCanvas />
        </div>
      )}

      {/* Premium gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-tm-navy via-transparent to-tm-navy pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-tm-navy/60 via-transparent to-tm-navy/60 pointer-events-none z-[1]" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[1]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} 
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-tm-navy-light/60 backdrop-blur-xl border border-tm-gold/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-tm-gold animate-pulse" />
          <span className="text-tm-slate-light text-sm tracking-wide font-medium">
            Team Mistake Technologies
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-tm-white mb-8 leading-[1.1] tracking-tight"
        >
          We Deliver What You{' '}
          <GradientText className="text-4xl md:text-6xl lg:text-7xl font-bold">
            Need
          </GradientText>
          <br className="hidden md:block" />
          <span className="text-tm-slate-light">Not What We Have</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-tm-slate text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          A client-centric software company driven by innovation. 
          We craft tailored solutions that transform challenges into 
          opportunities through cutting-edge technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlowButton href="#contact" variant="primary" size="lg">
            Start a Project
            <ArrowRight className="w-5 h-5" />
          </GlowButton>

          <GlowButton href="#products" variant="ghost" size="lg">
            Explore Our Work
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-tm-slate-muted text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-tm-gold/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
