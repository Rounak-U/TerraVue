const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/Cart');
const Tour = require('../models/Tour');
const authMiddleware = require('../middleware/authMiddleware');

// GET user's cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.tour').exec();

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
});

// ADD to cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { tourId, tourTitle, quantity = 1, adults = 1, children = 0, startDate } = req.body;

        if (!tourId && !tourTitle) {
            return res.status(400).json({ message: 'Tour reference is required' });
        }

        if (!startDate) {
            return res.status(400).json({ message: 'Travel date is required' });
        }

        const parsedDate = new Date(startDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Travel date is invalid' });
        }

        let tour;
        if (tourId && mongoose.Types.ObjectId.isValid(tourId)) {
            tour = await Tour.findById(tourId);
        }

        if (!tour && tourId) {
            tour = await Tour.findOne({ title: { $regex: new RegExp(`^${tourId}$`, 'i') } });
        }

        if (!tour && tourTitle) {
            tour = await Tour.findOne({ title: { $regex: new RegExp(`^${tourTitle}$`, 'i') } });
        }

        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const normalizedDate = parsedDate.toISOString();

        const resolvedTourId = tour._id.toString();

        const existingItem = cart.items.find((item) =>
            item.tour.toString() === resolvedTourId &&
            (!item.startDate || new Date(item.startDate).toISOString() === normalizedDate)
        );

        const totalPrice = tour.price * quantity * adults;

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.adults = adults;
            existingItem.children = children;
            existingItem.startDate = parsedDate;
            existingItem.totalPrice = tour.price * existingItem.quantity * adults;
            existingItem.currency = tour.currency || cart.currency;
        } else {
            cart.items.push({
                tour: tour._id,
                quantity,
                adults,
                children,
                startDate: parsedDate,
                totalPrice,
                currency: tour.currency || cart.currency
            });
        }

        await cart.save();
        await cart.populate('items.tour');

        res.status(201).json({ message: 'Tour added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to cart', error: error.message });
    }
});

// UPDATE cart item
router.put('/item/:itemId', authMiddleware, async (req, res) => {
    try {
        const { quantity, adults, children, startDate } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.id(itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const tour = await Tour.findById(cartItem.tour);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        if (quantity !== undefined) cartItem.quantity = Math.max(1, quantity);
        if (adults !== undefined) cartItem.adults = Math.max(1, adults);
        if (children !== undefined) cartItem.children = Math.max(0, children);
        if (startDate) {
            const parsed = new Date(startDate);
            if (Number.isNaN(parsed.getTime())) {
                return res.status(400).json({ message: 'Travel date is invalid' });
            }
            cartItem.startDate = parsed;
        }

        cartItem.totalPrice = tour.price * cartItem.quantity * cartItem.adults;
        cartItem.currency = tour.currency || cartItem.currency;

        await cart.save();
        await cart.populate('items.tour');

        res.json({ message: 'Cart item updated', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart item', error: error.message });
    }
});

// REMOVE from cart
router.delete('/item/:itemId', authMiddleware, async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.id(itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.remove();
        await cart.save();
        await cart.populate('items.tour');

        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
    }
});

// CLEAR cart
router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to clear cart', error: error.message });
    }
});

module.exports = router;
