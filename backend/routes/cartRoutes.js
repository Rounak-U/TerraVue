const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Tour = require('../models/Tour');
const authMiddleware = require('../middleware/authMiddleware');

// GET user's cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.tour')
            .exec();

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
        const { tourId, quantity = 1, adults = 1, children = 0 } = req.body;

        if (!tourId) {
            return res.status(400).json({ message: 'Tour ID is required' });
        }

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if tour already in cart
        const existingItem = cart.items.find(item => item.tour.toString() === tourId);

        const totalPrice = tour.price * quantity * adults;

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.adults = adults;
            existingItem.children = children;
            existingItem.totalPrice = tour.price * existingItem.quantity * adults;
        } else {
            cart.items.push({
                tour: tourId,
                quantity,
                adults,
                children,
                totalPrice
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
        const { quantity, adults, children } = req.body;
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
        
        if (quantity) cartItem.quantity = quantity;
        if (adults) cartItem.adults = adults;
        if (children !== undefined) cartItem.children = children;

        cartItem.totalPrice = tour.price * (quantity || cartItem.quantity) * (adults || cartItem.adults);

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

        cart.items.id(itemId).remove();
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
