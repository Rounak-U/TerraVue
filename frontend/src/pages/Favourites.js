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

    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center text-white shadow-[0_35px_120px_-45px_rgba(15,23,42,0.9)]"
        >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <FaHeart size={26} className="text-rose-300" />
            </div>
            <h3 className="mt-6 text-3xl font-semibold">Build your shortlist</h3>
            <p className="mt-3 text-white/70 text-lg max-w-xl mx-auto">
                Tap the heart icon on any tour to stash it here. We keep track of price drops, availability, and curated notes for each favourite.
            </p>
            <button
                onClick={() => navigate('/explore-tours')}
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white hover:bg-white hover:text-slate-900"
            >
                Explore curated journeys
                <FaArrowRight size={14} />
            </button>
        </motion.div>
    );

    const renderLoading = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-3xl border border-white/10 bg-white/5 h-48" />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-10 text-white shadow-[0_45px_140px_-65px_rgba(15,23,42,1)]"
                >
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]" />
                    <div className="relative grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Saved retreats</p>
                            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Your favourite journeys, orbit-ready.</h1>
                            <p className="text-white/70 text-lg max-w-xl">
                                Perfect for comparing pacing, climates, and vibes before committing. We sync availability in real time — no spreadsheets needed.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-slate-900">
                            {[{
                                label: 'Journeys saved',
                                value: summary.total,
                            }, {
                                label: 'Collective nights',
                                value: summary.nights,
                            }, {
                                label: 'Avg. rating',
                                value: summary.avgRating,
                            }, {
                                label: 'Status',
                                value: summary.total ? 'Curated' : 'Empty',
                            }].map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-2xl border border-white/15 p-4 text-white ${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}
                                >
                                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/70">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
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
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_25px_80px_-45px_rgba(15,23,42,1)]"
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
                                        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.4em]">
                                        <FaGlobe size={10} />
                                        {tour.category || 'Curated'}
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50">{tour.country}</p>
                                            <h3 className="text-2xl font-semibold">{tour.title}</h3>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-emerald-200 text-sm font-semibold">
                                            {tour.days} days • ${tour.price}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm text-white/80">
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
                                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] hover:bg-white hover:text-slate-900"
                                        >
                                            View journey
                                            <FaArrowRight size={12} />
                                        </button>
                                        <button
                                            onClick={() => removeFavorite(tour._id)}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 hover:text-white"
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
