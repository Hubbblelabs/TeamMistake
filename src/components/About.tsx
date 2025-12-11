import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const About = () => {
    const features = [
        "Process Excellence",
        "Quality Frameworks",
        "Service Delivery Innovation",
        "Client-Centric Approach"
    ];

    return (
        <section id="about" className="py-24 px-6 bg-tm-navy-light">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-tm-white">About Us</h2>
                    <div className="h-[1px] bg-tm-slate/30 flex-grow max-w-xs ml-4"></div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-2 text-tm-slate text-lg leading-relaxed space-y-6"
                    >
                        <p>
                            We are a global services provider delivering technology-driven business solutions that meet the planned objectives of our clients.
                        </p>
                        <p>
                            We deliver unmatched business value through process excellence, quality frameworks, and service delivery innovation. Our team is dedicated to understanding your unique challenges and crafting bespoke solutions that drive growth and efficiency.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm font-mono text-tm-slate-light">
                                    <CheckCircle className="text-tm-green w-4 h-4" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="relative group"
                    >
                        <div className="absolute top-4 left-4 w-full h-full border-2 border-tm-green rounded z-0 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                        <div className="relative z-10 bg-tm-navy-lighter p-8 rounded shadow-xl h-full flex flex-col justify-center items-center text-center">
                            <h3 className="text-5xl font-bold text-tm-white mb-2">5+</h3>
                            <p className="text-tm-green font-mono">Years of Excellence</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
