import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaStar,
    FaShoppingCart, FaCheckCircle, FaWalking, FaUtensils,
    FaCamera, FaHotel, FaWifi, FaDumbbell, FaCheck,
    FaHeart, FaShare, FaPhone, FaEnvelope,
    FaTicketAlt, FaUmbrella, FaThermometerHalf, FaBus, FaMapMarker, 
    FaThumbsUp, FaTrophy, FaShieldAlt, FaGlobe, FaCreditCard
} from 'react-icons/fa';
import api from '../api/axios';
import { toursData } from '../data/tours';
import { useCart } from '../context/CartContext';
import { useNotify } from '../context/NotifyContext';

const TourDetail = () => {
    const { tourTitle } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);
    // ...existing code...
    const notify = useNotify();

    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                // Try fetching by ID first (since URLs use IDs from ExploreTours)
                let response;
                try {
                    response = await api.get(`/api/tours/${tourTitle}`);
                    setTour(response.data);
                } catch (idError) {
                    // If ID fetch fails, try fetching by title (for backward compatibility)
                    try {
                        response = await api.get(`/api/tours/details/${tourTitle}`);
                        setTour(response.data);
                    } catch (titleError) {
                        // Fallback to local data
                        const localTour = toursData.find(t => 
                            t._id === tourTitle || 
                            t.title.toLowerCase() === tourTitle.toLowerCase()
                        );
                        if (localTour) {
                            setTour(localTour);
                        } else {
                            console.error('Tour not found:', tourTitle);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch tour:', error);
                // Final fallback to local data
                const localTour = toursData.find(t => 
                    t._id === tourTitle || 
                    t.title.toLowerCase() === tourTitle.toLowerCase()
                );
                if (localTour) {
                    setTour(localTour);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [tourTitle]);

    useEffect(() => {
        const syncFavoriteState = async () => {
            if (!tour || !tour._id) {
                setIsFavorite(false);
                return;
            }
            try {
                const { data } = await api.get('/api/favorites');
                const ids = (data.favorites || []).map((fav) => fav._id?.toString());
                setIsFavorite(ids.includes(tour._id.toString()));
            } catch (err) {
                console.warn('Unable to sync favourites', err);
            }
        };

        syncFavoriteState();
    }, [tour]);

    const handleAddToCart = async () => {
        const resolvedTourId = tour?._id || tour?.id;
        if (!resolvedTourId) {
            notify.error('Unable to locate this tour in the catalogue');
            return;
        }

        if (!startDate) {
            notify.error('Pick a travel date to continue');
            return;
        }

        setAdding(true);
        try {
            await addItem({
                tourId: resolvedTourId,
                tourTitle: tour.title,
                quantity,
                adults,
                children,
                startDate,
            });
            setAddSuccess(true);
            notify.success('Seats held in your cart');
        } catch (error) {
            // addItem already triggers a notification, so we only reset local state here
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block">
                        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                    </div>
                    <p className="text-xl font-light tracking-wide">Loading tour details...</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Tour Not Found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold transition"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = (tour.price || 0) * quantity * adults;
    const minDate = new Date().toISOString().split('T')[0];
    const savings = tour.oldPrice ? tour.oldPrice - tour.price : 0;

    const amenities = [
        { icon: FaHotel, label: '4-5 Star Hotels' },
        { icon: FaUtensils, label: 'All Meals' },
        { icon: FaWifi, label: 'WiFi Included' },
        { icon: FaCamera, label: 'Photography' },
        { icon: FaBus, label: 'Transport' },
        { icon: FaTicketAlt, label: 'Entrance Fees' },
    ];

    const vibeLookup = {
        Beach: 'Slow coastal',
        Mountain: 'High-altitude calm',
        City: 'Design-led urban',
        Adventure: 'Adrenaline & awe',
        Culture: 'Story-rich wander',
        Luxury: 'Curated indulgence'
    };

    const effortLookup = {
        Easy: 'Relaxed pace',
        Moderate: 'Balanced pace',
        Hard: 'High energy'
    };

    const exploreInsights = [
        {
            label: 'Journey vibe',
            value: vibeLookup[tour.category] || 'Curated escape',
            icon: FaUmbrella
        },
        {
            label: 'Energy level',
            value: effortLookup[tour.difficulty] || 'Flexible',
            icon: FaWalking
        },
        {
            label: 'Climate window',
            value: tour.weather || 'Mild 18°-25°C',
            icon: FaThermometerHalf
        }
    ];

    const isIndiaJourney = tour.country?.toLowerCase() === 'india';

    const immersionTracks = [
        {
            title: 'Local circles',
            meta: isIndiaJourney ? 'Handlooms, ghats, and craft ateliers' : `Meet makers across ${tour.country}`,
            icon: FaMapMarker
        },
        {
            title: 'Taste studio',
            meta: isIndiaJourney ? 'Regional thalis + spice ateliers' : 'Chef-led tasting menus',
            icon: FaUtensils
        },
        {
            title: 'Flow & movement',
            meta: isIndiaJourney ? 'Ganga-side yoga & mindful hikes' : 'Nature-forward wellness slots',
            icon: FaDumbbell
        }
    ];

    const highlights = tour.highlights || [
        'Stunning mountain vistas',
        'Local cultural experiences',
        'Gourmet dining experiences',
        'Professional guided tours',
        'Photography opportunities',
        'Luxury accommodation'
    ];

    const reviews = [
        { name: 'Priya Sharma', rating: 5, comment: 'Absolutely amazing experience! The guides were knowledgeable and the itinerary was perfectly planned.' },
        { name: 'Rajesh Kumar', rating: 5, comment: 'Best vacation ever. The accommodations were luxurious and the food was delicious.' },
        { name: 'Ananya Gupta', rating: 4.5, comment: 'Great tour with wonderful memories. Would definitely recommend to friends and family.' }
    ];

    const whyChooseUs = [
        { icon: FaTrophy, title: 'Award Winning', desc: 'Recognized globally for excellence' },
        { icon: FaShieldAlt, title: 'Safe & Secure', desc: 'Your safety is our priority' },
        { icon: FaGlobe, title: 'Worldwide Network', desc: 'Partners in 50+ countries' },
        { icon: FaCreditCard, title: 'Flexible Payment', desc: 'Easy payment options' }
    ];

    return (
        <div className="min-h-screen bg-[#f4f4f1] text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
                <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-4 sm:px-6 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="justify-self-start inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 hover:text-slate-900"
                    >
                        <FaArrowLeft size={14} /> Back
                    </button>
                    <div className="justify-self-center text-center">
                        <p className="text-[0.65rem] uppercase tracking-[0.7em] text-slate-400">TerraVue</p>
                        <p className="text-sm font-semibold tracking-[0.3em] text-slate-700">Detailed Tour</p>
                    </div>
                    <div className="justify-self-end flex items-center gap-3">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase px-4 py-2 rounded-full bg-black text-white transition hover:opacity-85"
                        >
                            <FaShoppingCart size={16} /> Cart
                        </button>
                        <button className="text-slate-400 hover:text-slate-900 transition">
                            <FaShare size={16} />
                        </button>
                        <button
                            onClick={async () => {
                                if (!tour?._id) {
                                    setIsFavorite(!isFavorite);
                                    return;
                                }

                                try {
                                    if (isFavorite) {
                                        await api.delete(`/api/favorites/${tour._id}`);
                                        setIsFavorite(false);
                                        notify.info('Removed from favourites');
                                    } else {
                                        await api.post('/api/favorites', { tourId: tour._id });
                                        setIsFavorite(true);
                                        notify.success('Added to favourites');
                                    }
                                } catch (err) {
                                    notify.error('Unable to update favourites');
                                }
                            }}
                            className={`transition ${isFavorite ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-600'}`}
                        >
                            <FaHeart size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
                {/* Hero */}
                <section className="relative rounded-[2.5rem] overflow-hidden bg-black shadow-[0_30px_80px_-35px_rgba(15,23,42,0.55)]">
                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-[440px] object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/1200x450?text=' + tour.title;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                    <div className="absolute top-0 left-0 m-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.65rem] uppercase tracking-[0.5em] text-white/80 border border-white/30 backdrop-blur">
                            curated escape
                            <span className="block w-2 h-2 rounded-full bg-gradient-to-r from-white to-slate-300" />
                        </span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white flex flex-col gap-6">
                        <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-white/70">
                            <span>{tour.country}</span>
                            <span className="w-8 h-px bg-white/30" />
                            <span>{tour.days} Days</span>
                            <span className="w-8 h-px bg-white/30" />
                            <span>{tour.difficulty || 'Moderate'}</span>
                        </div>
                        <div className="flex flex-wrap items-end gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.8em] text-white/60 mb-2">Signature Journey</p>
                                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">{tour.title}</h1>
                            </div>
                            <div className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 flex items-center gap-2">
                                <FaStar className="text-amber-300" />
                                {tour.rating || 4.6}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Duration', value: `${tour.days} Days` },
                        { label: 'Guests', value: `${tour.maxGroupSize || 18} People` },
                        { label: 'Starting From', value: tour.departure || 'Multiple Cities' },
                        { label: 'Availability', value: tour.available ? 'Open Slots' : 'Waitlist' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/90 backdrop-blur rounded-3xl p-5 border border-white shadow-[0_20px_40px_-35px_rgba(15,23,42,0.8)]">
                            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400 mb-2">{stat.label}</p>
                            <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </section>

                <section className="rounded-[2.7rem] border border-slate-100 bg-white/95 backdrop-blur px-6 py-8 sm:px-10 space-y-8 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.65)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Explore details</p>
                            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight mt-2">
                                A modern playbook for {isIndiaJourney ? 'slow-travel India' : `${tour.country} wanderers`}
                            </h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Built with micro-itineraries, concierge intel, and culture-forward pauses so you can experience more with less rush.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[0.65rem] uppercase tracking-[0.45em] text-slate-500">
                            Explorer mode
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {exploreInsights.map((insight) => (
                            <div key={insight.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-800">
                                    <insight.icon />
                                </div>
                                <div>
                                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">{insight.label}</p>
                                    <p className="text-sm font-semibold text-slate-800">{insight.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {immersionTracks.map((track) => (
                            <div key={track.title} className="rounded-[1.9rem] border border-slate-100 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.9)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                        <track.icon size={16} />
                                    </div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600">{track.title}</p>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">{track.meta}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-6 flex flex-wrap items-center gap-6 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.8)]">
                        <div>
                            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400">Next Departure</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">{startDate || 'Select date'}</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden sm:block" />
                        <div>
                            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400">Weather Window</p>
                            <p className="text-lg font-semibold">{tour.weather || 'Mild • 18°-23°C'}</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden sm:block" />
                        <div>
                            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-slate-400">Savings</p>
                            <p className="text-lg font-semibold">₹{savings > 0 ? savings.toLocaleString('en-IN') : 'Included perks'}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 shadow-lg">
                        <p className="text-xs uppercase tracking-[0.5em] text-white/60">Concierge Note</p>
                        <p className="text-lg font-semibold mt-2">Designed for travelers who enjoy slow luxury with intentional pacing.</p>
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-3">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <nav className="flex flex-wrap gap-3">
                            {['overview', 'highlights', 'itinerary', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[0.65rem] uppercase tracking-[0.4em] px-5 py-2 rounded-full border transition ${
                                        activeTab === tab
                                            ? 'text-slate-900 border-slate-900 bg-white shadow-sm'
                                            : 'text-slate-400 border-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <p className="text-base leading-relaxed text-slate-600">{tour.description}</p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {amenities.map((amenity, idx) => (
                                        <div key={idx} className="bg-white border border-slate-100 rounded-[1.4rem] p-5 flex flex-col items-center gap-3 text-sm text-center shadow-[0_20px_40px_-35px_rgba(15,23,42,0.8)] transition hover:-translate-y-1">
                                            <amenity.icon className="text-2xl text-slate-900" />
                                            <span className="font-medium text-slate-600">{amenity.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm">
                                        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-400">Group Size</p>
                                        <p className="text-2xl font-semibold mt-3">{tour.maxGroupSize || 15} Guests</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm">
                                        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-400">Season Window</p>
                                        <p className="text-2xl font-semibold mt-3">{tour.season || 'Year Round'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'highlights' && (
                            <div className="space-y-3">
                                {highlights.map((highlight, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-[1.6rem] p-5 flex gap-4 items-start shadow-sm hover:-translate-y-1 transition">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                                            <FaCheck />
                                        </div>
                                        <p className="font-semibold text-slate-700">{highlight}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'itinerary' && (
                            <div className="space-y-4">
                                {[...Array(tour.days || 5)].map((_, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-[1.7rem] p-6 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold tracking-tight">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Day {idx + 1}</p>
                                                <p className="mt-2 text-slate-700">Explore the destination with curated experiences, local dining and slow travel moments.</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-5">
                                <div className="bg-white border border-slate-100 rounded-[1.8rem] p-6 shadow-sm flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Traveler Rating</p>
                                        <p className="text-4xl font-semibold mt-2">{tour.rating || 4.8}</p>
                                    </div>
                                    <div className="flex gap-2 text-amber-400 text-xl">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-500">Based on {reviews.length * 200}+ verified travelers</p>
                                </div>
                                {reviews.map((review, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-[1.8rem] p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-semibold text-slate-800">{review.name}</p>
                                            <FaThumbsUp className="text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4">
                            {whyChooseUs.map((feature, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                                    <feature.icon className="text-2xl text-slate-900" />
                                    <div>
                                        <p className="font-semibold text-slate-800 tracking-wide">{feature.title}</p>
                                        <p className="text-sm text-slate-500">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-white/95 border border-slate-100 rounded-[2.3rem] p-6 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.8)]">
                            <div className="mb-6">
                                <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">Investment</p>
                                <div className="flex items-end gap-3 mt-2">
                                    <p className="text-4xl font-semibold text-slate-900">₹{(tour.price || 0).toLocaleString('en-IN')}</p>
                                    {tour.oldPrice && (
                                        <span className="text-sm text-slate-400 line-through">₹{(tour.oldPrice || 0).toLocaleString('en-IN')}</span>
                                    )}
                                </div>
                            </div>

                            {[{
                                label: 'Packages', value: quantity, setter: setQuantity, min: 1
                            }, {
                                label: 'Adults', value: adults, setter: setAdults, min: 1
                            }, {
                                label: 'Children (2-12)', value: children, setter: setChildren, min: 0
                            }].map((field, idx) => (
                                <div key={idx} className="mb-4">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">{field.label}</p>
                                    <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                                        <button
                                            onClick={() => field.setter(Math.max(field.min, field.value - 1))}
                                            className="w-10 h-10 text-lg text-slate-900"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={field.value}
                                            onChange={(e) => field.setter(Math.max(field.min, parseInt(e.target.value) || field.min))}
                                            className="w-full text-center text-slate-900 font-semibold bg-transparent"
                                        />
                                        <button
                                            onClick={() => field.setter(field.value + 1)}
                                            className="w-10 h-10 text-lg text-slate-900"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">Start Date</p>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={minDate}
                                    className="w-full border border-slate-300 rounded-2xl px-4 py-2 text-sm"
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>₹{(tour.price || 0).toLocaleString('en-IN')} x {quantity} x {adults}</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold text-slate-900">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={adding || addSuccess}
                                className={`w-full mt-6 py-3 rounded-2xl text-[0.65rem] font-semibold tracking-[0.5em] uppercase flex items-center justify-center gap-2 transition ${
                                    addSuccess
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:opacity-90'
                                } ${adding ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {addSuccess ? <><FaCheckCircle /> Seat held</> : <><FaShoppingCart /> Hold seat</>}
                            </button>

                            {addSuccess && (
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full mt-3 py-3 rounded-2xl bg-black text-white text-[0.65rem] font-semibold tracking-[0.45em] uppercase flex items-center justify-center gap-2 hover:opacity-85 transition"
                                >
                                    <FaShoppingCart /> Go to cart
                                </button>
                            )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500 mb-4">Concierge</p>
                            <div className="space-y-2 text-sm text-slate-700">
                                <a href="tel:+910000000000" className="flex items-center gap-3 hover:text-slate-900">
                                    <FaPhone /> +91-XXXXX-XXXXX
                                </a>
                                <a href="mailto:support@terravue.com" className="flex items-center gap-3 hover:text-slate-900">
                                    <FaEnvelope /> support@terravue.com
                                </a>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Footer Info */}
                <section className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <p className="font-semibold tracking-wide text-slate-900 mb-3">Cancellation Policy</p>
                            <ul className="space-y-2 text-slate-600">
                                <li>• Free cancellation up to 30 days</li>
                                <li>• 50% refund until day 15</li>
                                <li>• Fully non-refundable afterward</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <p className="font-semibold tracking-wide text-slate-900 mb-3">Travel Essentials</p>
                            <ul className="space-y-2 text-slate-600">
                                <li>• Passport valid 6+ months</li>
                                <li>• Smart monochrome attire</li>
                                <li>• Recommended travel insurance</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <p className="font-semibold tracking-wide text-slate-900 mb-3">Documents & Health</p>
                            <ul className="space-y-2 text-slate-600">
                                <li>• Visa assistance available</li>
                                <li>• Personalized health brief</li>
                                <li>• 24x7 support concierge</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-8 flex flex-wrap items-center gap-6 justify-between shadow-[0_40px_80px_-45px_rgba(15,23,42,0.9)]">
                        <div>
                            <p className="text-xs uppercase tracking-[0.6em] text-white/60">next step</p>
                            <p className="text-3xl font-semibold mt-2">Ready for slow travel done right?</p>
                            <p className="text-white/70 mt-2 max-w-xl">Hold your seat and our concierge will finalize the finer details within 12 hours.</p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="px-8 py-3 rounded-full border border-white/30 text-xs font-semibold tracking-[0.45em] uppercase hover:bg-white hover:text-slate-900 transition"
                        >
                            Reserve
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TourDetail;
