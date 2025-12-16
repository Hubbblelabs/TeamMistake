'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Send,
  LogOut,
  Search,
  Menu,
  X,
  LifeBuoy,
  Clock,
  Shield,
  Users,
  Plus,
  Edit2,
  Trash2,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

// Types
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

interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'open' | 'closed';
  createdAt: string;
  replies: Reply[];
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<'contacts' | 'support' | 'admins'>('contacts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactFilter, setContactFilter] = useState<string>('all');

  // Support State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState<string>('all');

  // Admin State
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Shared State
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth Check
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  // Data Fetching
  useEffect(() => {
    if (status === 'authenticated') {
      fetchContacts();
      fetchTickets();
      fetchAdmins();
    }
  }, [status]);

  // Filtering
  useEffect(() => {
    let filtered = contacts;
    if (contactFilter !== 'all') {
      filtered = filtered.filter(c => c.status === contactFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredContacts(filtered);
  }, [contactFilter, contacts, searchQuery]);

  useEffect(() => {
    let filtered = tickets;
    if (ticketFilter !== 'all') {
      filtered = filtered.filter(t => t.status === ticketFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  }, [ticketFilter, tickets, searchQuery]);

  // Fetch Functions
  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  // Handlers
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
        setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, status: 'read' } : c));
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleTicketClick = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setIsSending(true);

    try {
      if (activeTab === 'contacts' && selectedContact) {
        const res = await fetch(`/api/admin/contacts/${selectedContact._id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: replyMessage }),
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(prev => prev.map(c => c._id === selectedContact._id ? data.contact : c));
          setSelectedContact(data.contact);
          alert('Reply sent!');
        }
      } else if (activeTab === 'support' && selectedTicket) {
        alert('Support reply feature coming soon!');
      }
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  // Admin Management Handlers
  const handleCreateAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      setAdminError('All fields are required');
      return;
    }
    setIsAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(prev => [data.admin, ...prev]);
        setShowAdminModal(false);
        setAdminForm({ name: '', email: '', password: '' });
      } else {
        setAdminError(data.error || 'Failed to create admin');
      }
    } catch (error) {
      setAdminError('Failed to create admin');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin || !adminForm.name || !adminForm.email) {
      setAdminError('Name and email are required');
      return;
    }
    setIsAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminForm.name, email: adminForm.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(prev => prev.map(a => a._id === selectedAdmin._id ? data.admin : a));
        setShowAdminModal(false);
        setSelectedAdmin(null);
        setAdminForm({ name: '', email: '', password: '' });
      } else {
        setAdminError(data.error || 'Failed to update admin');
      }
    } catch (error) {
      setAdminError('Failed to update admin');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    setIsAdminLoading(true);

    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(prev => prev.filter(a => a._id !== selectedAdmin._id));
        setShowDeleteConfirm(false);
        setSelectedAdmin(null);
      } else {
        alert(data.error || 'Failed to delete admin');
      }
    } catch (error) {
      alert('Failed to delete admin');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!selectedAdmin) return;
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setAdminError('All fields are required');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAdminError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setAdminError('Password must be at least 6 characters');
      return;
    }
    setIsAdminLoading(true);
    setAdminError('');

    try {
      const res = await fetch(`/api/admin/admins/${selectedAdmin._id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowPasswordModal(false);
        setSelectedAdmin(null);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password updated successfully');
      } else {
        setAdminError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setAdminError('Failed to update password');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setAdminForm({ name: admin.name, email: admin.email, password: '' });
    setAdminError('');
    setShowAdminModal(true);
  };

  const openCreateModal = () => {
    setSelectedAdmin(null);
    setAdminForm({ name: '', email: '', password: '' });
    setAdminError('');
    setShowAdminModal(true);
  };

  const openPasswordModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setAdminError('');
    setShowPasswordModal(true);
  };

  const openDeleteConfirm = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowDeleteConfirm(true);
  };

  // UI Helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-500/15 text-blue-400',
      read: 'bg-amber-500/15 text-amber-400',
      replied: 'bg-emerald-500/15 text-emerald-400',
      open: 'bg-violet-500/15 text-violet-400',
      closed: 'bg-gray-500/15 text-gray-400',
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles[status] || styles.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStats = () => {
    if (activeTab === 'contacts') {
      return {
        total: contacts.length,
        new: contacts.filter(c => c.status === 'new').length,
        replied: contacts.filter(c => c.status === 'replied').length,
      };
    }
    if (activeTab === 'support') {
      return {
        total: tickets.length,
        new: tickets.filter(t => t.status === 'new').length,
        closed: tickets.filter(t => t.status === 'closed').length,
      };
    }
    return {
      total: admins.length,
      new: 0,
      replied: 0,
    };
  };

  const stats = getStats();

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-tm-green border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d14] border-r border-gray-800/50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tm-green/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-tm-green" />
            </div>
            <div>
              <span className="text-lg font-semibold text-white tracking-tight">TeamMistake</span>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Management</p>
          <button
            onClick={() => { setActiveTab('contacts'); setSelectedContact(null); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-[#12121a] text-white' : 'text-gray-400 hover:bg-[#12121a]/50 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span className="font-medium">Contacts</span>
            </div>
            {contacts.filter(c => c.status === 'new').length > 0 && (
              <span className="bg-tm-green/20 text-tm-green text-xs font-medium px-2 py-0.5 rounded-full">
                {contacts.filter(c => c.status === 'new').length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('support'); setSelectedTicket(null); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'support' ? 'bg-[#12121a] text-white' : 'text-gray-400 hover:bg-[#12121a]/50 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-3">
              <LifeBuoy size={18} />
              <span className="font-medium">Support</span>
            </div>
            {tickets.filter(t => t.status === 'new').length > 0 && (
              <span className="bg-tm-green/20 text-tm-green text-xs font-medium px-2 py-0.5 rounded-full">
                {tickets.filter(t => t.status === 'new').length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('admins'); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'admins' ? 'bg-[#12121a] text-white' : 'text-gray-400 hover:bg-[#12121a]/50 hover:text-gray-300'}`}
          >
            <div className="flex items-center gap-3">
              <Users size={18} />
              <span className="font-medium">Admins</span>
            </div>
            <span className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {admins.length}
            </span>
          </button>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#12121a] mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tm-green/30 to-tm-green/10 flex items-center justify-center text-tm-green font-semibold">
              {session.user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#0d0d14] border-b border-gray-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {activeTab === 'contacts' ? 'Contact Inquiries' : activeTab === 'support' ? 'Support Tickets' : 'Admin Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'admins' ? 'Create, update, and manage admin accounts' : 'Manage and respond to messages'}
                </p>
              </div>
            </div>

            {/* Stats Pills */}
            {activeTab !== 'admins' && (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#12121a] rounded-lg">
                  <span className="text-gray-500 text-sm">Total:</span>
                  <span className="text-white font-semibold">{stats.total}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg">
                  <span className="text-blue-400 text-sm">New:</span>
                  <span className="text-blue-400 font-semibold">{stats.new}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
                  <span className="text-emerald-400 text-sm">{activeTab === 'contacts' ? 'Replied:' : 'Closed:'}</span>
                  <span className="text-emerald-400 font-semibold">{activeTab === 'contacts' ? stats.replied : stats.closed}</span>
                </div>
              </div>
            )}
            {activeTab === 'admins' && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-tm-green text-tm-navy font-medium rounded-xl hover:bg-tm-green/90 transition-all"
              >
                <Plus size={18} />
                Add Admin
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'admins' ? (
            /* Admin Management View */
            <div className="h-full bg-[#0d0d14] rounded-2xl border border-gray-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#12121a] border-b border-gray-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Created</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-[#12121a]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tm-green/30 to-tm-green/10 flex items-center justify-center text-tm-green font-semibold">
                              {admin.name[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-white">{admin.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{admin.email}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(admin.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(admin)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => openPasswordModal(admin)}
                              className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                              title="Change Password"
                            >
                              <Key size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(admin)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {admins.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <Users size={40} className="mb-3 opacity-30" />
                    <p className="font-medium text-gray-400">No admins found</p>
                    <p className="text-sm mt-1">Create your first admin to get started</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Contacts/Support View */
            <div className="h-full flex gap-6">
              {/* List Panel */}
              <div className="w-full lg:w-96 flex flex-col bg-[#0d0d14] rounded-2xl border border-gray-800/50 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-gray-800/50 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-[#12121a] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['all', 'new', activeTab === 'contacts' ? 'replied' : 'closed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => activeTab === 'contacts' ? setContactFilter(filter) : setTicketFilter(filter)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${(activeTab === 'contacts' ? contactFilter : ticketFilter) === filter
                          ? 'bg-tm-green text-tm-navy'
                          : 'bg-[#12121a] text-gray-400 hover:text-white'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {(activeTab === 'contacts' ? filteredContacts : filteredTickets).map((item: any) => (
                    <button
                      key={item._id}
                      onClick={() => activeTab === 'contacts' ? handleContactClick(item) : handleTicketClick(item)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${(activeTab === 'contacts' ? selectedContact : selectedTicket)?._id === item._id
                        ? 'bg-tm-green/10 border border-tm-green/30'
                        : 'bg-[#12121a] border border-transparent hover:border-gray-700'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-300">
                            {item.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-white truncate">{item.name}</span>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-gray-400 truncate mb-2">{item.subject || item.message?.slice(0, 50)}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {formatDate(item.createdAt)}
                      </div>
                    </button>
                  ))}
                  {(activeTab === 'contacts' ? filteredContacts : filteredTickets).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Mail size={32} className="mb-3 opacity-30" />
                      <p className="text-sm">No items found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Panel */}
              <div className="hidden lg:flex flex-1 flex-col bg-[#0d0d14] rounded-2xl border border-gray-800/50 overflow-hidden">
                {(activeTab === 'contacts' ? selectedContact : selectedTicket) ? (
                  <>
                    {/* Detail Header */}
                    <div className="p-6 border-b border-gray-800/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-tm-green/20 to-tm-green/5 flex items-center justify-center text-xl font-semibold text-tm-green">
                            {(activeTab === 'contacts' ? selectedContact : selectedTicket)?.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-white mb-1">
                              {(activeTab === 'contacts' ? selectedContact : selectedTicket)?.name}
                            </h2>
                            <p className="text-tm-green text-sm">
                              {(activeTab === 'contacts' ? selectedContact : selectedTicket)?.email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge((activeTab === 'contacts' ? selectedContact : selectedTicket)?.status || 'new')}
                      </div>

                      {/* Message Content */}
                      <div className="bg-[#12121a] rounded-xl p-5 border border-gray-800/50">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {(activeTab === 'contacts' ? selectedContact : selectedTicket)?.message}
                        </p>
                      </div>
                    </div>

                    {/* Conversation Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Clock size={14} />
                        Received on {formatDate((activeTab === 'contacts' ? selectedContact : selectedTicket)?.createdAt || '')}
                      </div>
                    </div>

                    {/* Reply Input */}
                    <div className="p-4 border-t border-gray-800/50 bg-[#0a0a0f]">
                      <div className="relative">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          className="w-full bg-[#12121a] border border-gray-800 rounded-xl p-4 pr-14 min-h-[100px] text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50 resize-none transition-colors"
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim() || isSending}
                          className="absolute bottom-4 right-4 p-3 bg-tm-green text-tm-navy rounded-xl hover:bg-tm-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-tm-green/20"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="w-20 h-20 rounded-2xl bg-[#12121a] flex items-center justify-center mb-4">
                      <Mail size={32} className="opacity-30" />
                    </div>
                    <p className="font-medium text-gray-400">No message selected</p>
                    <p className="text-sm mt-1">Select an item from the list to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d14] rounded-2xl border border-gray-800/50 w-full max-w-md">
            <div className="p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-semibold text-white">
                {selectedAdmin ? 'Edit Admin' : 'Create Admin'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {adminError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-sm">{adminError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                  placeholder="Admin name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                  placeholder="admin@example.com"
                />
              </div>
              {!selectedAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-800/50 flex gap-3">
              <button
                onClick={() => setShowAdminModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={selectedAdmin ? handleUpdateAdmin : handleCreateAdmin}
                disabled={isAdminLoading}
                className="flex-1 px-4 py-3 bg-tm-green text-tm-navy font-medium rounded-xl hover:bg-tm-green/90 disabled:opacity-50 transition-all"
              >
                {isAdminLoading ? 'Saving...' : selectedAdmin ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d14] rounded-2xl border border-gray-800/50 w-full max-w-md">
            <div className="p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <p className="text-sm text-gray-500 mt-1">Update password for {selectedAdmin.name}</p>
            </div>
            <div className="p-6 space-y-4">
              {adminError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-sm">{adminError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-[#12121a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tm-green/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800/50 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                disabled={isAdminLoading}
                className="flex-1 px-4 py-3 bg-tm-green text-tm-navy font-medium rounded-xl hover:bg-tm-green/90 disabled:opacity-50 transition-all"
              >
                {isAdminLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d14] rounded-2xl border border-gray-800/50 w-full max-w-md">
            <div className="p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-semibold text-white">Delete Admin</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedAdmin.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-800/50 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                disabled={isAdminLoading}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all"
              >
                {isAdminLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
