'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import GlowButton from './ui/GlowButton';
import GradientText from './ui/GradientText';
import ParticleGrid from '@/lib/three/ParticleGrid';

// Three.js Scene Component - Dots only, no lines
function HeroScene() {
  return (
    <ParticleGrid
      count={600}
      size={3}
      color="#64ffda"
      opacity={0.5}
      spread={25}
      speed={0.15}
      mouseInteraction={true}
    />
  );
}

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      {/* Three.js Background Canvas - Dots only */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 10], fov: 75 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <HeroScene />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* CSS Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tm-navy/20 to-tm-navy/80 pointer-events-none z-[1]" />

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tm-navy-lighter/40 backdrop-blur-sm border border-tm-green/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-tm-green" />
          <span className="text-tm-green font-mono text-sm tracking-wide">
            Hi, we are Team Mistake Technologies
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-tm-green font-mono text-base md:text-lg mb-6 tracking-wide"
        >
          Experience the Excellence in Our Solution
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-tm-white mb-6 leading-tight"
        >
          We Deliver What You{' '}
          <GradientText className="text-4xl md:text-6xl lg:text-7xl font-bold">
            NEED
          </GradientText>
          ,{' '}
          <br className="hidden md:block" />
          Not What We{' '}
          <span className="text-tm-slate-light">HAVE</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-tm-slate text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          At our core, we are a client-centric software company, driven by
          innovation and dedicated to crafting solutions that align with your
          unique needs. We transform challenges into opportunities through
          cutting-edge technology and personalized service.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlowButton href="#contact" variant="secondary" size="lg">
            Get In Touch
            <ArrowRight className="w-5 h-5" />
          </GlowButton>

          <GlowButton href="#products" variant="ghost" size="lg">
            View Our Work
          </GlowButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-sm text-tm-slate-light font-mono flex items-center justify-center gap-2"
        >
          <span className="w-8 h-[1px] bg-tm-slate-light/30" />
          We believe unwavering customer satisfaction is excellence.
          <span className="w-8 h-[1px] bg-tm-slate-light/30" />
        </motion.p>
      </div>


    </section>
  );
};

export default Hero;
