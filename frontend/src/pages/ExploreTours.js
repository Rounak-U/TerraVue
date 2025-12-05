import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaHeart, FaSignal } from 'react-icons/fa';
import { toursData } from '../data/tours';
import { useNotify } from '../context/NotifyContext';

const ExploreTours = () => {
    const navigate = useNavigate();
    const [filteredTours, setFilteredTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const notify = useNotify();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const categories = ['All', 'Beach', 'Mountain', 'City', 'Adventure', 'Culture', 'Luxury'];

    const tourImageOverrides = useMemo(() => ({
        'Morocco Desert Safari': '/images/tours/Morocco.jpg',
        'Patagonia Adventure': '/images/tours/Patagonia.jpg',
        'Caribbean Cruise': '/images/tours/Caribbean.jpg',
        'Iceland Glaciers & Geysers': '/images/tours/Iceland.jpg',
        'Amazon Rainforest Expedition': '/images/tours/Amazon.jpg',
        'Egypt Ancient Wonders': '/images/tours/Egypt.jpg',
        'Tokyo City Adventure': '/images/tours/Tokyo.jpg',
        'Swiss Alps Mountain Trek': '/images/tours/Swiss.jpg',
        'Kerala Backwater Retreat': '/images/tours/Backwaters.jpeg',
        'Rajasthan Palace Circuit': '/images/tours/rajasthan.jpg',
        'Ladakh Overland Expedition': '/images/tours/Ladakh.jpg',
        'Meghalaya Living Roots Trail': '/images/tours/Meghalaya.jpg',
        'Goa Slow Beach Weekender': '/images/tours/Goa.jpeg',
        'Varanasi Spiritual Sojourn': '/images/tours/Varanasi.jpg',
        'Hampi Heritage Walk': '/images/tours/Hampi.jpg',
        'Andaman Island Escape': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'Rishikesh Wellness Retreat': '/images/tours/Rishikesh.jpg'
    }), []);

    const withImageOverrides = useCallback(
        (list = []) =>
            list.map((tour) => {
                const override = tourImageOverrides[tour.title];
                return override && tour.image !== override ? { ...tour, image: override } : tour;
            }),
        [tourImageOverrides]
    );

    const getTourKey = useCallback((tour = {}) => {
        const titleKey = tour.title?.trim().toLowerCase();
        if (titleKey) return titleKey;
        const idKey = (tour._id || tour.id)?.toString().toLowerCase();
        if (idKey) return idKey;
        return JSON.stringify(tour);
    }, []);

    const mergeTours = useCallback((primary = [], fallback = []) => {
        const deduped = new Map();

        primary.forEach((tour) => {
            const key = getTourKey(tour);
            if (key && !deduped.has(key)) {
                deduped.set(key, tour);
            }
        });

        fallback.forEach((tour) => {
            const key = getTourKey(tour);
            if (key && !deduped.has(key)) {
                deduped.set(key, tour);
            }
        });

        return Array.from(deduped.values());
    }, [getTourKey]);

    const localToursWithOverrides = useMemo(() => withImageOverrides(toursData), [withImageOverrides]);

    const applyLocalFilters = useCallback((toursToFilter = []) => {
        let filtered = [...toursToFilter];

        if (searchTerm) {
            filtered = filtered.filter(tour =>
                tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tour.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tour.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(tour => tour.category === selectedCategory);
        }

        if (minPrice) {
            filtered = filtered.filter(tour => tour.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(tour => tour.price <= parseFloat(maxPrice));
        }

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredTours(filtered);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

    // Fetch tours
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (selectedCategory !== 'All') params.append('category', selectedCategory);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (sortBy) params.append('sortBy', sortBy);

                try {
                    const response = await api.get(`/api/tours?${params.toString()}`);
                    // Handle both array and object response formats
                    const remoteTours = Array.isArray(response.data) ? response.data : response.data.tours || [];
                    const normalizedTours = withImageOverrides(remoteTours);
                    const mergedTours = mergeTours(normalizedTours, localToursWithOverrides);
                    applyLocalFilters(mergedTours);
                } catch (apiError) {
                    console.warn('Backend not available, using local data:', apiError);
                    // Fallback to local data
                    applyLocalFilters(localToursWithOverrides);
                }
            } catch (error) {
                console.error('Failed to fetch tours:', error);
                applyLocalFilters(localToursWithOverrides);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchTours, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, applyLocalFilters, withImageOverrides, mergeTours, localToursWithOverrides]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data } = await api.get('/api/favorites');
                const ids = (data.favorites || []).map((fav) => (fav._id || fav.id)?.toString());
                setFavorites(ids);
            } catch (err) {
                console.warn('Unable to load favourites', err);
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = async (rawTourId) => {
        const tourId = rawTourId?.toString();
        if (!tourId) {
            setFavorites((prev) =>
                prev.includes('local') ? prev.filter((id) => id !== 'local') : [...prev, 'local']
            );
            return;
        }

        try {
            if (favorites.includes(tourId)) {
                await api.delete(`/api/favorites/${tourId}`);
                setFavorites((prev) => prev.filter((id) => id !== tourId));
                notify.info('Removed from favourites');
            } else {
                await api.post('/api/favorites', { tourId });
                setFavorites((prev) => [...prev, tourId]);
                notify.success('Added to favourites');
            }
        } catch (err) {
            notify.error('Unable to update favourites');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#f4f4f1] text-slate-900">
            <DashboardNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-slate-200 text-[0.7rem] uppercase tracking-[0.5em] text-slate-500">
                        curated journeys
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    </div>
                    <h1 className="text-4xl md:text-5xl text-black font-semibold tracking-tight">Explore signature experiences</h1>
                    <p className="text-slate-500 text-lg">Filter minimalist escapes crafted for slow, intentional travel</p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 border border-white shadow-[0_20px_60px_-45px_rgba(15,23,42,0.8)] rounded-3xl p-6 space-y-4"
                >
                    <div className="relative">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by city, mood or keyword"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 rounded-full bg-slate-50 border border-slate-200 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>
                </motion.div>

                {/* Horizontal Filters */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 border border-slate-200 rounded-[2rem] p-8 space-y-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.9)]"
                >
                    {/* Row 1: Category */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                            <span>Category</span>
                            <span>Choose mood</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium border transition ${
                                        selectedCategory === cat
                                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Price, Sort, Clear */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Price Filter */}
                        <div className="space-y-3 lg:col-span-2">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Investment</div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full sm:flex-1 min-w-0 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full sm:flex-1 min-w-0 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>

                        {/* Sort Filter */}
                        <div className="space-y-3 lg:col-span-1">
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Sort</div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end lg:justify-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSortBy('newest');
                                }}
                                className="w-full lg:w-auto px-8 py-3 rounded-xl border border-slate-900 text-xs uppercase tracking-[0.4em] font-semibold hover:bg-slate-900 hover:text-white transition"
                            >
                                reset
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Tours Grid */}
                <div>
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 font-semibold">Loading tours...</p>
                        </div>
                    ) : !Array.isArray(filteredTours) || filteredTours.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 font-semibold text-lg">No tours found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                                {Array.isArray(filteredTours) && filteredTours.map((tour) => {
                                    const tourIdentifier = (tour._id || tour.id || '').toString();
                                    const isFavorite = tourIdentifier && favorites.includes(tourIdentifier);
                                    const cardKey = tour._id || tour.id || tour.title;
                                    return (
                                    <motion.div
                                        key={cardKey}
                                        variants={cardVariants}
                                        whileHover={{ y: -6 }}
                                        className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/95 via-white to-slate-50/80 backdrop-blur shadow-[0_35px_65px_-40px_rgba(15,23,42,0.9)] group cursor-pointer flex flex-col"
                                        onClick={() => navigate(`/tour/${encodeURIComponent(tour.title)}`)}
                                    >
                                        {/* Image Container */}
                                        <div className="px-5 pt-5">
                                            <div className="relative h-72 md:h-80 rounded-[1.5rem] overflow-hidden shadow-[0_20px_45px_-30px_rgba(15,23,42,0.9)]">
                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                                                {tour.oldPrice && (
                                                    <span className="absolute top-5 left-5 px-4 py-2 rounded-full text-[0.65rem] uppercase tracking-[0.4em] bg-white/90 text-slate-900">
                                                        save {Math.round((1 - tour.price / tour.oldPrice) * 100)}%
                                                    </span>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(tourIdentifier || tour._id || tour.id);
                                                    }}
                                                    className="absolute top-5 right-5 rounded-full bg-white text-slate-800 p-3 shadow-[0_18px_30px_-20px_rgba(15,23,42,0.9)] border border-slate-200"
                                                >
                                                    <FaHeart
                                                        size={18}
                                                        className={isFavorite ? 'text-rose-500' : 'text-slate-700'}
                                                        fill="currentColor"
                                                    />
                                                </motion.button>
                                                <div className="absolute bottom-5 left-5">
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-xs font-semibold tracking-[0.3em] text-slate-700">
                                                        {tour.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-6 pt-8 flex flex-col h-full gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-semibold leading-tight group-hover:text-slate-600 transition-colors line-clamp-2">
                                                    {tour.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                size={14}
                                                                className={i < Math.floor(tour.rating) ? 'text-amber-400' : 'text-slate-200'}
                                                                fill={i < Math.floor(tour.rating) ? 'currentColor' : 'none'}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{tour.rating}</span>
                                                    <span className="text-xs uppercase tracking-[0.3em]">{tour.reviews} reviews</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col gap-6">
                                                <p className="text-sm text-slate-500 line-clamp-3 min-h-[60px]">{tour.description}</p>

                                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 text-sm">
                                                    {[{
                                                        label: 'Location', value: tour.country, icon: FaMapMarkerAlt
                                                    }, {
                                                        label: 'Duration', value: `${tour.days} days`, icon: FaCalendarAlt
                                                    }, {
                                                        label: 'Group Size', value: `Max ${tour.maxGroupSize}`, icon: FaUsers
                                                    }, {
                                                        label: 'Level', value: tour.difficulty, icon: FaSignal
                                                    }].map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
                                                                <item.icon size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">{item.label}</p>
                                                                <p className="font-semibold text-slate-800">{item.value}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-end justify-between gap-4 flex-wrap">
                                                <div>
                                                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400 mb-1">Starting</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <p className="text-3xl font-semibold">₹{tour.price.toLocaleString('en-IN')}</p>
                                                        {tour.oldPrice && (
                                                            <span className="text-sm text-slate-400 line-through">₹{tour.oldPrice.toLocaleString('en-IN')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/tour/${tour.title}`);
                                                    }}
                                                    className="px-6 py-3 rounded-full text-xs uppercase tracking-[0.4em] border border-slate-900 hover:bg-slate-900 hover:text-white transition self-end"
                                                >
                                                    Explore
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            </motion.div>
                        )}
                </div>
            </main>
        </div>
    );
};

export default ExploreTours;
