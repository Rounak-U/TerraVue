import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaHome, FaPlane, FaHeadset, FaSignOutAlt, FaCog, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

function DashboardNavbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

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
        { label: 'Support', path: '/support-center', icon: FaHeadset }
    ];

    const travelerLocation = user?.location || 'Mumbai, IN';

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-[0_12px_45px_-24px_rgba(15,23,42,0.35)]">
            <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-10">
                <div
                    className="flex items-center gap-4 py-4 flex-nowrap overflow-x-auto"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3 pr-6 border-r border-black/5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-black via-slate-900 to-slate-700 flex items-center justify-center text-white font-semibold">
                            T
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-black font-semibold text-lg">TerraVue</span>
                            <span className="text-[0.55rem] uppercase tracking-[0.45em] text-slate-500">
                                Journeys
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/70">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center gap-2 h-10 px-4 rounded-full text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-slate-700 border border-transparent hover:border-slate-900/30 hover:bg-white transition"
                                >
                                    <Icon size={16} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Location */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-600">
                            <FaMapMarkerAlt size={12} />
                            {travelerLocation}
                        </div>
                    )}

                    {/* User Actions */}
                    <div className="flex items-center gap-3 ml-auto">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-white px-4">
                                    <span className="text-sm font-semibold text-slate-900">{user.name}</span>
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
                                    className="flex items-center gap-2 h-10 rounded-full bg-gradient-to-r from-black via-slate-900 to-slate-700 px-5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white shadow-lg"
                                >
                                    <FaSignOutAlt size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="h-10 rounded-full bg-slate-900 px-6 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white shadow-md flex items-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default DashboardNavbar;
