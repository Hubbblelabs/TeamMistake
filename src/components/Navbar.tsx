import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/team-mistake.png';

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

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Products', href: '#products' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-tm-navy/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 group">
                    <img src={logo} alt="TeamMistake Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
                    <span className="text-xl font-bold text-tm-white tracking-tight">
                        Team<span className="text-tm-green">Mistake</span>
                    </span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="text-tm-slate hover:text-tm-green transition-colors text-sm font-medium"
                        >
                            <span className="text-tm-green mr-1"></span> {link.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="px-4 py-2 border border-tm-green text-tm-green rounded hover:bg-tm-green/10 transition-colors text-sm font-medium"
                    >
                        Get in Touch
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-tm-green focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-40 flex justify-end md:hidden"
                    >
                        <div className="absolute inset-0 bg-tm-navy/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                        <div className="relative w-3/4 max-w-sm bg-tm-navy-light h-full shadow-2xl flex flex-col justify-center items-center gap-8">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-tm-slate hover:text-tm-green text-lg font-medium flex flex-col items-center gap-1"
                                >
                                    <span className="text-tm-green text-sm"></span>
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-8 py-3 border border-tm-green text-tm-green rounded hover:bg-tm-green/10 transition-colors"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
