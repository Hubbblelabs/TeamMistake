'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tm-green/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tm-navy-lighter/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-tm-green font-mono mb-4 tracking-wide"
        >
          Hi, we are TeamMistake
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-tm-white mb-6 leading-tight"
        >
          We Deliver What You <span className="text-tm-green">NEED</span>,{' '}
          <br className="hidden md:block" />
          Not What We <span className="text-tm-slate-light">HAVE</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-tm-slate text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          At our core, we are a client-centric software company, driven by
          innovation and dedicated to crafting solutions that align with your
          unique needs. We transform challenges into opportunities through
          cutting-edge technology and personalized service.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group px-8 py-4 bg-transparent border border-tm-green text-tm-green rounded hover:bg-tm-green/10 transition-all duration-300 flex items-center gap-2 font-medium text-lg"
          >
            Start a Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-sm text-tm-slate-light font-mono"
        >
          We believe unwavering customer satisfaction is excellence.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
