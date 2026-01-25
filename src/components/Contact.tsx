'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send');

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Side - Big Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-tm-green mb-6"
            >
              Let&apos;s Connect
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-tm-white leading-[0.95] mb-8"
            >
              Have a project
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #dfff00' }}>
                in mind?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-tm-slate text-lg max-w-md mb-10"
            >
              We&apos;d love to hear from you. Drop us a line and let&apos;s create something extraordinary together.
            </motion.p>

            {/* Quick Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <a
                href="mailto:hello@teammistake.com"
                className="group flex items-center gap-3 text-tm-white hover:text-tm-green transition-colors"
              >
                <span className="text-lg">hello@teammistake.com</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-tm-navy-light/30 backdrop-blur-sm border border-tm-slate/10 rounded-2xl p-8 md:p-10"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative inline-block"
                  >
                    <CheckCircle className="w-16 h-16 text-tm-green mx-auto" />
                    <div className="absolute inset-0 bg-tm-green/20 rounded-full blur-xl animate-pulse" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-tm-white mt-6 mb-2">Message Sent!</h3>
                  <p className="text-tm-slate">We&apos;ll get back to you shortly.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-tm-slate mb-2">Your Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className={`w-full bg-transparent border-b-2 ${errors.name ? 'border-red-500' : 'border-tm-slate/30'
                        } pb-3 text-tm-white placeholder-tm-slate/40 focus:outline-none focus:border-tm-green transition-colors text-lg`}
                      placeholder="John Doe"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-tm-slate mb-2">Your Email</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email',
                        },
                      })}
                      type="email"
                      className={`w-full bg-transparent border-b-2 ${errors.email ? 'border-red-500' : 'border-tm-slate/30'
                        } pb-3 text-tm-white placeholder-tm-slate/40 focus:outline-none focus:border-tm-green transition-colors text-lg`}
                      placeholder="john@company.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm text-tm-slate mb-2">Your Message</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={4}
                      className={`w-full bg-transparent border-b-2 ${errors.message ? 'border-red-500' : 'border-tm-slate/30'
                        } pb-3 text-tm-white placeholder-tm-slate/40 focus:outline-none focus:border-tm-green transition-colors text-lg resize-none`}
                      placeholder="Tell us about your project..."
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.message.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full mt-4 py-4 px-8 bg-tm-green text-tm-navy font-semibold rounded-full flex items-center justify-center gap-3 hover:bg-tm-green/90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-tm-navy border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
