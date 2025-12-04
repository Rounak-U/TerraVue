const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// GET all tours with filters, pagination, and search
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy, search, page = 1, limit = 12 } = req.query;
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Filter by availability
        query.available = true;

        // Sorting
        let sortQuery = {};
        if (sortBy === 'price-low') sortQuery = { price: 1 };
        else if (sortBy === 'price-high') sortQuery = { price: -1 };
        else if (sortBy === 'rating') sortQuery = { rating: -1 };
        else if (sortBy === 'newest') sortQuery = { createdAt: -1 };
        else sortQuery = { createdAt: -1 };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const tours = await Tour.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit));

        const totalTours = await Tour.countDocuments(query);

        res.json({
            tours,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTours / parseInt(limit)),
                totalTours,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tours', error: error.message });
    }
});

// GET tours by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const tours = await Tour.find({
            category,
            available: true
        }).sort({ createdAt: -1 });

        if (tours.length === 0) {
            return res.status(404).json({ message: 'No tours found in this category' });
        }

        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tours', error: error.message });
    }
});

// GET a single tour by title
router.get('/details/:title', async (req, res) => {
    try {
        const tour = await Tour.findOne({
            title: { $regex: new RegExp(`^${req.params.title}$`, 'i') }
        });

        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tour', error: error.message });
    }
});

// GET featured tours
router.get('/featured/all', async (req, res) => {
    try {
        const tours = await Tour.find({
            available: true,
            rating: { $gte: 4.5 }
        })
            .sort({ rating: -1, reviews: -1 })
            .limit(6);

        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch featured tours', error: error.message });
    }
});

// POST - Create a new tour (admin only)
router.post('/', async (req, res) => {
    try {
        const { title, country, category, days, price, oldPrice, currency, description, rating, reviews, image, highlights, maxGroupSize, difficulty } = req.body;

        // Validate required fields
        if (!title || !country || !category || !days || !price || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newTour = new Tour({
            title,
            country,
            category,
            days,
            price,
            oldPrice: oldPrice || price,
            currency: currency || 'USD',
            description,
            rating: rating || 4.5,
            reviews: reviews || 0,
            image,
            highlights: highlights || [],
            maxGroupSize: maxGroupSize || 10,
            difficulty: difficulty || 'Moderate',
            available: true
        });

        const savedTour = await newTour.save();
        res.status(201).json({ message: 'Tour created successfully', tour: savedTour });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create tour', error: error.message });
    }
});

// PUT - Update a tour
router.put('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json({ message: 'Tour updated successfully', tour });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update tour', error: error.message });
    }
});

// DELETE a tour
router.delete('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json({ message: 'Tour deleted successfully', tour });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tour', error: error.message });
    }
});

// GET tour statistics
router.get('/stats/all', async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    avgRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
    }
});

// DELETE - Delete a tour
router.delete('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json({ message: 'Tour deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tour', error: error.message });
    }
});

module.exports = router;
