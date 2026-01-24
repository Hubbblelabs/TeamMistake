'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Billing Software',
    'Web Development',
    'UI/UX Design',
    'Custom Solutions',
  ];

  const contactInfo = [
    { icon: <Mail className="w-4 h-4" />, text: 'support@teammistake.com' },
    { icon: <MapPin className="w-4 h-4" />, text: 'Coimbatore, Tamil Nadu, India' },
  ];

  return (
    <footer className="relative overflow-hidden bg-tm-navy pt-24 pb-8 border-t border-tm-navy-lighter/20">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-tm-navy-light/20 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <a href="#" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/TeamMistakeLogo.png"
                  alt="TeamMistake Logo"
                  width={40}
                  height={40}
                  className="transition-transform"
                />
              </motion.div>
              <span className="text-lg font-semibold text-tm-white">
                Team<span className="text-tm-gold">Mistake</span>
              </span>
            </a>

            <p className="text-tm-slate text-sm leading-relaxed mb-8">
              Delivering technology-driven business solutions that meet your needs.
              We transform challenges into opportunities.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-tm-navy-lighter/40 text-tm-slate hover:text-tm-gold hover:bg-tm-navy-lighter transition-all duration-300"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-tm-white font-medium mb-6 text-sm tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-tm-slate hover:text-tm-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-tm-white font-medium mb-6 text-sm tracking-wide uppercase">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-tm-slate text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-tm-white font-medium mb-6 text-sm tracking-wide uppercase">
              Contact
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3 text-tm-slate text-sm">
                  <span className="p-2 rounded-lg bg-tm-navy-lighter/40 text-tm-gold/70">
                    {info.icon}
                  </span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-tm-navy-lighter/50 to-transparent mb-8" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        >
          <p className="text-tm-slate-muted">
            &copy; {currentYear} TeamMistake Technologies. All rights reserved.
          </p>
          <p className="text-tm-slate-muted">
            Built with precision and care.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
