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
      title: 'Billing, Sales & Inventory',
      description:
        'Complete business management solution for invoicing, financial tracking, and inventory control.',
      icon: <Receipt className="w-10 h-10 text-tm-green" />,
    },
    {
      title: 'Website & Logo Design',
      description:
        'Crafting unique digital identities with stunning visuals and user-centric designs.',
      icon: <Palette className="w-10 h-10 text-tm-green" />,
    },
    {
      title: 'Virtual Assistance for Students',
      description:
        'Dedicated support for school students to help with academic tasks and organization.',
      icon: <Users className="w-10 h-10 text-tm-green" />,
    },
    {
      title: 'Student Management',
      description:
        'Comprehensive systems to manage student data, attendance, and academic records.',
      icon: <GraduationCap className="w-10 h-10 text-tm-green" />,
    },
    {
      title: 'Learning Management System',
      description:
        'Empower education with flexible, scalable, and interactive learning platforms.',
      icon: <BookOpen className="w-10 h-10 text-tm-green" />,
    },
    {
      title: 'Customer Relationship Management',
      description:
        'Enhance customer engagement and drive sales with our intuitive CRM tools.',
      icon: <Users className="w-10 h-10 text-tm-green" />,
    },
  ];

  return (
    <section id="products" className="py-24 px-6 relative overflow-hidden bg-tm-navy">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Our Products & Services"
            subtitle="Comprehensive solutions tailored to your business needs"
          />
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                className="h-full p-8 group cursor-pointer"
                glowColor="rgba(100, 255, 218, 0.15)"
              >
                {/* Icon */}
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {product.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-tm-white group-hover:text-tm-green transition-colors">
                      {product.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-tm-slate opacity-0 group-hover:opacity-100 group-hover:text-tm-green transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-tm-green font-mono text-sm hover:underline underline-offset-4 group"
          >
            Looking for something custom?
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
