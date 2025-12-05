import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { FaUser, FaLock, FaMapMarkerAlt, FaShieldAlt, FaTrash, FaCheck, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNotify } from '../context/NotifyContext';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '', lastLogin: '', shippingAddress: '', billingAddress: '' });
    const [loading, setLoading] = useState(true);
    const notify = useNotify();

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/auth/profile');
                setUser(res.data);
                setNewName(res.data.name);
                setNewEmail(res.data.email);
                setShippingAddress(res.data.shippingAddress || '');
                setBillingAddress(res.data.billingAddress || '');
                setLoading(false);
            } catch (err) {
                notify.error('Failed to load profile');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token, notify]);

    const persistProfile = async (successMessage) => {
        try {
            const res = await api.put('/api/auth/profile', {
                name: newName,
                email: newEmail,
                shippingAddress,
                billingAddress
            });
            setUser(res.data);
            notify.success(successMessage);
        } catch (err) {
            notify.error('Unable to update profile right now');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        await persistProfile('Profile details updated');
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        await persistProfile('Addresses updated');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            notify.error('Passwords do not match');
            return;
        }
        try {
            await api.put('/api/auth/change-password', {
                oldPassword,
                newPassword
            });
            notify.success('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            notify.error('Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Delete account permanently? This cannot be undone.')) return;
        try {
            await api.delete('/api/auth/delete-account');
            localStorage.clear();
            notify.success('Account deleted');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (err) {
            notify.error('Failed to delete account');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
                <DashboardNavbar />
                <div className="flex items-center justify-center h-96 text-slate-500 font-semibold">Loading profile...</div>
            </div>
        );
    }

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'password', label: 'Password', icon: FaLock },
        { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
        { id: 'security', label: 'Security', icon: FaShieldAlt }
    ];

    const travelerStats = [
        { label: 'Member Since', value: user.createdAt ? new Date(user.createdAt).getFullYear() : '2025' },
        { label: 'Trips Planned', value: user.journeysPlanned ?? 12 },
        { label: 'Wishlist', value: user.wishlistCount ?? 5 }
    ];

    const formattedLastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
            <DashboardNavbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                <motion.section
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-3xl border border-black/5 bg-white/80 backdrop-blur-xl shadow-[0_45px_120px_-60px_rgba(15,23,42,0.5)] overflow-hidden"
                >
                    <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-black via-slate-900 to-slate-700 text-white text-3xl font-bold flex items-center justify-center">
                                {user.name?.[0] || 'T'}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Account Owner</p>
                                <h1 className="text-3xl font-semibold text-slate-900">{user.name}</h1>
                                <p className="text-slate-500">{user.email}</p>
                                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-emerald-500">
                                    {user.lastLogin ? 'Active traveler' : 'Ready for next journey'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-wrap gap-6 text-center md:justify-end">
                            {travelerStats.map((stat) => (
                                <div key={stat.label} className="min-w-[110px]">
                                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white/85 p-4 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                                    isActive ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </motion.button>
                        );
                    })}
                </div>

                <motion.div
                    key={activeTab}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25 }}
                >
                    {activeTab === 'profile' && (
                        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                            <div className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-8">
                                    <FaUser className="text-black" size={22} />
                                    <h2 className="text-xl font-semibold text-slate-900">Profile Essentials</h2>
                                </div>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="flex flex-col text-sm font-semibold text-slate-600">
                                            Full Name
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                                placeholder="Enter your full name"
                                            />
                                        </label>
                                        <label className="flex flex-col text-sm font-semibold text-slate-600">
                                            Email Address
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                                placeholder="Enter your email"
                                            />
                                        </label>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg"
                                    >
                                        <FaCheck size={16} />
                                        Save Changes
                                    </motion.button>
                                </form>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-3xl border border-black/5 bg-gradient-to-br from-slate-900 to-black p-6 text-white shadow-xl">
                                    <p className="text-xs uppercase tracking-[0.4em] text-white/70">Last Login</p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {formattedLastLogin || 'Not recorded yet'}
                                    </p>
                                    <p className="mt-4 text-xs uppercase tracking-[0.4em] text-white/70">Security Status</p>
                                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                                        All checks clear
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/managedevices')}
                                    className="w-full rounded-3xl border border-dashed border-black/20 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-700 hover:border-black/40"
                                >
                                    <FaEdit className="inline-block mr-2" />
                                    Manage trusted devices
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-8">
                                <FaLock className="text-black" size={22} />
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Secure Access</h2>
                                    <p className="text-sm text-slate-500">Rotate credentials every 90 days for best hygiene</p>
                                </div>
                            </div>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-3">
                                    <label className="flex flex-col text-sm font-semibold text-slate-600">
                                        Current Password
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                            required
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm font-semibold text-slate-600">
                                        New Password
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                            required
                                        />
                                    </label>
                                    <label className="flex flex-col text-sm font-semibold text-slate-600">
                                        Confirm Password
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                            required
                                        />
                                    </label>
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full rounded-full bg-black py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
                                >
                                    Update Password
                                </motion.button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-lg space-y-8">
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-black" size={22} />
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Shipping & Billing</h2>
                                    <p className="text-sm text-slate-500">Keep your drop-off points accurate</p>
                                </div>
                            </div>
                            <form onSubmit={handleAddressUpdate} className="grid gap-6 md:grid-cols-2">
                                <label className="flex flex-col text-sm font-semibold text-slate-600">
                                    Shipping Address
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        rows={5}
                                        className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                        placeholder="Enter your shipping address"
                                    />
                                </label>
                                <label className="flex flex-col text-sm font-semibold text-slate-600">
                                    Billing Address
                                    <textarea
                                        value={billingAddress}
                                        onChange={(e) => setBillingAddress(e.target.value)}
                                        rows={5}
                                        className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-black focus:outline-none"
                                        placeholder="Enter your billing address"
                                    />
                                </label>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="col-span-full rounded-full bg-black py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
                                >
                                    Save Addresses
                                </motion.button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-lg space-y-6">
                                <div className="flex items-center gap-3">
                                    <FaShieldAlt className="text-black" size={22} />
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Security Insights</h2>
                                        <p className="text-sm text-slate-500">Realtime account hygiene</p>
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Last Login</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {formattedLastLogin || 'Not recorded'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Password Updated</p>
                                        <p className="text-lg font-semibold text-slate-900">{user.passwordLastChanged || 'Not recorded'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 p-4">
                                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Two-Factor Status</p>
                                        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
                                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /> Enabled
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={handleDeleteAccount}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white"
                                >
                                    <FaTrash className="inline-block mr-2" />
                                    Delete My Account
                                </motion.button>
                            </div>

                            <div className="rounded-3xl border border-black/5 bg-slate-900 text-white p-8 shadow-2xl space-y-6">
                                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Trust Center</p>
                                <h3 className="text-2xl font-semibold">Protecting your journeys</h3>
                                <p className="text-white/70">
                                    We encrypt every itinerary sync and monitor unusual login patterns in real time.
                                    Activate biometric access on the TerraVue app for instantaneous secure sign-ins.
                                </p>
                                <button
                                    onClick={() => navigate('/support')}
                                    className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white hover:bg-white hover:text-black"
                                >
                                    Contact Security Desk
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
