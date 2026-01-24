'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Products = () => {
  const products = [
    {
      title: 'Inventory & Billing',
      category: 'Enterprise',
      description: 'Complete business management solution.'
    },
    {
      title: 'Custom Brand Identity',
      category: 'Design',
      description: 'Crafting unique digital identities.'
    },
    {
      title: 'Student Assistance AI',
      category: 'EdTech',
      description: 'Dedicated virtual support for academics.'
    },
    {
      title: 'School Management',
      category: 'Platform',
      description: 'Comprehensive data and record systems.'
    },
    {
      title: 'Learning Systems',
      category: 'Education',
      description: 'Interactive and scalable learning platforms.'
    },
    {
      title: 'CRM Solutions',
      category: 'Enterprise',
      description: 'Enhanced customer engagement tools.'
    }
  ];

  return (
    <section id="products" className="py-24 px-6 md:px-12 bg-tm-navy relative z-10">

      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
        <div>
          <span className="font-mono text-xs text-tm-green uppercase tracking-[0.2em] mb-4 block">
            [ Selected Work ]
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold text-tm-white tracking-[-0.04em] uppercase leading-[0.9]">
            Projects
          </h2>
        </div>

        <a
          href="#"
          className="group font-mono text-xs uppercase tracking-widest text-tm-slate flex items-center gap-2 hover:text-tm-green transition-colors"
        >
          View All
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-tm-slate/10">
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative bg-tm-navy p-8 md:p-10 aspect-square flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Hover Background */}
            <div className="absolute inset-0 bg-tm-slate/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Row */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-mono text-xs text-tm-slate/40 uppercase tracking-widest">
                0{index + 1}
              </span>
              <ArrowUpRight className="w-5 h-5 text-tm-slate/30 group-hover:text-tm-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <span className="font-mono text-[10px] text-tm-green uppercase tracking-widest mb-3 block">
                {product.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-tm-white mb-3 leading-[1.1] tracking-tight group-hover:text-tm-green transition-colors duration-300">
                {product.title}
              </h3>
              <p className="text-sm text-tm-slate/50 leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.description}
              </p>
            </div>

            {/* Bottom Border Animation */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-tm-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default Products;
