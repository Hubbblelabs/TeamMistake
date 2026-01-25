'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#spiral-showcase' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-start pointer-events-none">

        {/* Logo - Top Left */}
        <Link
          href="/"
          className="pointer-events-auto group relative z-50"
        >
          <div className="flex flex-col transform transition-transform group-hover:scale-105">
            <span className="font-mono text-xs md:text-sm text-tm-slate tracking-widest uppercase mb-1">
              Digital Studio
            </span>
            <span className="text-xl md:text-2xl font-bold text-tm-white tracking-tighter leading-none group-hover:text-tm-green transition-colors duration-300">
              TEAM MISTAKE
            </span>
          </div>
        </Link>

        {/* Menu Toggle - Top Right */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto relative z-50 group flex items-center gap-2"
        >
          <span className="font-mono text-xs md:text-sm text-tm-slate uppercase tracking-widest group-hover:text-tm-green transition-colors">
            Menu
          </span>
          <div className="relative w-8 h-8 flex items-center justify-center border border-tm-slate/20 rounded-full group-hover:border-tm-green/50 transition-colors bg-tm-navy-light/50 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={16} className="text-tm-green" /> : <Menu size={16} className="text-tm-white" />}
            </motion.div>
          </div>
        </button>

      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-tm-navy text-tm-white flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter hover:text-tm-green transition-colors hover:italic"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Decorative Footer in Menu */}
            <div className="absolute bottom-12 w-full px-12 flex justify-between font-mono text-xs text-tm-slate/50 uppercase tracking-widest">
              <span>©2026 Team Mistake</span>
              <span>Experience Excellence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
