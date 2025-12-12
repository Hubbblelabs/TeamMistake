'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import GlassCard from './ui/GlassCard';
import { SectionHeader } from './ui/Section';
import { GradientMeshBackground } from '@/lib/three/ShaderMaterials';
import { WireframeCube, Dodecahedron } from '@/lib/three/LowPolyShapes';
import { ParallaxElement } from '@/lib/three/ParallaxElements';

// Three.js Scene Component
function AboutScene() {
  return (
    <>
      <GradientMeshBackground
        colorA="#0a192f"
        colorB="#112240"
        colorC="#64ffda"
        noiseScale={1.5}
        noiseSpeed={0.2}
      />

      {/* Floating shapes
      <ParallaxElement depth={1.5} position={[-6, 3, 0]}>
        {/* <WireframeCube
          scale={1}
          color="#64ffda"
          rotationSpeed={0.15}
          floatIntensity={0.6}
        /> 
      </ParallaxElement> */}

    
    </>
  );
}

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Process Excellence' },
    { icon: <Shield className="w-5 h-5" />, text: 'Quality Frameworks' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Service Delivery Innovation' },
    { icon: <Users className="w-5 h-5" />, text: 'Client-Centric Approach' },
  ];

  const stats = [
    { value: '5+', label: 'Years of Excellence' },
    { value: '50+', label: 'Projects Delivered' },
    { value: '30+', label: 'Happy Clients' },
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Three.js Background */}
      {mounted && (
        <div className="absolute inset-0 z-0">
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <AboutScene />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader title="About Us" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Content - 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            <GlassCard className="p-8" tiltEnabled={false}>
              <p className="text-tm-slate text-lg leading-relaxed mb-6">
                We are a global services provider delivering technology-driven
                business solutions that meet the planned objectives of our
                clients.
              </p>
              <p className="text-tm-slate text-lg leading-relaxed">
                We deliver unmatched business value through process excellence,
                quality frameworks, and service delivery innovation. Our team is
                dedicated to understanding your unique challenges and crafting
                bespoke solutions that drive growth and efficiency.
              </p>
            </GlassCard>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-tm-navy-lighter/30 backdrop-blur-sm border border-tm-navy-lighter/50 hover:border-tm-green/30 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-tm-green/10 text-tm-green group-hover:bg-tm-green/20 transition-colors">
                    {feature.icon}
                  </div>
                  <span className="text-tm-slate-light font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Cards - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {stats.map((stat, index) => (
              <GlassCard
                key={index}
                className="p-8 text-center"
                glowColor="rgba(100, 255, 218, 0.15)"
              >
                <motion.h3
                  className="text-5xl font-bold text-tm-green mb-2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.15,
                    type: 'spring',
                    stiffness: 200
                  }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-tm-slate-light font-mono text-sm">
                  {stat.label}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
