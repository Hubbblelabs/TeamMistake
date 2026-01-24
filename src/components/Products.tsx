'use client';

import { motion } from 'framer-motion';
import {
  Receipt,
  Palette,
  GraduationCap,
  BookOpen,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { SectionHeader } from './ui/Section';

const Products = () => {
  const products = [
    {
      title: 'Billing & Inventory',
      description:
        'Complete business management with invoicing, financial tracking, and inventory control.',
      icon: <Receipt className="w-8 h-8" />,
      tag: 'Business',
    },
    {
      title: 'Web & Brand Design',
      description:
        'Stunning digital identities with user-centric designs and visual excellence.',
      icon: <Palette className="w-8 h-8" />,
      tag: 'Design',
    },
    {
      title: 'Virtual Assistance',
      description:
        'Dedicated support for students with academic tasks and organization.',
      icon: <Users className="w-8 h-8" />,
      tag: 'Education',
    },
    {
      title: 'Student Management',
      description:
        'Comprehensive systems for student data, attendance, and academic records.',
      icon: <GraduationCap className="w-8 h-8" />,
      tag: 'Education',
    },
    {
      title: 'Learning Platform',
      description:
        'Flexible, scalable, and interactive learning management solutions.',
      icon: <BookOpen className="w-8 h-8" />,
      tag: 'EdTech',
    },
    {
      title: 'CRM Solutions',
      description:
        'Enhance engagement and drive sales with intuitive relationship tools.',
      icon: <Users className="w-8 h-8" />,
      tag: 'Business',
    },
  ];

  return (
    <section id="products" className="py-32 px-6 relative overflow-hidden bg-tm-navy-light/30">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-tm-navy via-tm-navy-light/10 to-tm-navy pointer-events-none" />
      
      {/* Subtle accent glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-tm-gold/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader
            title="Products & Services"
            subtitle="Comprehensive solutions tailored to elevate your business"
          />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard
                className="h-full p-8 group cursor-pointer"
                glowColor="rgba(212, 168, 83, 0.1)"
              >
                {/* Tag */}
                <div className="mb-6">
                  <span className="text-[11px] font-medium tracking-wider uppercase text-tm-gold/80 bg-tm-gold/10 px-3 py-1 rounded-full">
                    {product.tag}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-6 text-tm-gold/80 group-hover:text-tm-gold transition-colors duration-500">
                  {product.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold text-tm-white group-hover:text-tm-gold transition-colors duration-300">
                      {product.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-tm-slate-muted opacity-0 group-hover:opacity-100 group-hover:text-tm-gold transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <p className="text-tm-slate text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-tm-slate-light hover:text-tm-gold text-sm transition-colors duration-300 group"
          >
            <span className="font-medium">Looking for something custom?</span>
            <span className="text-tm-gold">Let&apos;s talk</span>
            <ArrowUpRight className="w-4 h-4 text-tm-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
