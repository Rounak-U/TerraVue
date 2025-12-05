const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/Cart');
const Booking = require('../models/Booking');
const verifyToken = require('../middleware/verifyToken');
const bcrypt = require('bcryptjs');

// ✅ GET: Get profile info
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// ✅ PUT: Update profile info (name, email)
router.put('/profile', verifyToken, async (req, res) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// ✅ PUT: Change password
router.put('/change-password', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password' });
    }
});

// ✅ DELETE: Remove account and related data
router.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userExists = await User.exists({ _id: userId });

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Promise.all([
            User.findByIdAndDelete(userId),
            Cart.deleteMany({ user: userId }),
            Booking.deleteMany({ user: userId })
        ]);

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete account failed', err);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

module.exports = router;
