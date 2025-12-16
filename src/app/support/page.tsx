'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowButton from '@/components/ui/GlowButton';
import GradientText from '@/components/ui/GradientText';

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
                setErrorMessage('Failed to submit ticket. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="bg-tm-navy min-h-screen text-tm-slate font-body selection:bg-tm-green selection:text-tm-navy flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-tm-white">
                            <GradientText>Support Center</GradientText>
                        </h1>
                        <p className="text-lg text-tm-slate max-w-2xl mx-auto">
                            Need help? Submit a ticket and our support team will get back to you as soon as possible.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-tm-light-navy/50 backdrop-blur-lg border border-tm-green/10 rounded-2xl p-8 shadow-xl"
                    >
                        {status === 'success' ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-tm-white mb-2">Ticket Submitted!</h2>
                                <p className="text-tm-slate mb-8">
                                    We've received your request and will respond to your email shortly.
                                </p>
                                <GlowButton onClick={() => setStatus('idle')}>
                                    Submit Another Ticket
                                </GlowButton>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-tm-white">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-green focus:ring-1 focus:ring-tm-green transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-tm-white">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-green focus:ring-1 focus:ring-tm-green transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-tm-white">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-green focus:ring-1 focus:ring-tm-green transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-tm-white">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-green focus:ring-1 focus:ring-tm-green transition-all resize-none"
                                        placeholder="Describe your issue in detail..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg">
                                        <AlertCircle size={20} />
                                        <p>{errorMessage}</p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <GlowButton
                                        type="submit"
                                        className="w-full justify-center"
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                Submit Ticket <Send size={18} className="ml-2" />
                                            </>
                                        )}
                                    </GlowButton>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
