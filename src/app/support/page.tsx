'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Ticket, ArrowLeft, Clock, MessageSquare, Copy, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowButton from '@/components/ui/GlowButton';
import GradientText from '@/components/ui/GradientText';

interface Reply {
    message: string;
    sentAt: string;
    sentBy: string;
    isFromUser: boolean;
}

interface SupportTicket {
    _id: string;
    ticketId: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'open' | 'closed';
    createdAt: string;
    replies?: Reply[];
}

export default function SupportPage() {
    const [view, setView] = useState<'menu' | 'new' | 'existing'>('menu');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [lookupData, setLookupData] = useState({ email: '' });
    const [createdTicketId, setCreatedTicketId] = useState('');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'loading' | 'replying'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [copied, setCopied] = useState(false);

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

            const data = await response.json();

            if (response.ok) {
                setCreatedTicketId(data.ticket.ticketId);
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

    const handleLookupTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');
        setTickets([]);

        try {
            const response = await fetch(
                `/api/support/lookup?email=${encodeURIComponent(lookupData.email)}`
            );
            const data = await response.json();

            if (response.ok && data.tickets) {
                setTickets(data.tickets);
                setStatus('idle');
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'No tickets found for this email.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedTicket) return;
        setStatus('replying');

        try {
            const response = await fetch('/api/support/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: selectedTicket.ticketId,
                    email: lookupData.email,
                    message: replyMessage,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSelectedTicket(data.ticket);
                setReplyMessage('');
                setStatus('idle');
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Failed to send reply');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    // Auto-refresh ticket every 10 seconds when viewing
    const refreshTicket = useCallback(async () => {
        if (!selectedTicket || !lookupData.email) return;
        try {
            const response = await fetch(
                `/api/support/lookup?email=${encodeURIComponent(lookupData.email)}`
            );
            const data = await response.json();
            if (response.ok && data.tickets) {
                const updatedTicket = data.tickets.find((t: SupportTicket) => t._id === selectedTicket._id);
                if (updatedTicket) {
                    setSelectedTicket(updatedTicket);
                }
            }
        } catch (error) {
            console.error('Error refreshing ticket:', error);
        }
    }, [selectedTicket, lookupData.email]);

    useEffect(() => {
        if (!selectedTicket) return;

        const interval = setInterval(refreshTicket, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [selectedTicket, refreshTicket]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (ticketStatus: string) => {
        const styles: Record<string, string> = {
            new: 'bg-blue-500/15 text-blue-400',
            open: 'bg-amber-500/15 text-amber-400',
            closed: 'bg-gray-500/15 text-gray-400',
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles[ticketStatus] || styles.new}`}>
                {ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1)}
            </span>
        );
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
                            {view === 'menu' && 'Need help? Create a new ticket or check an existing one.'}
                            {view === 'new' && 'Submit a new support ticket and our team will get back to you.'}
                            {view === 'existing' && 'Enter your email address to view and reply to your tickets.'}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-tm-navy/50 backdrop-blur-lg border border-tm-gold/10 rounded-2xl p-8 shadow-xl"
                    >
                        {/* Main Menu */}
                        {view === 'menu' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setView('new')}
                                    className="bg-tm-navy/50 border border-tm-gold/20 rounded-xl p-6 text-left hover:border-tm-gold/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-tm-gold/10 flex items-center justify-center text-tm-gold mb-4 group-hover:bg-tm-gold/20 transition-all">
                                        <Send size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-tm-white mb-2">Create New Ticket</h3>
                                    <p className="text-sm text-tm-slate">Submit a new support request</p>
                                </button>
                                <button
                                    onClick={() => setView('existing')}
                                    className="bg-tm-navy/50 border border-tm-gold/20 rounded-xl p-6 text-left hover:border-tm-gold/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-all">
                                        <Ticket size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-tm-white mb-2">View Existing Ticket</h3>
                                    <p className="text-sm text-tm-slate">Check status & reply to your ticket</p>
                                </button>
                            </div>
                        )}

                        {/* New Ticket Form */}
                        {view === 'new' && (
                            <>
                                <button
                                    onClick={() => { setView('menu'); setStatus('idle'); setCreatedTicketId(''); }}
                                    className="flex items-center gap-2 text-tm-slate hover:text-tm-white mb-6 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                    Back to menu
                                </button>

                                {status === 'success' && createdTicketId ? (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-tm-white mb-2">Ticket Submitted!</h2>
                                        <p className="text-tm-slate mb-6">
                                            Your ticket has been received! Our team will review it and get back to you shortly.
                                        </p>

                                        <p className="text-sm text-tm-slate mb-8">
                                            You can check the status of your tickets at any time using your email address.
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <GlowButton onClick={() => { setStatus('idle'); setCreatedTicketId(''); }}>
                                                Submit Another Ticket
                                            </GlowButton>
                                            <button
                                                onClick={() => { setView('existing'); setStatus('idle'); }}
                                                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all"
                                            >
                                                View Ticket
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-tm-white">Name</label>
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
                                                <label htmlFor="email" className="text-sm font-medium text-tm-white">Email</label>
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
                                            <label htmlFor="subject" className="text-sm font-medium text-tm-white">Subject</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-gold focus:ring-1 focus:ring-tm-gold transition-all"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-tm-white">Message</label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={6}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-gold focus:ring-1 focus:ring-tm-gold transition-all resize-none"
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
                                            <GlowButton type="submit" className="w-full justify-center" disabled={status === 'submitting'}>
                                                {status === 'submitting' ? 'Submitting...' : <>Submit Ticket <Send size={18} className="ml-2" /></>}
                                            </GlowButton>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* View Existing Ticket */}
                        {view === 'existing' && (
                            <>
                                <button
                                    onClick={() => { setView('menu'); setSelectedTicket(null); setTickets([]); setLookupData({ email: '' }); setStatus('idle'); }}
                                    className="flex items-center gap-2 text-tm-slate hover:text-tm-white mb-6 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                    Back to menu
                                </button>

                                {selectedTicket ? (
                                    <div className="max-h-[60vh] overflow-y-auto">
                                        <button
                                            onClick={() => { setSelectedTicket(null); setReplyMessage(''); }}
                                            className="flex items-center gap-2 text-tm-slate hover:text-tm-white mb-4 transition-colors"
                                        >
                                            <ArrowLeft size={16} />
                                            Back to ticket list
                                        </button>

                                        {/* Ticket Details */}
                                        <div className="bg-tm-navy/50 border border-tm-slate/20 rounded-xl p-6 mb-6">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-tm-white">{selectedTicket.subject}</h3>
                                                    <p className="text-sm text-tm-slate/70">Ticket ID: {selectedTicket.ticketId}</p>
                                                </div>
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                            <div className="bg-tm-navy/50 rounded-lg p-4 mb-4">
                                                <p className="text-tm-slate whitespace-pre-wrap">{selectedTicket.message}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-tm-slate/70">
                                                <Clock size={14} />
                                                Submitted on {formatDate(selectedTicket.createdAt)}
                                            </div>
                                        </div>

                                        {/* Replies Section */}
                                        {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                                            <div className="mb-6 space-y-3">
                                                <h4 className="text-sm font-medium text-tm-white flex items-center gap-2">
                                                    <MessageSquare size={16} />
                                                    Conversation ({selectedTicket.replies.length})
                                                </h4>
                                                {selectedTicket.replies.map((reply, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-xl ${reply.isFromUser
                                                            ? 'bg-tm-gold/10 border border-tm-gold/20 ml-6'
                                                            : 'bg-blue-500/10 border border-blue-500/20 mr-6'
                                                            }`}
                                                    >
                                                        <p className="text-tm-slate whitespace-pre-wrap mb-2">{reply.message}</p>
                                                        <div className="flex items-center gap-2 text-xs text-tm-slate/70">
                                                            <span className={reply.isFromUser ? 'text-tm-gold' : 'text-blue-400'}>
                                                                {reply.isFromUser ? 'You' : 'Support Team'}
                                                            </span>
                                                            • {formatDate(reply.sentAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Form - Only if ticket is not closed */}
                                        {selectedTicket.status !== 'closed' ? (
                                            <div className="bg-tm-navy/30 border border-tm-slate/10 rounded-xl p-4">
                                                <label className="text-sm font-medium text-tm-white mb-2 block">Reply to this ticket</label>
                                                <textarea
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    placeholder="Type your message..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-gold focus:ring-1 focus:ring-tm-gold transition-all resize-none mb-3"
                                                />
                                                {status === 'error' && (
                                                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg mb-3 text-sm">
                                                        <AlertCircle size={16} />
                                                        <p>{errorMessage}</p>
                                                    </div>
                                                )}
                                                <GlowButton
                                                    onClick={handleSendReply}
                                                    disabled={!replyMessage.trim() || status === 'replying'}
                                                    className="w-full justify-center"
                                                >
                                                    {status === 'replying' ? 'Sending...' : <>Send Reply <Send size={16} className="ml-2" /></>}
                                                </GlowButton>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center">
                                                <p className="text-gray-400">This ticket is closed and cannot receive new replies.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : tickets.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-tm-white">Your Tickets</h3>
                                            <button
                                                onClick={() => { setTickets([]); setLookupData({ email: '' }); }}
                                                className="text-sm text-tm-slate hover:text-tm-white"
                                            >
                                                Search different email
                                            </button>
                                        </div>
                                        {tickets.map((ticket) => (
                                            <button
                                                key={ticket._id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="w-full bg-tm-navy/50 border border-tm-slate/20 rounded-xl p-4 text-left hover:border-tm-gold/50 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-tm-white group-hover:text-tm-gold transition-colors">{ticket.subject}</h4>
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                                <p className="text-sm text-tm-slate/70 mb-2 line-clamp-2">{ticket.message}</p>
                                                <div className="flex items-center justify-between text-xs text-tm-slate/50">
                                                    <span>ID: {ticket.ticketId}</span>
                                                    <span>{formatDate(ticket.createdAt)}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <form onSubmit={handleLookupTicket} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="lookupEmail" className="text-sm font-medium text-tm-white">Email Address</label>
                                            <input
                                                type="email"
                                                id="lookupEmail"
                                                required
                                                value={lookupData.email}
                                                onChange={(e) => setLookupData({ ...lookupData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-tm-navy/50 border border-tm-slate/20 rounded-lg text-tm-white focus:outline-none focus:border-tm-gold focus:ring-1 focus:ring-tm-gold transition-all"
                                                placeholder="Email used when creating ticket"
                                            />
                                        </div>

                                        {status === 'error' && (
                                            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg">
                                                <AlertCircle size={20} />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}

                                        <GlowButton type="submit" className="w-full justify-center" disabled={status === 'loading'}>
                                            {status === 'loading' ? 'Finding Tickets...' : 'View My Tickets'}
                                        </GlowButton>
                                    </form>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
