import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../api/axios';
import {
    FaHeart,
    FaTrash,
    FaStar,
    FaMapMarkerAlt,
    FaClock,
    FaArrowRight,
    FaGlobe,
} from 'react-icons/fa';

const Favourites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/favorites');
            setFavorites(data.favorites || []);
        } catch (err) {
            toast.error('Unable to load favourites right now');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (tourId) => {
        if (!tourId) return;
        try {
            const { data } = await api.delete(`/api/favorites/${tourId}`);
            setFavorites(data.favorites || []);
            toast.info('Removed from favourites');
        } catch (err) {
            toast.error('Failed to update favourites');
        }
    };

    const summary = useMemo(() => {
        const total = favorites.length;
        const nights = favorites.reduce((acc, tour) => acc + (tour.days || 0), 0);
        const avgRating = favorites.length
            ? (favorites.reduce((acc, tour) => acc + (tour.rating || 0), 0) / favorites.length).toFixed(1)
            : '—';
        return { total, nights, avgRating };
    }, [favorites]);

    const statTiles = [
        { label: 'Journeys saved', value: summary.total, accent: 'from-rose-100 via-pink-50 to-orange-50' },
        { label: 'Collective nights', value: summary.nights, accent: 'from-amber-100 via-yellow-50 to-white' },
        { label: 'Avg. rating', value: summary.avgRating, accent: 'from-sky-100 via-cyan-50 to-white' },
        { label: 'Status', value: summary.total ? 'Curated' : 'Empty', accent: 'from-emerald-100 via-teal-50 to-white' },
    ];

    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center text-slate-900 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.35)]"
        >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <FaHeart size={26} />
            </div>
            <h3 className="mt-6 text-3xl font-semibold">Build your shortlist</h3>
            <p className="mt-3 text-slate-500 text-lg max-w-xl mx-auto">
                Tap the heart icon on any tour to stash it here. We keep track of price drops, availability, and curated notes for each favourite.
            </p>
            <button
                onClick={() => navigate('/explore-tours')}
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-900 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 hover:bg-slate-900 hover:text-white"
            >
                Explore curated journeys
                <FaArrowRight size={14} />
            </button>
        </motion.div>
    );

    const renderLoading = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-3xl border border-slate-100 bg-slate-100/60 h-48" />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/60 to-sky-50/60 text-slate-900">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-white via-rose-50/70 to-orange-50/60 px-8 py-10 shadow-[0_55px_120px_-80px_rgba(15,23,42,0.35)]"
                >
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_55%)]" />
                    <div className="relative grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4 text-left">
                            <p className="text-xs uppercase tracking-[0.6em] text-slate-400">Saved retreats</p>
                            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900 text-left">Your favourite journeys, orbit-ready.</h1>
                            <p className="text-slate-500 text-lg max-w-xl">
                                Perfect for comparing pacing, climates, and vibes before committing. We sync availability in real time — no spreadsheets needed.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-slate-900">
                            {statTiles.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl border border-white/60 bg-gradient-to-br ${stat.accent} p-4 text-left`}
                                >
                                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {loading && renderLoading()}
                {!loading && favorites.length === 0 && renderEmptyState()}

                {!loading && favorites.length > 0 && (
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 },
                            },
                        }}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {favorites.map((tour) => (
                            <motion.article
                                key={tour._id || tour.id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-rose-50/50 to-orange-50/30 text-slate-900 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.35)]"
                            >
                                <div className="relative h-56">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400?text=' + (tour.title || 'TerraVue');
                                        }}
                                    />
                                    <button
                                        onClick={() => removeFavorite(tour._id)}
                                        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-600">
                                        <FaGlobe size={10} />
                                        {tour.category || 'Curated'}
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">{tour.country}</p>
                                            <h3 className="text-2xl font-semibold text-slate-900">{tour.title}</h3>
                                        </div>
                                        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 text-emerald-700 text-sm font-semibold">
                                            {tour.days} days • ${tour.price}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt />
                                            <span>{tour.country}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaClock />
                                            <span>{tour.days} days</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-amber-300" />
                                            <span>{tour.rating || '4.6'}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate(`/tour/${encodeURIComponent(tour.title)}`)}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-900 hover:bg-gradient-to-r hover:from-slate-900 hover:to-slate-700 hover:text-white"
                                        >
                                            View journey
                                            <FaArrowRight size={12} />
                                        </button>
                                        <button
                                            onClick={() => removeFavorite(tour._id)}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 hover:text-slate-900"
                                        >
                                            Remove
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.section>
                )}
            </main>
        </div>
    );
};

export default Favourites;
