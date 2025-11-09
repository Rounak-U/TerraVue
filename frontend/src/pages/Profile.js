import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '', lastLogin: '', shippingAddress: '', billingAddress: '' });
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const token = localStorage.getItem('token');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setNewName(res.data.name);
                setNewEmail(res.data.email);
                setShippingAddress(res.data.shippingAddress || '');
                setBillingAddress(res.data.billingAddress || '');
                setLoading(false);
            } catch (err) {
                toast.error('Failed to load profile');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', {
                name: newName,
                email: newEmail,
                shippingAddress,
                billingAddress
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            await axios.put('http://localhost:5000/api/auth/change-password', {
                oldPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error('Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        try {
            await axios.delete('http://localhost:5000/api/auth/delete-account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            toast.success('Account deleted');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (err) {
            toast.error('Failed to delete account');
        }
    };

    if (loading) return <div className="dashboard-loading">Loading profile...</div>;

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">My Account</h2>

            <div className="dashboard-tabs">
                <button onClick={() => setActiveTab('profile')} className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}>Profile Info</button>
                <button onClick={() => setActiveTab('password')} className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}>Change Password</button>
                <button onClick={() => setActiveTab('addresses')} className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}>Addresses</button>
                <button onClick={() => setActiveTab('security')} className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}>Security</button>
            </div>

            {activeTab === 'profile' && (
                <div className="dashboard-card">
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleProfileUpdate} className="dashboard-form">
                        <label>Name</label>
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <label>Email</label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <button type="submit">Update Profile</button>
                    </form>
                </div>
            )}

            {activeTab === 'password' && (
                <div className="dashboard-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword} className="dashboard-form">
                        <label>Old Password</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <label>Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type="submit">Change Password</button>
                    </form>
                </div>
            )}

            {activeTab === 'addresses' && (
                <div className="dashboard-card">
                    <h3>Shipping & Billing Address</h3>
                    <form onSubmit={handleProfileUpdate} className="dashboard-form">
                        <label>Shipping Address</label>
                        <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                        <label>Billing Address</label>
                        <input type="text" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
                        <button type="submit">Save Addresses</button>
                    </form>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="dashboard-card">
                    <h3>Security Info</h3>
                    <p><strong>Last Login:</strong> {user.lastLogin || 'N/A'}</p>
                    <p><strong>Password Last Changed:</strong> {user.passwordLastChanged || 'N/A'}</p>
                    <button className="danger-button" onClick={handleDeleteAccount}>Delete My Account</button>
                </div>
            )}

        </div>
    );
};

export default Profile;
