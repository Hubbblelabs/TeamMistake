'use client';

import { motion } from 'framer-motion';

const About = () => {

  const capabilities = [
    "Digital Strategy",
    "Brand Identity",
    "Web Development",
    "Mobile Applications",
    "E-Commerce",
    "Content Creation"
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-tm-navy relative overflow-hidden">

      {/* Decorative Grid Line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-tm-slate/10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

        {/* Sticker / Label */}
        <div className="lg:col-span-3">
          <span className="font-mono text-xs text-tm-green uppercase tracking-[0.2em] border border-tm-green/30 px-3 py-1 rounded-full">
            Who We Are
          </span>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-16">

          {/* Introduction Statement */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-tm-white leading-[1.1] tracking-tight">
            We are a digital production studio crafting <span className="text-tm-slate/50">immersive experiences</span> for the modern web.
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <p className="text-tm-slate text-lg leading-relaxed">
              At Team Mistake, we don't just build websites; we create digital ecosystems.
              Our approach combines technical precision with artistic direction to deliver
              platforms that look stunning and perform flawlessly.
            </p>
            <p className="text-tm-slate text-lg leading-relaxed">
              We believe in the power of "mistakes" — the happy accidents and iterative
              processes that lead to true innovation. We push boundaries to deliver
              what you need, not just what's expected.
            </p>
          </div>

          {/* Capabilities List */}
          <div className="pt-12 border-t border-tm-slate/10">
            <span className="font-mono text-xs text-tm-slate/50 uppercase tracking-widest block mb-8">Capabilities</span>
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {capabilities.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl md:text-3xl font-bold text-tm-white hover:text-tm-green transition-colors cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
