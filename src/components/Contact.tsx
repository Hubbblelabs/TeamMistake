'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import GlowButton from './ui/GlowButton';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden bg-tm-navy">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tm-navy-light/10 to-tm-navy pointer-events-none" />
      
      {/* Subtle radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-tm-gold/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-tm-navy-light/60 backdrop-blur-xl border border-tm-gold/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-tm-gold animate-pulse" />
            <span className="text-tm-slate-light text-sm tracking-wide font-medium">Let&apos;s Connect</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-semibold text-tm-white mb-6 tracking-tight"
          >
            Get In Touch
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-tm-slate text-lg max-w-xl mx-auto leading-relaxed"
          >
            Have a project in mind? We&apos;d love to hear about it. 
            Send us a message and we&apos;ll respond within 24 hours.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard
            className="max-w-xl mx-auto p-10 md:p-12"
            tiltEnabled={false}
            glowColor="rgba(212, 168, 83, 0.1)"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="relative inline-block"
                  >
                    <CheckCircle className="w-16 h-16 text-tm-gold mx-auto" strokeWidth={1.5} />
                    <div className="absolute inset-0 bg-tm-gold/15 rounded-full blur-2xl" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-tm-white mt-8 mb-3"
                  >
                    Message Sent
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-tm-slate"
                  >
                    Thank you for reaching out. We&apos;ll get back to you shortly.
                  </motion.p>
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
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-medium text-tm-slate-light mb-3"
                    >
                      <User className="w-4 h-4 text-tm-gold/70" />
                      Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className={`w-full bg-tm-navy-light/50 border ${errors.name ? 'border-red-500/50' : 'border-tm-navy-lighter/80'
                        } rounded-xl px-5 py-3.5 text-tm-white placeholder-tm-slate-muted focus:outline-none focus:border-tm-gold/50 focus:bg-tm-navy-light transition-all duration-300`}
                      placeholder="Your name"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-medium text-tm-slate-light mb-3"
                    >
                      <Mail className="w-4 h-4 text-tm-gold/70" />
                      Email
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className={`w-full bg-tm-navy-light/50 border ${errors.email ? 'border-red-500/50' : 'border-tm-navy-lighter/80'
                        } rounded-xl px-5 py-3.5 text-tm-white placeholder-tm-slate-muted focus:outline-none focus:border-tm-gold/50 focus:bg-tm-navy-light transition-all duration-300`}
                      placeholder="your@email.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="flex items-center gap-2 text-sm font-medium text-tm-slate-light mb-3"
                    >
                      <MessageSquare className="w-4 h-4 text-tm-gold/70" />
                      Message
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={5}
                      className={`w-full bg-tm-navy-light/50 border ${errors.message ? 'border-red-500/50' : 'border-tm-navy-lighter/80'
                        } rounded-xl px-5 py-3.5 text-tm-white placeholder-tm-slate-muted focus:outline-none focus:border-tm-gold/50 focus:bg-tm-navy-light transition-all duration-300 resize-none`}
                      placeholder="Tell us about your project..."
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-2 text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle size={12} /> {errors.message.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <GlowButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
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
                          <Send size={18} />
                        </>
                      )}
                    </GlowButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
