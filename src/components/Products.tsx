import { motion } from 'framer-motion';
import {
    Receipt,
    Palette,
    Gem,
    GraduationCap,
    BookOpen,
    Users
} from 'lucide-react';

const Products = () => {
    const products = [
        {
            title: "Billing Softwares",
            description: "Streamline your invoicing and financial tracking with our robust billing solutions.",
            icon: <Receipt className="w-10 h-10 text-tm-green" />
        },
        {
            title: "Website & Logo Design",
            description: "Crafting unique digital identities with stunning visuals and user-centric designs.",
            icon: <Palette className="w-10 h-10 text-tm-green" />
        },
        {
            title: "Jewellery Sales & Inventory",
            description: "Specialized management tools for jewellery businesses to track sales and stock effortlessly.",
            icon: <Gem className="w-10 h-10 text-tm-green" />
        },
        {
            title: "Student Management",
            description: "Comprehensive systems to manage student data, attendance, and academic records.",
            icon: <GraduationCap className="w-10 h-10 text-tm-green" />
        },
        {
            title: "Learning Management System",
            description: "Empower education with flexible, scalable, and interactive learning platforms.",
            icon: <BookOpen className="w-10 h-10 text-tm-green" />
        },
        {
            title: "Customer Relationship Management",
            description: "Enhance customer engagement and drive sales with our intuitive CRM tools.",
            icon: <Users className="w-10 h-10 text-tm-green" />
        }
    ];

    return (
        <section id="products" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-tm-white">Our Products & Services</h2>
                    <div className="h-[1px] bg-tm-slate/30 flex-grow max-w-xs ml-4"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-tm-navy-light p-8 rounded hover:-translate-y-2 transition-transform duration-300 group"
                        >
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                {product.icon}
                            </div>
                            <h3 className="text-xl font-bold text-tm-white mb-3 group-hover:text-tm-green transition-colors">
                                {product.title}
                            </h3>
                            <p className="text-tm-slate text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
