const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');
const Tour = require('../models/Tour');

const basePopulate = {
    path: 'favorites',
    select: 'title country price rating reviews image days category oldPrice createdAt',
};

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate(basePopulate);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch favorites' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { tourId } = req.body;
    if (!tourId) {
        return res.status(400).json({ message: 'tourId is required' });
    }

    try {
        const tourExists = await Tour.exists({ _id: tourId });
        if (!tourExists) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { favorites: tourId } },
            { new: true }
        ).populate(basePopulate);

        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Unable to update favorites' });
    }
});

router.delete('/:tourId', verifyToken, async (req, res) => {
    const { tourId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { favorites: tourId } },
            { new: true }
        ).populate(basePopulate);

        res.json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Unable to remove favorite' });
    }
});

module.exports = router;
