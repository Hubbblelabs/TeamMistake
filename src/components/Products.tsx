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

      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <h2 className="text-4xl md:text-8xl font-bold text-tm-white tracking-tighter">
          SELECTED<br />
          <span className="text-tm-slate/20">WORK</span>
        </h2>

        <a href="#" className="font-mono text-xs uppercase tracking-widest text-tm-green border-b border-tm-green pb-1 hover:border-tm-white hover:text-tm-white transition-colors">
          View All Projects
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-tm-slate/10">
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group border-r border-b border-tm-slate/10 p-8 md:p-12 hover:bg-tm-slate/5 transition-colors aspect-square flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-tm-slate/40 uppercase tracking-widest">
                0{index + 1}
              </span>
              <ArrowUpRight className="w-5 h-5 text-tm-slate/40 group-hover:text-tm-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>

            <div>
              <span className="font-mono text-xs text-tm-green uppercase tracking-widest mb-2 block">
                {product.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-tm-white mb-2 leading-none group-hover:underline decoration-tm-green underline-offset-4">
                {product.title}
              </h3>
              <p className="text-tm-slate/60 text-sm leading-relaxed max-w-xs">
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default Products;
