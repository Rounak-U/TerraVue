import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaEye } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (location.state?.bookings) {
            setBookings(location.state.bookings);
        } else {
            // Redirect if no bookings in state
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Success Icon */}
                    <div className="mb-8">
                        <div className="inline-block bg-green-500/20 p-6 rounded-full border border-green-500/40">
                            <FaCheckCircle className="text-6xl text-green-400" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Your tour booking has been confirmed. Check your email for confirmation details.
                    </p>

                    {/* Booking Details */}
                    {bookings.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8 text-left">
                            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

                            <div className="space-y-4">
                                {bookings.map((booking, idx) => (
                                    <div key={booking._id} className="bg-white/5 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-sm text-gray-400">Booking {idx + 1}</p>
                                                <p className="text-lg font-bold">{booking.tour?.title}</p>
                                            </div>
                                            <span className="text-green-400 font-bold">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Reference</p>
                                                <p className="font-mono font-bold text-blue-400">{booking.bookingReference}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Status</p>
                                                <p className="font-bold capitalize text-yellow-400">{booking.status}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Travelers</p>
                                                <p className="font-bold">{booking.adults} Adults, {booking.children} Children</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Start Date</p>
                                                <p className="font-bold">{new Date(booking.startDate).toLocaleDateString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <p className="text-3xl font-bold text-green-400">{bookings.length}</p>
                            <p className="text-gray-400">Tour(s) Booked</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <p className="text-3xl font-bold text-blue-400">
                                ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-gray-400">Total Amount</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                            <p className="text-3xl font-bold text-purple-400">
                                {bookings.reduce((sum, b) => sum + b.adults, 0)}
                            </p>
                            <p className="text-gray-400">Total Travelers</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
                        >
                            <FaHome /> Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/explore-tours')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-bold hover:bg-white/20 transition"
                        >
                            <FaEye /> Browse More Tours
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="mt-12 bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg text-left">
                        <h3 className="font-bold mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-sm text-blue-200">
                            <li>✓ Check your email for booking confirmation</li>
                            <li>✓ Download your travel itinerary</li>
                            <li>✓ Review your booking details in Dashboard</li>
                            <li>✓ Contact our support team for any changes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
