const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE booking from cart
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate, specialRequests } = req.body;

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.tour');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const bookings = [];

        for (const item of cart.items) {
            const booking = new Booking({
                user: req.user.id,
                tour: item.tour._id,
                quantity: item.quantity,
                adults: item.adults,
                children: item.children,
                totalPrice: item.totalPrice,
                currency: 'INR',
                startDate,
                endDate,
                specialRequests: specialRequests || ''
            });

            await booking.save();
            bookings.push(booking);
        }

        // Clear cart after booking
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({ 
            message: 'Bookings created successfully', 
            bookings,
            totalBookings: bookings.length 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

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
