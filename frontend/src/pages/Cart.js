import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaShoppingBag, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, loading, updateItem, removeItem, clearCart, checkout, processing, totals } = useCart();
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentProvider, setPaymentProvider] = useState('TerraPay');
    const [simulateFailure, setSimulateFailure] = useState(false);

    const items = cart?.items || [];
    const isEmpty = items.length === 0;

    const handleStepper = (item, field, direction) => {
        const current = item[field] || 0;
        const next = direction === 'inc' ? current + 1 : current - 1;
        const sanitized = field === 'children' ? Math.max(0, next) : Math.max(1, next);
        updateItem(item._id, { [field]: sanitized }).catch(() => {});
    };

    const handleCheckout = async () => {
        if (isEmpty) return;
        try {
            const data = await checkout({ paymentMethod, paymentProvider, specialRequests: note, simulateFailure });
            navigate('/booking-success', { state: { bookings: data.bookings, payment: data.payment } });
        } catch (error) {
            // handled by context toast
        }
    };

    const renderQuantityControls = (item) => (
        <div className="flex flex-col gap-2 text-xs text-slate-500">
            {[{ label: 'Tours', field: 'quantity' }, { label: 'Adults', field: 'adults' }, { label: 'Children', field: 'children' }].map(({ label, field }) => (
                <div key={field} className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-3 py-1.5">
                    <span className="tracking-[0.3em] uppercase text-[0.55rem]">{label}</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleStepper(item, field, 'dec')}
                            className="h-7 w-7 rounded-full border border-slate-200 text-slate-600"
                        >
                            −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-slate-900">
                            {item[field]}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleStepper(item, field, 'inc')}
                            className="h-7 w-7 rounded-full border border-slate-200 text-slate-600"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a] text-white">
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                        <p className="tracking-[0.5em] text-xs uppercase text-white/60">Syncing cart</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f5ff] text-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
                <div className="flex items-start justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500"
                    >
                        <FaArrowLeft size={12} /> Back
                    </button>
                    <div className="text-right">
                        <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">TerraVue</p>
                        <h1 className="text-3xl font-semibold">Your curated cart</h1>
                    </div>
                </div>

                {isEmpty ? (
                    <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-16 text-center space-y-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.5)]">
                        <FaShoppingBag className="mx-auto text-4xl text-slate-400" />
                        <h2 className="text-2xl font-semibold">Cart feels a little empty</h2>
                        <p className="text-slate-500">Discover handcrafted journeys and drop them here in real time.</p>
                        <button
                            onClick={() => navigate('/explore-tours')}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
                        >
                            Browse tours
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)]">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-48 w-full h-40 rounded-2xl overflow-hidden">
                                            <img
                                                src={item.tour?.image}
                                                alt={item.tour?.title}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://via.placeholder.com/320x200?text=${encodeURIComponent(item.tour?.title || 'Tour')}`;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.5em] text-slate-400">{item.tour?.country}</p>
                                                    <h3 className="text-xl font-semibold text-slate-900">{item.tour?.title}</h3>
                                                    {item.startDate && (
                                                        <p className="text-sm text-slate-500">
                                                            Departing {new Date(item.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item._id).catch(() => {})}
                                                    className="text-rose-500 hover:text-rose-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            {renderQuantityControls(item)}
                                        </div>
                                        <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-right">
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Total</p>
                                                <p className="text-2xl font-semibold text-slate-900">₹{(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                                                <p className="text-xs text-slate-500">₹{(item.tour?.price || 0).toLocaleString('en-IN')} per adult</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Clear all items from your cart?')) {
                                        clearCart().catch(() => {});
                                    }
                                }}
                                className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500"
                            >
                                Clear cart
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.45)]">
                                <div className="flex items-center gap-3">
                                    <FaCreditCard className="text-violet-500" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Checkout</p>
                                        <h2 className="text-xl font-semibold">Payment details</h2>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="grid gap-3">
                                        <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Payment method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                        >
                                            <option value="card">Credit / Debit Card</option>
                                            <option value="upi">UPI</option>
                                            <option value="netbanking">Netbanking</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-3">
                                        <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Provider</label>
                                        <input
                                            value={paymentProvider}
                                            onChange={(e) => setPaymentProvider(e.target.value)}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                            placeholder="e.g. Razorpay"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Concierge note</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            rows={3}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                                            placeholder="Add preferences or requests"
                                        />
                                    </div>
                                    <label className="inline-flex items-center gap-3 text-xs text-slate-500">
                                        <input
                                            type="checkbox"
                                            checked={simulateFailure}
                                            onChange={(e) => setSimulateFailure(e.target.checked)}
                                        />
                                        Simulate failure (test rollback)
                                    </label>
                                </div>

                                <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Taxes (18%)</span>
                                        <span>₹{totals.taxes.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold text-slate-900">
                                        <span>Total</span>
                                        <span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        disabled={processing || isEmpty}
                                        className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ff8fb1] via-[#f472b6] to-[#8b5cf6] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Pay & confirm'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/explore-tours')}
                                        className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-600"
                                    >
                                        Continue shopping
                                    </button>
                                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-600">
                                        <FaShieldAlt />
                                        Payments protected with bank-grade encryption.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
