'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Sparkles, Mail, User, MessageSquare } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import GlowButton from './ui/GlowButton';
import { WaveBackground } from '@/lib/three/ShaderMaterials';
import ParticleGrid from '@/lib/three/ParticleGrid';
import { GlowingSphere } from '@/lib/three/LowPolyShapes';

type FormData = {
  name: string;
  email: string;
  message: string;
};

// Three.js Scene Component
function ContactScene() {
  return (
    <>
      <WaveBackground
        colorA="#0a192f"
        colorB="#64ffda"
        amplitude={0.08}
        frequency={4}
      />

      {/* Accent particles */}
      <ParticleGrid
        count={100}
        size={2}
        color="#64ffda"
        opacity={0.4}
        spread={15}
        speed={0.1}
        mouseInteraction={false}
      />

      {/* Glowing accents */}
      <GlowingSphere position={[-6, 3, -3]} scale={0.5} color="#64ffda" />
      <GlowingSphere position={[7, -2, -4]} scale={0.3} color="#64ffda" />
    </>
  );
}

const Contact = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // You might want to add error state handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Three.js Wave Background */}
   

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tm-navy-lighter/40 backdrop-blur-sm border border-tm-green/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-tm-green" />
            <span className="text-tm-green font-mono text-sm">What&apos;s Next?</span>
          </motion.div>

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
            Whether you have a question, a project idea, or just want to say hi,
            our team is ready to answer all your questions.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard
            className="max-w-xl mx-auto p-8 md:p-10"
            tiltEnabled={false}
            glowColor="rgba(100, 255, 218, 0.15)"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="relative inline-block"
                  >
                    <CheckCircle className="w-20 h-20 text-tm-green mx-auto" />
                    <div className="absolute inset-0 bg-tm-green/20 rounded-full blur-xl animate-pulse" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-tm-white mt-6 mb-2"
                  >
                    Message Sent!
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
                      <User className="w-4 h-4 text-tm-green" />
                      Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className={`w-full bg-tm-navy/50 border-2 ${errors.name ? 'border-red-500' : 'border-tm-navy-lighter'
                        } rounded-lg px-4 py-3 text-tm-white placeholder-tm-slate/50 focus:outline-none focus:border-tm-green focus:bg-tm-navy transition-all duration-300`}
                      placeholder="John Doe"
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
                      <Mail className="w-4 h-4 text-tm-green" />
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
                      className={`w-full bg-tm-navy/50 border-2 ${errors.email ? 'border-red-500' : 'border-tm-navy-lighter'
                        } rounded-lg px-4 py-3 text-tm-white placeholder-tm-slate/50 focus:outline-none focus:border-tm-green focus:bg-tm-navy transition-all duration-300`}
                      placeholder="john@example.com"
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
                      <MessageSquare className="w-4 h-4 text-tm-green" />
                      Message
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={4}
                      className={`w-full bg-tm-navy/50 border-2 ${errors.message ? 'border-red-500' : 'border-tm-navy-lighter'
                        } rounded-lg px-4 py-3 text-tm-white placeholder-tm-slate/50 focus:outline-none focus:border-tm-green focus:bg-tm-navy transition-all duration-300 resize-none`}
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
                  <GlowButton
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-tm-green border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </GlowButton>
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
