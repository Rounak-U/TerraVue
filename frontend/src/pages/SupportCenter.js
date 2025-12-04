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
    Open: 'text-amber-700 bg-amber-50 border-amber-200',
    'In Progress': 'text-sky-700 bg-sky-50 border-sky-200',
    Resolved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
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
        <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white px-8 py-10 shadow-[0_35px_120px_-60px_rgba(15,23,42,0.35)]"
                >
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2),_transparent_55%)]" />
                    <div className="relative grid gap-6 lg:grid-cols-[2fr,1fr]">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.6em] text-slate-400">Concierge Desk</p>
                            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900">Always-on support for every itinerary.</h1>
                            <p className="text-slate-500 text-lg max-w-2xl">
                                Beam us a note for anything from payment quirks to bespoke adjustments. Our concierge crew replies in a median of 45 minutes.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
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
                                    <div key={stat.label} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-5 py-3">
                                        <p className="text-[0.55rem] uppercase tracking-[0.45em] text-slate-400">{stat.label}</p>
                                        <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-[#ffe7ef] via-white to-[#eef4ff] p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <FaHeadset size={20} className="text-rose-500" />
                                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Secure support channel</p>
                            </div>
                            <p className="text-slate-500 text-sm">
                                Ticket updates land in your inbox and within the TerraVue app. Encrypted end-to-end.
                            </p>
                            <div className="flex items-center gap-2 text-emerald-600 text-sm">
                                <FaShieldAlt size={14} /> SOC2 compliant helpdesk
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                    <section className="rounded-3xl border border-slate-100 bg-white p-8 space-y-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.25)]">
                        <div className="flex items-center gap-3">
                            <FaInbox className="text-violet-500" />
                            <h2 className="text-2xl font-semibold text-slate-900">Raise a request</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
                                    placeholder="e.g., Need updated invoice"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                                    >
                                        {categories.map((item) => (
                                            <option key={item} value={item} className="bg-white text-slate-900">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                                    >
                                        {priorities.map((item) => (
                                            <option key={item} value={item} className="bg-white text-slate-900">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
                                    placeholder="Describe what you need help with..."
                                />
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fb1] via-[#f472b6] to-[#8b5cf6] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-rose-100/60 disabled:opacity-60"
                            >
                                <FaPaperPlane size={14} />
                                {submitting ? 'Sending...' : 'Send request'}
                            </motion.button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-100 bg-white p-8 space-y-5 shadow-[0_35px_100px_-70px_rgba(15,23,42,0.3)]">
                        <div className="flex items-center gap-3">
                            <FaClock className="text-sky-500" />
                            <h2 className="text-xl font-semibold text-slate-900">Live SLA feed</h2>
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
                                <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex gap-4">
                                    <div className="mt-1">
                                        <Icon className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                                        <p className="text-xs text-slate-500">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="rounded-3xl border border-slate-100 bg-white p-8 space-y-6 shadow-[0_40px_110px_-70px_rgba(15,23,42,0.25)]">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-500" />
                        <h2 className="text-2xl font-semibold text-slate-900">Recent tickets</h2>
                    </div>
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="h-20 rounded-2xl border border-slate-100 bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : tickets.length === 0 ? (
                            <p className="text-slate-500">No tickets yet. Submit a request and it will appear here.</p>
                        ) : (
                            tickets.map((ticket) => (
                                <motion.div
                                    key={ticket._id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                                >
                                    <div className="flex flex-wrap items-center gap-3 justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{ticket.category}</p>
                                            <h3 className="text-lg font-semibold text-slate-900">{ticket.subject}</h3>
                                        </div>
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusAccent[ticket.status] || 'border-slate-200 text-slate-500'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">{ticket.message}</p>
                                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
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
