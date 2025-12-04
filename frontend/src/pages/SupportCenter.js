import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../api/axios';
import {
    FaHeadset,
    FaPaperPlane,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInbox,
    FaShieldAlt,
} from 'react-icons/fa';

const categories = ['Billing', 'Itinerary', 'Account', 'Technical', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

const statusAccent = {
    Open: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    'In Progress': 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    Resolved: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
};

const SupportCenter = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Billing');
    const [priority, setPriority] = useState('Medium');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/support');
            setTickets(data.tickets || []);
        } catch (err) {
            toast.error('Unable to fetch support history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error('Subject and message are required');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/support', { subject, category, priority, message });
            toast.success('Request submitted');
            setSubject('');
            setMessage('');
            setCategory('Billing');
            setPriority('Medium');
            fetchTickets();
        } catch (err) {
            toast.error('Unable to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const summary = useMemo(() => {
        const open = tickets.filter((ticket) => ticket.status === 'Open').length;
        const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length;
        const medianResponse = '45 min';
        return { total: tickets.length, open, resolved, medianResponse };
    }, [tickets]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl px-8 py-10 shadow-[0_50px_150px_-70px_rgba(15,23,42,1)]"
                >
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
                    <div className="relative grid gap-6 lg:grid-cols-[2fr,1fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.6em] text-white/70">Concierge Desk</p>
                            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Always-on support for every itinerary.</h1>
                            <p className="text-white/70 text-lg max-w-2xl">
                                Beam us a note for anything from payment quirks to bespoke adjustments. Our concierge crew replies in a median of 45 minutes.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                {[{
                                    label: 'Active tickets',
                                    value: summary.open,
                                }, {
                                    label: 'Resolved this week',
                                    value: summary.resolved,
                                }, {
                                    label: 'Median response',
                                    value: summary.medianResponse,
                                }].map((stat) => (
                                    <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3">
                                        <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/60">{stat.label}</p>
                                        <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/70 to-black p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <FaHeadset size={20} />
                                <p className="text-sm uppercase tracking-[0.35em]">Secure support channel</p>
                            </div>
                            <p className="text-white/70 text-sm">
                                Ticket updates land in your inbox and within the TerraVue app. Encrypted end-to-end.
                            </p>
                            <div className="flex items-center gap-2 text-emerald-300 text-sm">
                                <FaShieldAlt size={14} /> SOC2 compliant helpdesk
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                    <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,1)]">
                        <div className="flex items-center gap-3">
                            <FaInbox />
                            <h2 className="text-2xl font-semibold">Raise a request</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-white/60">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-white"
                                    placeholder="e.g., Need updated invoice"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs uppercase tracking-[0.3em] text-white/60">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:outline-none"
                                    >
                                        {categories.map((item) => (
                                            <option key={item} value={item} className="bg-slate-900">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-[0.3em] text-white/60">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:outline-none"
                                    >
                                        {priorities.map((item) => (
                                            <option key={item} value={item} className="bg-slate-900">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-white/60">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:outline-none"
                                    placeholder="Describe what you need help with..."
                                />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 disabled:opacity-60"
                            >
                                <FaPaperPlane size={14} />
                                {submitting ? 'Sending...' : 'Send request'}
                            </motion.button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <FaClock />
                            <h2 className="text-xl font-semibold">Live SLA feed</h2>
                        </div>
                        <div className="space-y-4">
                            {[{
                                title: 'Priority desk',
                                detail: 'High stakes travel tweaks under 30 min',
                                Icon: FaExclamationTriangle,
                            }, {
                                title: 'In-app chat',
                                detail: 'Concierge DM for any itinerary',
                                Icon: FaHeadset,
                            }, {
                                title: 'Escalation path',
                                detail: 'Direct line to operations for urgent reroutes',
                                Icon: FaShieldAlt,
                            }].map(({ title, detail, Icon }) => (
                                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-4">
                                    <div className="mt-1">
                                        <Icon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{title}</p>
                                        <p className="text-xs text-white/70">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle />
                        <h2 className="text-2xl font-semibold">Recent tickets</h2>
                    </div>
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="h-20 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : tickets.length === 0 ? (
                            <p className="text-white/70">No tickets yet. Submit a request and it will appear here.</p>
                        ) : (
                            tickets.map((ticket) => (
                                <motion.div
                                    key={ticket._id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                >
                                    <div className="flex flex-wrap items-center gap-3 justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.35em] text-white/50">{ticket.category}</p>
                                            <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                                        </div>
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusAccent[ticket.status] || 'border-white/20 text-white/70'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-white/80 line-clamp-2">{ticket.message}</p>
                                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/60">
                                        <span>Priority: {ticket.priority}</span>
                                        <span>Opened: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—'}</span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </section>
            </main>
        </div>
    );
};

export default SupportCenter;
