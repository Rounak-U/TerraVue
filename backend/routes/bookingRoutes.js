const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware');

const buildEndDate = (startDate, durationDays) => {
    if (!startDate) return null;
    const base = new Date(startDate);
    base.setDate(base.getDate() + Math.max(1, durationDays || 1));
    return base;
};

const handleCheckout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { paymentMethod = 'card', paymentProvider = 'TerraPay', specialRequests, simulateFailure = false } = req.body || {};

        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.tour')
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const bookings = [];

        for (const item of cart.items) {
            const travelStart = item.startDate || req.body.startDate;
            if (!travelStart) {
                throw new Error('Each cart item must include a travel date');
            }

            const parsedStart = new Date(travelStart);
            if (Number.isNaN(parsedStart.getTime())) {
                throw new Error('Travel date is invalid');
            }

            const booking = new Booking({
                user: req.user.id,
                tour: item.tour._id,
                quantity: item.quantity,
                adults: item.adults,
                children: item.children,
                totalPrice: item.totalPrice,
                currency: item.currency || cart.currency || 'INR',
                startDate: parsedStart,
                endDate: buildEndDate(parsedStart, item.tour?.days || 1),
                specialRequests: specialRequests || '',
                status: 'pending',
                paymentStatus: 'pending'
            });

            await booking.save({ session });
            bookings.push(booking);
        }

        if (simulateFailure) {
            throw new Error('Payment authorization failed — transaction rolled back');
        }

        const taxAmount = Math.round(cart.totalAmount * 0.18);
        const paymentReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payment = {
            reference: paymentReference,
            method: paymentMethod,
            provider: paymentProvider,
            subtotal: cart.totalAmount,
            taxAmount,
            amount: cart.totalAmount + taxAmount,
            currency: cart.currency,
            status: 'paid'
        };

        for (const booking of bookings) {
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            await booking.save({ session });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save({ session });

        await session.commitTransaction();
        await Booking.populate(bookings, 'tour');

        res.status(201).json({
            message: 'Checkout completed successfully',
            bookings,
            payment
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message || 'Failed to complete checkout' });
    } finally {
        session.endSession();
    }
};

// CREATE booking from cart with transactional payment simulation
router.post('/checkout', authMiddleware, handleCheckout);
router.post('/create', authMiddleware, handleCheckout);

// GET all user bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('tour')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// GET booking details
router.get('/:bookingId', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate('tour');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
    }
});

// CANCEL booking
router.put('/:bookingId/cancel', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel completed booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
    }
});

// UPDATE booking
router.put('/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate, adults, children, specialRequests } = req.body;
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot modify completed booking' });
        }

        if (startDate) booking.startDate = startDate;
        if (endDate) booking.endDate = endDate;
        if (adults) booking.adults = adults;
        if (children !== undefined) booking.children = children;
        if (specialRequests) booking.specialRequests = specialRequests;

        const tour = await Tour.findById(booking.tour);
        booking.totalPrice = tour.price * booking.quantity * booking.adults;

        await booking.save();

        res.json({ message: 'Booking updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update booking', error: error.message });
    }
});

module.exports = router;
