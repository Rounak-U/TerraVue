import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiLogOut, FiMail, FiMessageSquare, FiRefreshCw, FiShield } from 'react-icons/fi';
import adminApi, { ADMIN_TOKEN_KEY, getAdminProfile, persistAdminProfile } from '../api/admin';
import { useNotify } from '../context/NotifyContext';

const statusPalette = {
    Open: 'border-amber-200 bg-amber-100 text-amber-800',
    'In Progress': 'border-sky-200 bg-sky-100 text-sky-800',
    Resolved: 'border-emerald-200 bg-emerald-100 text-emerald-800'
};

const statusFilters = ['All', 'Open', 'In Progress', 'Resolved'];

const AdminSupportDesk = () => {
    const [overview, setOverview] = useState({ total: 0, open: 0, awaitingReply: 0, highPriority: 0 });
    const [tickets, setTickets] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [ticketLoading, setTicketLoading] = useState(true);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [replyBody, setReplyBody] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('In Progress');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const notify = useNotify();
    const navigate = useNavigate();
    const profile = getAdminProfile();

    const handleSessionExpiry = useCallback(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        persistAdminProfile(null);
        notify.error('Session expired. Please log back in.');
        navigate('/admin/login');
    }, [navigate, notify]);

    const fetchOverview = useCallback(async () => {
        setOverviewLoading(true);
        try {
            const { data } = await adminApi.get('/api/support/admin/overview');
            setOverview(data?.stats || { total: 0, open: 0, awaitingReply: 0, highPriority: 0 });
        } catch (err) {
            if (err?.response?.status === 401) {
                handleSessionExpiry();
                return;
            }
            notify.error('Unable to load overview.');
        } finally {
            setOverviewLoading(false);
        }
    }, [handleSessionExpiry, notify]);

    const fetchTickets = useCallback(async () => {
        setTicketLoading(true);
        try {
            const query = filterStatus !== 'All' ? `?status=${encodeURIComponent(filterStatus)}` : '';
            const { data } = await adminApi.get(`/api/support/admin/tickets${query}`);
            setTickets(data?.tickets || []);
        } catch (err) {
            if (err?.response?.status === 401) {
                handleSessionExpiry();
                return;
            }
            notify.error('Unable to load tickets.');
        } finally {
            setTicketLoading(false);
        }
    }, [filterStatus, handleSessionExpiry, notify]);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        if (!tickets.length) {
            setSelectedTicketId(null);
            return;
        }
        if (!selectedTicketId) {
            setSelectedTicketId(tickets[0]._id);
            return;
        }
        const exists = tickets.some((ticket) => ticket._id === selectedTicketId);
        if (!exists) {
            setSelectedTicketId(tickets[0]._id);
        }
    }, [tickets, selectedTicketId]);

    const selectedTicket = useMemo(() => {
        if (!selectedTicketId) return null;
        return tickets.find((ticket) => ticket._id === selectedTicketId) || null;
    }, [tickets, selectedTicketId]);

    const latestMessage = useCallback((ticket) => {
        if (!ticket) return '';
        const history = ticket.messages || [];
        if (history.length) {
            return history[history.length - 1]?.body || ticket.message || '';
        }
        return ticket.message || '';
    }, []);

    useEffect(() => {
        if (!selectedTicket) {
            setReplyBody('');
            return;
        }
        setStatusUpdate(selectedTicket.status || 'In Progress');
        setResolutionNotes(selectedTicket.resolutionNotes || '');
        setReplyBody('');
        // dependency strictly on id to avoid wiping input on same-ticket refreshes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTicketId]);

    const timeline = useMemo(() => {
        if (!selectedTicket) return [];
        if (selectedTicket.messages?.length) {
            return selectedTicket.messages;
        }
        if (selectedTicket.message) {
            return [{ sender: 'user', body: selectedTicket.message, createdAt: selectedTicket.createdAt }];
        }
        return [];
    }, [selectedTicket]);

    const handleLogout = () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        persistAdminProfile(null);
        notify.info('Signed out of admin console.');
        navigate('/admin/login');
    };

    const handleReplySubmit = async (event) => {
        event.preventDefault();
        if (!selectedTicket) {
            notify.error('Select a ticket first.');
            return;
        }
        if (!replyBody.trim()) {
            notify.error('Add a reply message.');
            return;
        }

        setSendingReply(true);
        try {
            const { data } = await adminApi.post(`/api/support/admin/tickets/${selectedTicket._id}/reply`, {
                message: replyBody.trim(),
                status: statusUpdate,
                resolutionNotes,
            });
            const updatedTicket = data?.ticket;
            if (updatedTicket) {
                setTickets((prev) => prev.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket)));
            }
            setReplyBody('');
            notify.success('Reply sent');
            fetchOverview();
        } catch (err) {
            if (err?.response?.status === 401) {
                handleSessionExpiry();
                return;
            }
            notify.error(err?.response?.data?.message || 'Unable to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const formatDate = (value) => {
        if (!value) return '—';
        try {
            return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        } catch (err) {
            return value;
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f6fb] text-slate-900">
            <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-slate-200 px-10 py-5 flex items-center justify-between">
                <div>
                    <p className="text-[0.55rem] uppercase tracking-[0.45em] text-slate-400">Concierge admin</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Support Intelligence Desk</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-400">Signed in</p>
                        <p className="text-sm font-medium text-slate-900">{profile?.email || 'admin@terravue.io'}</p>
                    </div>
                    <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm">
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </header>

            <main className="px-10 pb-14 pt-8 space-y-10">
                <section className="grid gap-6 md:grid-cols-4">
                    {[{
                        label: 'Total tickets',
                        key: 'total',
                        accent: 'border-slate-200 bg-white shadow-sm',
                        icon: <FiMessageSquare />
                    }, {
                        label: 'Open queue',
                        key: 'open',
                        accent: 'border-amber-100 bg-amber-50',
                        icon: <FiAlertTriangle />
                    }, {
                        label: 'Awaiting reply',
                        key: 'awaitingReply',
                        accent: 'border-sky-100 bg-sky-50',
                        icon: <FiMail />
                    }, {
                        label: 'High priority',
                        key: 'highPriority',
                        accent: 'border-rose-100 bg-rose-50',
                        icon: <FiShield />
                    }].map((card) => (
                        <div key={card.label} className={`rounded-[1.75rem] border ${card.accent} p-6`}>
                            <div className="flex items-center justify-between text-slate-500">
                                <p className="text-[0.5rem] uppercase tracking-[0.35em]">{card.label}</p>
                                {card.icon}
                            </div>
                            <p className="mt-4 text-4xl font-semibold text-slate-900">{overviewLoading ? '—' : overview[card.key] ?? 0}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr,1.15fr]">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[0.55rem] uppercase tracking-[0.45em] text-slate-400">Inbox</p>
                                <h2 className="text-2xl font-semibold text-slate-900">Support tickets</h2>
                            </div>
                            <button onClick={fetchTickets} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm">
                                <FiRefreshCw /> Refresh
                            </button>
                        </div>
                        <div className="flex gap-3 mb-5">
                            {statusFilters.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] ${filterStatus === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                            {ticketLoading ? (
                                [1, 2, 3, 4].map((item) => (
                                    <div key={item} className="h-24 rounded-[1.5rem] border border-slate-100 bg-slate-50 animate-pulse" />
                                ))
                            ) : tickets.length === 0 ? (
                                <p className="text-slate-500">No tickets in this filter right now.</p>
                            ) : (
                                tickets.map((ticket) => (
                                    <button
                                        key={ticket._id}
                                        onClick={() => setSelectedTicketId(ticket._id)}
                                        className={`w-full text-left rounded-[1.5rem] border px-5 py-4 transition ${selectedTicketId === ticket._id ? 'border-slate-300 bg-slate-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-[0.45rem] uppercase tracking-[0.4em] text-slate-400">{ticket.category}</p>
                                                <p className="text-lg font-semibold text-slate-900">{ticket.subject}</p>
                                            </div>
                                            <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold ${statusPalette[ticket.status] || 'border-slate-200 text-slate-600'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{latestMessage(ticket)}</p>
                                        <p className="mt-2 text-xs text-slate-400">{ticket.user?.name || 'Traveler'} • {ticket.user?.email || 'No email'}</p>
                                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                                            <span>{ticket.priority} priority</span>
                                            <span>{formatDate(ticket.updatedAt)}</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
                        {selectedTicket ? (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[0.45rem] uppercase tracking-[0.4em] text-slate-400">Conversation</p>
                                        <h2 className="text-3xl font-semibold text-slate-900">{selectedTicket.subject}</h2>
                                        <p className="text-slate-500 text-sm mt-1">{selectedTicket.user?.name || 'Traveler'} • {selectedTicket.user?.email || 'No email on file'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[0.45rem] uppercase tracking-[0.4em] text-slate-400">Priority</p>
                                        <p className="text-lg font-semibold text-slate-900">{selectedTicket.priority}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-3">
                                    {timeline.length === 0 ? (
                                        <p className="text-slate-500">No messages yet.</p>
                                    ) : (
                                        timeline.map((entry, index) => {
                                            const isAdmin = entry.sender === 'admin';
                                            const name = isAdmin
                                                ? entry.admin?.name || 'Concierge'
                                                : entry.user?.name || selectedTicket.user?.name || 'Traveler';
                                            const email = isAdmin
                                                ? entry.admin?.email || 'ops@terravue.io'
                                                : entry.user?.email || selectedTicket.user?.email || 'traveler@guest';
                                            return (
                                                <div
                                                    key={`${entry.createdAt}-${index}`}
                                                    className={`rounded-2xl border px-4 py-3 ${isAdmin ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}
                                                >
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span>{name}</span>
                                                        <span>{formatDate(entry.createdAt)}</span>
                                                    </div>
                                                    <p className="text-[0.55rem] uppercase tracking-[0.35em] text-slate-400">{email}</p>
                                                    <p className="mt-2 text-sm text-slate-900 whitespace-pre-wrap">{entry.body}</p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <form onSubmit={handleReplySubmit} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-[0.5rem] uppercase tracking-[0.35em] text-slate-400">Status</label>
                                            <select
                                                value={statusUpdate}
                                                onChange={(e) => setStatusUpdate(e.target.value)}
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-400"
                                            >
                                                {['Open', 'In Progress', 'Resolved'].map((status) => (
                                                    <option key={status} value={status} className="text-slate-900">{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[0.5rem] uppercase tracking-[0.35em] text-slate-400">Resolution notes</label>
                                            <input
                                                type="text"
                                                value={resolutionNotes}
                                                onChange={(e) => setResolutionNotes(e.target.value)}
                                                placeholder="Visible to traveler"
                                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[0.5rem] uppercase tracking-[0.35em] text-slate-400">Reply</label>
                                        <textarea
                                            value={replyBody}
                                            onChange={(e) => setReplyBody(e.target.value)}
                                            rows={4}
                                            placeholder="Compose a helpful update..."
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sendingReply}
                                        className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg disabled:opacity-60"
                                    >
                                        {sendingReply ? 'Sending…' : 'Send reply'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                Select a ticket to review the conversation.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminSupportDesk;
