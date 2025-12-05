import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaEye, FaCreditCard } from 'react-icons/fa';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        if (location.state?.bookings) {
            setBookings(location.state.bookings);
            setPayment(location.state.payment || null);
        } else {
            // Redirect if no bookings in state
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    }, [location, navigate]);

    const bookingTotals = useMemo(() => (
        bookings.reduce((acc, booking) => ({
            amount: acc.amount + (booking.totalPrice || 0),
            travelers: acc.travelers + (booking.adults || 0) + (booking.children || 0)
        }), { amount: 0, travelers: 0 })
    ), [bookings]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const parsed = new Date(dateString);
        if (Number.isNaN(parsed.getTime())) return '—';
        return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#f7f7f4] text-slate-900">
            <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
                <div className="rounded-[2.5rem] border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_45px_120px_-60px_rgba(15,23,42,0.35)]">
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 p-6">
                            <FaCheckCircle className="text-5xl text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-[0.6rem] uppercase tracking-[0.6em] text-slate-400">TerraVue booking desk</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight">Booking confirmed</h1>
                    <p className="mt-3 text-base text-slate-500">
                        We emailed your confirmation, complete itinerary, and concierge contact. Our team will reach out within 12 hours with next steps.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
                        {[{
                            label: 'Journeys held',
                            value: bookings.length.toString().padStart(2, '0'),
                            note: 'Multi-city supported'
                        }, {
                            label: 'Guests traveling',
                            value: bookingTotals.travelers || '—',
                            note: 'Adults + children'
                        }, {
                            label: 'Total value',
                            value: `₹${bookingTotals.amount.toLocaleString('en-IN')}`,
                            note: 'Taxes included'
                        }].map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4">
                                <p className="text-[0.55rem] uppercase tracking-[0.5em] text-slate-400">{stat.label}</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500">{stat.note}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {bookings.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-sm uppercase tracking-[0.5em] text-slate-400">Booking manifest</h2>
                        <div className="space-y-5">
                            {bookings.map((booking, idx) => (
                                <article key={booking._id} className="rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.35)]">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-[0.55rem] uppercase tracking-[0.6em] text-slate-400">Booking {idx + 1}</p>
                                            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{booking.tour?.title}</h3>
                                            <p className="text-sm text-slate-500">Reference <span className="font-mono text-slate-800">{booking.bookingReference}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Value</p>
                                            <p className="text-2xl font-semibold text-slate-900">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-emerald-600 capitalize">{booking.status}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-slate-600">
                                        <div>
                                            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">Travelers</p>
                                            <p className="mt-1 font-semibold">{booking.adults} adults · {booking.children} children</p>
                                        </div>
                                        <div>
                                            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">Start date</p>
                                            <p className="mt-1 font-semibold">{formatDate(booking.startDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">Itinerary length</p>
                                            <p className="mt-1 font-semibold">{booking.tour?.days || '—'} days</p>
                                        </div>
                                        <div>
                                            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">Region</p>
                                            <p className="mt-1 font-semibold">{booking.tour?.country || 'To be shared'}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {payment && (
                    <section className="rounded-[2.3rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_45px_100px_-70px_rgba(15,23,42,0.35)]">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full border border-violet-200 bg-violet-50 p-3">
                                    <FaCreditCard className="text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-[0.55rem] uppercase tracking-[0.5em] text-slate-400">Payment snapshot</p>
                                    <h3 className="text-xl font-semibold text-slate-900">{payment.provider}</h3>
                                </div>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">{payment.status}</span>
                        </div>
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            {[{
                                label: 'Reference',
                                value: payment.reference,
                                classes: 'font-mono'
                            }, {
                                label: 'Method',
                                value: payment.method,
                                classes: 'capitalize'
                            }, {
                                label: 'Amount',
                                value: `₹${(payment.amount || 0).toLocaleString('en-IN')}`,
                                classes: 'text-2xl font-semibold text-slate-900'
                            }, {
                                label: 'Captured on',
                                value: formatDate(payment.createdAt)
                            }].map((field) => (
                                <div key={field.label} className="text-sm text-slate-600">
                                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">{field.label}</p>
                                    <p className={`mt-1 font-semibold ${field.classes || ''}`}>{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_35px_90px_-70px_rgba(15,23,42,0.35)]">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 hover:bg-white"
                        >
                            <span className="flex items-center justify-center gap-2"><FaHome /> Dashboard</span>
                        </button>
                        <button
                            onClick={() => navigate('/explore-tours')}
                            className="rounded-2xl border border-slate-900 bg-slate-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white hover:opacity-90"
                        >
                            <span className="flex items-center justify-center gap-2"><FaEye /> Browse more tours</span>
                        </button>
                    </div>
                </section>

                <section className="rounded-[2.3rem] border border-blue-100 bg-blue-50 px-6 py-8">
                    <h3 className="text-lg font-semibold text-slate-900">Upcoming concierge steps</h3>
                    <p className="text-sm text-slate-600 mt-1">Stay prepared while we ready your journey dossier.</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-700">
                        <li>• Review the confirmation email and download the attached itinerary PDF.</li>
                        <li>• Update traveler preferences and documents from the dashboard within 48 hours.</li>
                        <li>• Expect a concierge call for personalization within the next business day.</li>
                        <li>• Reach out to support@terravue.com for any amendments or special assistance.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default BookingSuccess;
