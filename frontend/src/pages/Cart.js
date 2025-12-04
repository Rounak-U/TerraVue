import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCart({ items: [], totalAmount: 0, currency: 'INR' });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setRemoving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/cart/item/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            alert('Failed to remove item: ' + error.response?.data?.message);
        } finally {
            setRemoving(false);
        }
    };

    const handleUpdateQuantity = async (itemId, field, value) => {
        try {
            const token = localStorage.getItem('token');
            const updateData = {};
            updateData[field] = Math.max(field === 'quantity' ? 1 : 0, value);

            await axios.put(`/api/cart/item/${itemId}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            alert('Failed to update cart: ' + error.response?.data?.message);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('/api/cart/clear', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCart();
            } catch (error) {
                alert('Failed to clear cart: ' + error.response?.data?.message);
            }
        }
    };

    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setProcessingCheckout(true);
        try {
            const token = localStorage.getItem('token');
            
            // Create booking from cart
            const bookingResponse = await axios.post(
                '/api/bookings/create',
                {
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    specialRequests: ''
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Redirect to success page
            navigate('/booking-success', { 
                state: { bookings: bookingResponse.data.bookings }
            });
        } catch (error) {
            alert('Failed to create booking: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessingCheckout(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-2xl font-semibold">Loading cart...</div>
                </div>
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <FaShoppingBag className="text-3xl" />
                    <h1 className="text-4xl font-bold">Shopping Cart</h1>
                </div>

                {isEmpty ? (
                    <div className="text-center py-16">
                        <FaShoppingBag className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8">Start adding tours to your cart!</p>
                        <button
                            onClick={() => navigate('/explore-tours')}
                            className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                        <div className="flex gap-6">
                                            {/* Image */}
                                            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.tour?.image}
                                                    alt={item.tour?.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200?text=' + item.tour?.title;
                                                    }}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{item.tour?.title}</h3>
                                                <p className="text-gray-400 mb-3">{item.tour?.country}</p>

                                                {/* Quantity Controls */}
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400">Tours:</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'quantity', item.quantity - 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'quantity', item.quantity + 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400">Adults:</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'adults', item.adults - 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 text-center">{item.adults}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'adults', item.adults + 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400">Children:</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'children', item.children - 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 text-center">{item.children}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item._id, 'children', item.children + 1)}
                                                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price and Remove */}
                                            <div className="text-right flex flex-col justify-between">
                                                <div>
                                                    <p className="text-2xl font-bold text-green-400">
                                                        ₹{(item.totalPrice || 0).toLocaleString('en-IN')}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        ₹{(item.tour?.price || 0).toLocaleString('en-IN')}/person
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    disabled={removing}
                                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                                                >
                                                    <FaTrash /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleClearCart}
                                className="mt-6 px-4 py-2 bg-red-600/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-600/30 transition"
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Checkout Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg sticky top-20 space-y-6">
                                <h2 className="text-2xl font-bold">Order Summary</h2>

                                <div className="space-y-3 border-b border-white/10 pb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Subtotal:</span>
                                        <span>₹{(cart?.totalAmount || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Taxes (18%):</span>
                                        <span>₹{Math.ceil((cart?.totalAmount || 0) * 0.18).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-green-400">
                                        <span>Total:</span>
                                        <span>₹{Math.ceil((cart?.totalAmount || 0) * 1.18).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processingCheckout || isEmpty}
                                    className="w-full py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
                                </button>

                                <button
                                    onClick={() => navigate('/explore-tours')}
                                    className="w-full py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                                >
                                    Continue Shopping
                                </button>

                                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg text-sm text-blue-300">
                                    <p className="font-semibold mb-2">✓ Secure Checkout</p>
                                    <p>Your payment information is encrypted and secure.</p>
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
