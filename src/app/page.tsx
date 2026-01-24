import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { MarqueeText } from '@/components/Marquee';
import About from '@/components/About';
import SpiralShowcase from '@/components/SpiralShowcase';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-tm-navy min-h-screen text-tm-slate font-body selection:bg-tm-green selection:text-tm-navy">
      <Navbar />
      <main>
        <Hero />

        {/* Marquee Section */}
        <MarqueeText
          text="Purpose-Built Software"
          speed={60}
          direction="left"
        />

        <About />

        {/* 3D Spiral Project Showcase */}
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
