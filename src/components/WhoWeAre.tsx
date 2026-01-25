'use client';

import { motion } from 'framer-motion';

const capabilities = [
    'Digital Strategy',
    'Brand Identity',
    'Web Development',
    'Mobile Applications',
    'E-Commerce',
    'Content Creation',
];

export default function WhoWeAre() {
    return (
        <section id="about" className="relative z-20 py-24 md:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-tm-green bg-tm-green/10 border border-tm-green/30 rounded-full">
                        Who We Are
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-tm-white leading-tight mb-16 max-w-4xl"
                >
                    We are a digital production studio crafting{' '}
                    <span className="text-tm-green">immersive experiences</span> for the modern web.
                </motion.h2>

                {/* Two-column text */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-20">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-tm-slate text-base md:text-lg leading-relaxed"
                    >
                        At Team Mistake, we don't just build websites; we create digital ecosystems.
                        Our approach combines technical precision with artistic direction to deliver
                        platforms that look stunning and perform flawlessly.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-tm-slate text-base md:text-lg leading-relaxed"
                    >
                        We believe in the power of "mistakes" — the happy accidents and iterative
                        processes that lead to true innovation. We push boundaries to deliver what
                        you need, not just what's expected.
                    </motion.p>
                </div>

                {/* Capabilities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="block text-xs font-mono uppercase tracking-[0.2em] text-tm-slate/60 mb-6">
                        Capabilities
                    </span>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                        {capabilities.map((cap, i) => (
                            <motion.span
                                key={cap}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                className="text-lg md:text-xl font-semibold text-tm-white hover:text-tm-green transition-colors cursor-default"
                            >
                                {cap}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
