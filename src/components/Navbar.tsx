'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import GlowButton from './ui/GlowButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Products', href: '/#products' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled
        ? 'py-3'
        : 'py-5'
        }`}
    >
      {/* Glassmorphic background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: scrolled ? 1 : 0,
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(2, 12, 27, 0.8)',
          borderBottom: scrolled ? '1px solid rgba(100, 255, 218, 0.1)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/team-mistake.png"
              alt="TeamMistake Logo"
              width={48}
              height={48}
              className="transition-transform"
            />
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-tm-green/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-tm-white tracking-tight leading-tight">
              Team<span className="text-tm-green">Mistake</span> Technologies
            </span>
            <span className="text-[10px] md:text-xs text-tm-slate font-medium tracking-wide hidden sm:block">
              Experience the Excellence in Our Solution
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              className="relative px-4 py-2 text-tm-slate hover:text-tm-green transition-colors text-sm font-medium group"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {link.name}
              {/* Animated underline */}
              <motion.span
                className="absolute bottom-0 left-1/2 h-0.5 bg-tm-green rounded-full"
                initial={{ width: 0, x: '-50%' }}
                whileHover={{ width: '60%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}

          <div className="ml-4">
            <GlowButton href="/#contact" variant="secondary" size="sm">
              Get in Touch
            </GlowButton>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden relative p-2 text-tm-green focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-tm-navy/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm"
              style={{
                background: 'rgba(10, 25, 47, 0.95)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(100, 255, 218, 0.1)',
              }}
            >
              {/* Decorative particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-tm-green/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col justify-center items-center h-full gap-8 relative z-10">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-tm-slate hover:text-tm-green text-2xl font-medium flex flex-col items-center gap-2 group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {link.name}
                    <motion.span
                      className="h-0.5 bg-tm-green rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4"
                >
                  <GlowButton
                    href="/#contact"
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Sparkles className="w-4 h-4" />
                    Get in Touch
                  </GlowButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
