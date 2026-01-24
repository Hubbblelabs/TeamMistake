'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Instagram', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Twitter', href: '#' },
  ];

  return (
    <footer className="bg-tm-navy text-tm-slate px-6 pb-12 pt-0 md:px-12 relative z-10 mix-blend-exclusion">
      <div className="border-t border-tm-slate/20 pt-12 flex flex-col md:flex-row justify-between items-start gap-12">

        {/* Left Column: Contact / Info */}
        <div className="flex flex-col gap-8 max-w-sm">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-tm-slate/50 block mb-4">Location</span>
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              Coimbatore, Tamil Nadu<br />
              India
            </p>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-tm-slate/50 block mb-4">Inquiries</span>
            <a href="mailto:support@teammistake.com" className="text-xl md:text-2xl font-medium hover:text-tm-green transition-colors">
              support@teammistake.com
            </a>
          </div>
        </div>

        {/* Right Column: Social Links */}
        <div className="flex flex-col gap-4 items-start md:items-end">
          <span className="font-mono text-xs uppercase tracking-widest text-tm-slate/50 block mb-2 md:mb-4">Social</span>
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-4xl md:text-5xl font-bold hover:text-tm-green transition-colors tracking-tighter"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-24 flex flex-col md:flex-row justify-between items-end gap-6 font-mono text-xs uppercase tracking-widest text-tm-slate/40">
        <span>© {currentYear} Team Mistake</span>
        <span>Privacy / Terms</span>
      </div>
    </footer>
  );
};

export default Footer;
