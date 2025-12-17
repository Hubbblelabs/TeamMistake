'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Heart } from 'lucide-react';
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
    <footer className="relative overflow-hidden bg-tm-navy pt-20 pb-8 border-t border-tm-navy-lighter/30">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <a href="#" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/team-mistake.png"
                  alt="TeamMistake Logo"
                  width={40}
                  height={40}
                  className="transition-transform"
                />
              </motion.div>
              <span className="text-xl font-bold text-tm-white">
                Team<span className="text-tm-green">Mistake</span>
              </span>
            </a>

            <p className="text-tm-slate text-sm leading-relaxed mb-6">
              Delivering technology-driven business solutions that meet your needs.
              We transform challenges into opportunities.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-tm-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-tm-green rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-tm-slate hover:text-tm-green transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-tm-green transition-all duration-300" />
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
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-tm-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-tm-green rounded-full" />
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-tm-slate text-sm flex items-center gap-2 group hover:text-tm-slate-light transition-colors">
                    <span className="w-1 h-1 bg-tm-slate/50 rounded-full" />
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
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-tm-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-tm-green rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3 text-tm-slate text-sm">
                  <span className="p-2 rounded-lg bg-tm-navy-lighter/50 text-tm-green">
                    {info.icon}
                  </span>
                  {info.text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg border border-tm-green/30 text-tm-green text-sm font-medium hover:bg-tm-green/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get In Touch
              <span className="w-2 h-2 bg-tm-green rounded-full animate-pulse" />
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-tm-navy-lighter to-transparent mb-8" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        >
          <p className="text-tm-slate-light font-mono flex items-center gap-2">
            &copy; {currentYear} All Rights Reserved By{' '}
            <span className="text-tm-green">TeamMistake Technologies</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
