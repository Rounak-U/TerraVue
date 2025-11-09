const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// GET all tours
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tours' });
    }
});

// ✅ GET a single tour by title
router.get('/:title', async (req, res) => {

    const all = await Tour.find();

    const tour = await Tour.findOne({
        title: { $regex: new RegExp(`^${req.params.title}$`, 'i') }
    });

    if (!tour) {
        return res.status(404).json({ message: 'Tour not found' });
    }

    res.json(tour);
});


module.exports = router;
