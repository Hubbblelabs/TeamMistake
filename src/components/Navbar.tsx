'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
      {/* Premium glassmorphic background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(180deg, rgba(15, 20, 25, 0.95) 0%, rgba(15, 20, 25, 0.85) 100%)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212, 168, 83, 0.08)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/TeamMistakeLogo.png"
              alt="TeamMistake Logo"
              width={44}
              height={44}
              className="transition-transform"
            />
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-tm-gold/15 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-semibold text-tm-white tracking-tight leading-tight">
              Team<span className="text-tm-gold">Mistake</span>
            </span>
            <span className="text-[10px] md:text-xs text-tm-slate-muted font-medium tracking-wide hidden sm:block">
              Technology Solutions
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              className="relative px-4 py-2 text-tm-slate hover:text-tm-white transition-colors duration-300 text-sm font-medium group"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              {link.name}
              {/* Elegant underline */}
              <motion.span
                className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-tm-gold to-tm-gold-light rounded-full"
                initial={{ width: 0, x: '-50%' }}
                whileHover={{ width: '50%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.a>
          ))}

          <div className="ml-6">
            <GlowButton href="/#contact" variant="primary" size="sm">
              Get in Touch
            </GlowButton>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden relative p-2 text-tm-slate-light focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
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
                <X size={26} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={26} />
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
              className="absolute inset-0 bg-tm-navy/90 backdrop-blur-xl"
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
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm"
              style={{
                background: 'linear-gradient(180deg, rgba(26, 31, 46, 0.98) 0%, rgba(15, 20, 25, 0.98) 100%)',
                backdropFilter: 'blur(24px)',
                borderLeft: '1px solid rgba(212, 168, 83, 0.1)',
              }}
            >
              <div className="flex flex-col justify-center items-center h-full gap-8 relative z-10 px-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-tm-slate-light hover:text-tm-gold text-xl font-medium transition-colors duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.name}
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6"
                >
                  <GlowButton
                    href="/#contact"
                    variant="primary"
                    size="lg"
                    onClick={() => setIsOpen(false)}
                  >
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
