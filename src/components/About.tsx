'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { SectionHeader } from './ui/Section';

const About = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden bg-tm-navy">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-tm-navy via-tm-navy-light/30 to-tm-navy pointer-events-none" />

      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-tm-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-tm-green/3 rounded-full blur-3xl pointer-events-none" />

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
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-6"
          >
            <motion.div variants={itemVariants}>
              <GlassCard className="p-8 md:p-10" tiltEnabled={false}>
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
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                  }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-tm-navy-lighter/30 backdrop-blur-sm border border-tm-navy-lighter/50 transition-all duration-300 cursor-default group"
                >
                  <motion.div
                    className="p-2 rounded-lg bg-tm-green/10 text-tm-green"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <span className="text-tm-slate-light font-medium group-hover:text-tm-white transition-colors duration-300">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Cards - 2 columns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <GlassCard
                  className="p-8 md:p-10 text-center"
                  glowColor="rgba(100, 255, 218, 0.08)"
                >
                  <motion.h3
                    className="text-5xl font-bold text-tm-green mb-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + index * 0.1,
                      ease: 'easeOut',
                    }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-tm-slate-light font-mono text-sm">
                    {stat.label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
