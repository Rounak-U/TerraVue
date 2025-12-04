import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaHome, FaPlane, FaHeadset, FaSignOutAlt, FaCog, FaHeart, FaMapMarkerAlt, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function DashboardNavbar() {
    const [user, setUser] = useState(null);
    const [deviceLocation, setDeviceLocation] = useState('');
    const [locationDenied, setLocationDenied] = useState(false);
    const [isResolvingLocation, setIsResolvingLocation] = useState(false);
    const navigate = useNavigate();
    const { cartCount, loading: cartLoading } = useCart();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const resolveCoordinates = useCallback(async ({ latitude, longitude }) => {
        try {
            const { data } = await api.post('/api/location/reverse', { latitude, longitude });
            if (data?.location) {
                setDeviceLocation(data.location);
            } else {
                setDeviceLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
        } catch (error) {
            console.warn('Unable to resolve location', error);
            setDeviceLocation(user?.location || 'Location unavailable');
        } finally {
            setIsResolvingLocation(false);
        }
    }, [user]);

    const requestDeviceLocation = useCallback(() => {
        if (!user) return;

        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setLocationDenied(true);
            setDeviceLocation(user?.location || 'Location unavailable');
            return;
        }

        setIsResolvingLocation(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLocationDenied(false);
                resolveCoordinates(coords);
            },
            (error) => {
                console.warn('Geolocation denied or failed', error);
                setLocationDenied(true);
                setIsResolvingLocation(false);
                setDeviceLocation(user?.location || 'Location unavailable');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [resolveCoordinates, user]);

    useEffect(() => {
        if (!user) {
            setDeviceLocation('');
            setLocationDenied(false);
            setIsResolvingLocation(false);
            return;
        }

        requestDeviceLocation();
    }, [user, requestDeviceLocation]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/api/auth/logout', { token: refreshToken });
            }
        } catch (err) {
            console.warn('Logout failed', err);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard', icon: FaHome },
        { label: 'Explore Tours', path: '/explore-tours', icon: FaPlane },
        { label: 'My Favourites', path: '/favourites', icon: FaHeart },
        { label: 'My Bookings', path: '/bookings', icon: FaClipboardList },
        { label: 'Support', path: '/support-center', icon: FaHeadset }
    ];

    const travelerLocation = deviceLocation || user?.location || 'Location unavailable';

    return (
        <nav className="sticky top-0 z-50 bg-white/65 backdrop-blur-[30px] border-b border-black/5 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.4)]">
            <div className="w-full max-w-none mx-0 px-6 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-3 pr-6 border-r border-black/5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-black via-slate-900 to-slate-700 flex items-center justify-center text-white font-semibold">
                                T
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-black font-semibold text-xl">TerraVue</span>
                                <span className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-500">
                                    Journeys
                                </span>
                            </div>
                        </Link>

                        {/* Actions Cluster (top row) */}
                        <div className="flex items-center gap-3 ml-auto">
                            {user && (
                                <button
                                    type="button"
                                    onClick={locationDenied ? requestDeviceLocation : undefined}
                                    className={`hidden lg:flex items-center gap-2 h-10 rounded-full border px-4 text-[0.65rem] font-semibold uppercase tracking-[0.32em] transition ${
                                        locationDenied
                                            ? 'border-rose-200 bg-rose-50 text-rose-500 hover:border-rose-300 hover:bg-rose-100'
                                            : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                                    title={locationDenied ? 'Click to allow location access' : travelerLocation}
                                >
                                    <FaMapMarkerAlt size={12} className={locationDenied ? 'text-rose-500' : 'text-slate-500'} />
                                    {locationDenied ? 'Enable location' : (isResolvingLocation ? 'Detecting...' : travelerLocation)}
                                </button>
                            )}

                            {user ? (
                                <>
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="hidden lg:flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-white px-5 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-slate-600 relative"
                                        title="Shopping Cart"
                                    >
                                        <FaShoppingCart size={14} />
                                        Cart
                                        {!cartLoading && cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-5 min-w-[1.5rem] px-1 rounded-full bg-rose-500 text-white text-[0.65rem] font-semibold flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                    <div className="flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-white px-5">
                                        <span className="text-[0.75rem] font-semibold text-slate-900">{user.name}</span>
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:text-black"
                                        title="Settings"
                                    >
                                        <FaCog size={18} />
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 h-10 rounded-full bg-gradient-to-r from-black via-slate-900 to-slate-700 px-5 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white shadow-lg"
                                    >
                                        <FaSignOutAlt size={14} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="h-10 rounded-full bg-slate-900 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white shadow-md flex items-center"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Bottom nav row */}
                    <div className="w-full">
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5 rounded-[2.5rem] border border-slate-200 bg-white/65 backdrop-blur-[26px] p-3 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.65)]">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-white/60 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-slate-800 hover:border-slate-900/20 hover:bg-white/90 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className="text-slate-700" />
                                            {link.label}
                                        </div>
                                        <span className="text-slate-400 text-base">&gt;</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default DashboardNavbar;
