'use client';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Instagram', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Twitter', href: '#' },
  ];

  return (
    <footer className="bg-tm-navy text-tm-slate px-6 md:px-12 pt-24 pb-8 relative z-10">

      {/* Top Border */}
      <div className="absolute top-0 left-6 right-6 md:left-12 md:right-12 h-[1px] bg-tm-slate/10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">

        {/* Left Column: Contact */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/40 block mb-4">
              Location
            </span>
            <p className="text-xl md:text-2xl text-tm-white leading-relaxed tracking-tight">
              Coimbatore, Tamil Nadu<br />
              India
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/40 block mb-4">
              Inquiries
            </span>
            <a
              href="mailto:support@teammistake.com"
              className="text-xl md:text-2xl text-tm-white hover:text-tm-green transition-colors tracking-tight"
            >
              support@teammistake.com
            </a>
          </div>
        </div>

        {/* Right Column: Social */}
        <div className="lg:col-span-8 lg:flex lg:flex-col lg:items-end">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/40 block mb-6">
            Social
          </span>
          <div className="flex flex-col gap-2 lg:items-end">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-tm-white hover:text-tm-green transition-colors tracking-[-0.04em] uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-tm-slate/10">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/30">
          © {currentYear} Team Mistake. All rights reserved.
        </span>
        <div className="flex gap-6">
          <a href="#" className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/30 hover:text-tm-slate transition-colors">
            Privacy
          </a>
          <a href="#" className="font-mono text-[10px] uppercase tracking-[0.2em] text-tm-slate/30 hover:text-tm-slate transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
