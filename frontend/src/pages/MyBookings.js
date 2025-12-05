import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaRupeeSign, FaCheckCircle, FaClock, FaFileInvoiceDollar } from 'react-icons/fa';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../api/axios';
import { useNotify } from '../context/NotifyContext';

const statusAccent = {
    confirmed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    cancelled: 'text-rose-600 bg-rose-50 border-rose-200',
    completed: 'text-slate-600 bg-slate-100 border-slate-200',
};

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingInvoices, setDownloadingInvoices] = useState({});
    const notify = useNotify();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/api/bookings/my-bookings');
                setBookings(data || []);
            } catch (err) {
                setError('Unable to load bookings right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const aggregates = useMemo(() => {
        const total = bookings.length;
        const upcoming = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).length;
        const spent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        return {
            total,
            upcoming,
            spent,
        };
    }, [bookings]);

    const handleInvoiceDownload = async (booking) => {
        const bookingId = booking._id;
        setDownloadingInvoices((prev) => ({ ...prev, [bookingId]: true }));
        try {
            const response = await api.get(`/api/bookings/${bookingId}/invoice`, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `TerraVue_Invoice_${booking.bookingReference || bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            notify.success('Invoice downloaded');
        } catch (err) {
            notify.error('Unable to generate invoice right now');
        } finally {
            setDownloadingInvoices((prev) => {
                const next = { ...prev };
                delete next[bookingId];
                return next;
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f6f2] text-slate-900">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10">
                <section className="space-y-4">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Travel ledger</p>
                    <div className="flex flex-wrap items-start gap-4">
                        <div>
                            <h1 className="text-4xl font-semibold text-black text-left">My bookings</h1>
                            <p className="text-slate-500 text-left">Track confirmations, invoices, and live statuses in one dashboard.</p>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[{
                            label: 'Total journeys',
                            value: aggregates.total,
                            meta: 'All time',
                        }, {
                            label: 'Upcoming',
                            value: aggregates.upcoming,
                            meta: 'Pending / confirmed',
                        }, {
                            label: 'Lifetime spend',
                            value: `₹${aggregates.spent.toLocaleString('en-IN')}`,
                            meta: 'Includes taxes',
                        }].map((tile) => (
                            <div key={tile.label} className="rounded-3xl border border-white bg-white p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)]">
                                <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">{tile.label}</p>
                                <p className="mt-3 text-3xl font-semibold">{tile.value}</p>
                                <p className="text-xs text-slate-500">{tile.meta}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.35)] space-y-6">
                    <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-violet-500" />
                        <h2 className="text-2xl font-semibold">Current bookings</h2>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="h-28 rounded-3xl border border-slate-100 bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-600">
                            {error}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                            No journeys booked yet. Add experiences to your cart and confirm checkout to see them here.
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {bookings.map((booking) => {
                                const isPaid = booking.paymentStatus === 'paid';
                                const isDownloading = Boolean(downloadingInvoices[booking._id]);
                                return (
                                <motion.div
                                    key={booking._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="rounded-3xl border border-slate-100 bg-slate-50 p-6"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{booking.bookingReference}</p>
                                            <h3 className="text-xl font-semibold">{booking.tour?.title || 'Custom experience'}</h3>
                                            <p className="text-sm text-slate-500">{booking.tour?.country}</p>
                                        </div>
                                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusAccent[booking.status] || 'border-slate-200 text-slate-500'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-slate-500" />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Start</p>
                                                <p>{booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-slate-500" />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">End</p>
                                                <p>{booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-slate-500" />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Guests</p>
                                                <p>{booking.adults} adults • {booking.children} children</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaRupeeSign className="text-slate-500" />
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Total</p>
                                                <p>₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1">
                                            <FaCheckCircle className="text-emerald-500" />
                                            Payment {booking.paymentStatus}
                                        </span>
                                        {booking.specialRequests && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1">
                                                <FaClock className="text-slate-500" />
                                                Notes added
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleInvoiceDownload(booking)}
                                            disabled={!isPaid || isDownloading}
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                                                !isPaid || isDownloading
                                                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                                    : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                                            }`}
                                        >
                                            <FaFileInvoiceDollar size={12} />
                                            {isDownloading ? 'Preparing...' : 'Download invoice'}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                            })}
                        </AnimatePresence>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MyBookings;
