'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Send, Check, Eye, LogOut, Filter } from 'lucide-react';
import GradientText from '@/components/ui/GradientText';
import GlowButton from '@/components/ui/GlowButton';

interface Reply {
  message: string;
  sentAt: string;
  sentBy: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  replies: Reply[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchContacts();
    }
  }, [status]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(c => c.status === filterStatus));
    }
  }, [filterStatus, contacts]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = async (contact: Contact) => {
    setSelectedContact(contact);
    setReplyMessage('');

    if (contact.status === 'new') {
      try {
        await fetch(`/api/admin/contacts/${contact._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' }),
        });
        
        setContacts(prev =>
          prev.map(c =>
            c._id === contact._id ? { ...c, status: 'read' as const } : c
          )
        );
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `/api/admin/contacts/${selectedContact._id}/reply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: replyMessage }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setContacts(prev =>
          prev.map(c =>
            c._id === selectedContact._id ? data.contact : c
          )
        );
        setSelectedContact(data.contact);
        setReplyMessage('');
        alert('Reply sent successfully!');
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      replied: 'bg-green-500/20 text-green-400 border-green-500/50',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status}
      </span>
    );
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                <GradientText>Admin Dashboard</GradientText>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome, {session.user?.name || session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Mail size={20} />
                  Contacts ({filteredContacts.length})
                </h2>
                <Filter size={16} className="text-gray-400" />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {['all', 'new', 'read', 'replied'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      filterStatus === status
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No contacts found
                  </p>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      onClick={() => handleContactClick(contact)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedContact?._id === contact._id
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold truncate">{contact.name}</h3>
                        {getStatusBadge(contact.status)}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{contact.email}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contact Detail & Reply */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                      <p className="text-gray-400">{selectedContact.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(selectedContact.status)}
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                      Original Message
                    </h3>
                    <p className="text-white whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Replies History */}
                {selectedContact.replies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Check size={18} />
                      Conversation History ({selectedContact.replies.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedContact.replies.map((reply, index) => {
                        const isFromUser = (reply as any).isFromUser === true;
                        return (
                          <div
                            key={index}
                            className={`rounded-lg p-4 border ${
                              isFromUser
                                ? 'bg-blue-500/10 border-blue-500/30 ml-0 mr-4'
                                : 'bg-green-500/10 border-green-500/30 ml-4 mr-0'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${
                                  isFromUser ? 'text-blue-400' : 'text-green-400'
                                }`}>
                                  {reply.sentBy}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  isFromUser
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-green-500/20 text-green-300'
                                }`}>
                                  {isFromUser ? 'User' : 'Admin'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDate(reply.sentAt)}
                              </span>
                            </div>
                            <p className="text-white whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Send size={18} />
                    Send Reply
                  </h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[150px]"
                    placeholder="Type your reply here..."
                  />
                  <div className="mt-4">
                    <GlowButton
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || isSending}
                    >
                      {isSending ? 'Sending...' : 'Send Reply'}
                    </GlowButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Eye size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a contact to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
