'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Users, TrendingUp } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { SectionHeader } from './ui/Section';

const About = () => {
  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Process Excellence', description: 'Streamlined workflows for optimal results' },
    { icon: <Shield className="w-5 h-5" />, text: 'Quality Frameworks', description: 'Industry-leading standards and practices' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Service Innovation', description: 'Cutting-edge delivery methodologies' },
    { icon: <Users className="w-5 h-5" />, text: 'Client-Centric', description: 'Your success is our priority' },
  ];

  const stats = [
    { value: '5+', label: 'Years of Excellence', sublabel: 'Since 2019' },
    { value: '50+', label: 'Projects Delivered', sublabel: 'Across industries' },
    { value: '30+', label: 'Happy Clients', sublabel: 'Worldwide' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden bg-tm-navy">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-tm-navy via-tm-navy-light/20 to-tm-navy pointer-events-none" />
      
      {/* Subtle radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-tm-gold/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader title="About Us" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Content - 3 columns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <GlassCard className="p-10 md:p-12" tiltEnabled={false}>
                <p className="text-tm-slate-light text-lg leading-relaxed mb-6">
                  We are a global services provider delivering technology-driven
                  business solutions that meet the strategic objectives of our
                  clients.
                </p>
                <p className="text-tm-slate text-base leading-relaxed">
                  Our commitment to excellence is reflected in our process-driven approach, 
                  quality frameworks, and continuous innovation. We partner with you to 
                  understand your unique challenges and craft bespoke solutions that 
                  drive sustainable growth.
                </p>
              </GlassCard>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-5 rounded-xl bg-tm-navy-light/40 backdrop-blur-sm border border-tm-navy-lighter/50 hover:border-tm-gold/20 transition-all duration-500 cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-tm-gold/10 to-tm-gold/5 text-tm-gold group-hover:from-tm-gold/20 group-hover:to-tm-gold/10 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <div>
                      <span className="text-tm-white font-medium block mb-1 group-hover:text-tm-gold transition-colors duration-300">
                        {feature.text}
                      </span>
                      <span className="text-tm-slate-muted text-sm">
                        {feature.description}
                      </span>
                    </div>
                  </div>
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
            className="lg:col-span-2 space-y-5"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <GlassCard
                  className="p-8 md:p-10"
                  glowColor="rgba(212, 168, 83, 0.06)"
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    <motion.h3
                      className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-tm-gold-light via-tm-gold to-tm-gold-dark bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {stat.value}
                    </motion.h3>
                  </div>
                  <p className="text-tm-white font-medium text-lg mb-1">
                    {stat.label}
                  </p>
                  <p className="text-tm-slate-muted text-sm">
                    {stat.sublabel}
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
