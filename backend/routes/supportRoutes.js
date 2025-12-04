const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const SupportTicket = require('../models/SupportTicket');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { subject, category, priority, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const ticket = await SupportTicket.create({
            user: req.user.id,
            subject,
            category,
            priority,
            message,
        });

        res.status(201).json({ ticket });
    } catch (err) {
        res.status(500).json({ message: 'Unable to submit request' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ tickets });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch tickets' });
    }
});

module.exports = router;
