import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

type FormData = {
    name: string;
    email: string;
    message: string;
};

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(data);
        setIsSubmitting(false);
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <section id="contact" className="py-24 px-6 bg-tm-navy-light">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-tm-green font-mono mb-4"
                >
                    What's Next?
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-tm-white mb-6"
                >
                    Get In Touch
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-tm-slate text-lg max-w-xl mx-auto"
                >
                    Whether you have a question, a project idea, or just want to say hi, our team is ready to answer all your questions.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="max-w-xl mx-auto bg-tm-navy p-8 rounded-lg shadow-2xl border border-tm-navy-lighter"
            >
                {isSuccess ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-tm-green mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-tm-white mb-2">Message Sent!</h3>
                        <p className="text-tm-slate">Thank you for reaching out. We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-tm-slate-light mb-2">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                type="text"
                                className={`w-full bg-tm-navy-light border ${errors.name ? 'border-red-500' : 'border-tm-navy-lighter'} rounded px-4 py-3 text-tm-white focus:outline-none focus:border-tm-green transition-colors`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-tm-slate-light mb-2">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                className={`w-full bg-tm-navy-light border ${errors.email ? 'border-red-500' : 'border-tm-navy-lighter'} rounded px-4 py-3 text-tm-white focus:outline-none focus:border-tm-green transition-colors`}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-tm-slate-light mb-2">Message</label>
                            <textarea
                                {...register("message", { required: "Message is required" })}
                                rows={4}
                                className={`w-full bg-tm-navy-light border ${errors.message ? 'border-red-500' : 'border-tm-navy-lighter'} rounded px-4 py-3 text-tm-white focus:outline-none focus:border-tm-green transition-colors resize-none`}
                                placeholder="Tell us about your project..."
                            />
                            {errors.message && (
                                <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.message.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-transparent border border-tm-green text-tm-green py-4 rounded font-medium hover:bg-tm-green/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : (
                                <>
                                    Send Message <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </section>
    );
};

export default Contact;
