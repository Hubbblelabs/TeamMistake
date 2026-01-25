'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { MarqueeText } from '@/components/Marquee';
import WhoWeAre from '@/components/WhoWeAre';
import SpiralShowcase from '@/components/SpiralShowcase';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Lazy-load the 3D background
const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <div className="bg-tm-navy min-h-screen text-tm-slate font-body selection:bg-tm-green selection:text-tm-navy">
      {/* Global Interactive Background - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroCanvas />
      </div>

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <MarqueeText
          text="PURPOSE-BUILT SYSTEMS"
          speed={50}
          direction="left"
        />

        {/* Who We Are Section - Transparent background */}
        <WhoWeAre />

        {/* 3D Spiral Project Showcase - Solid background to hide grid */}
        <SpiralShowcase />

        {/* Second Marquee */}
        <MarqueeText
          text="Digital Excellence"
          speed={50}
          direction="right"
        />

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
