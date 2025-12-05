const express = require('express');
const router = express.Router();
const tokenGuard = require('../middleware/verifyToken');
const verifyToken = tokenGuard;
const verifyAdmin = tokenGuard.verifyAdmin;
const SupportTicket = require('../models/SupportTicket');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { subject, category, priority, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const initialMessage = { sender: 'user', body: message, user: req.user.id };
        const ticket = await SupportTicket.create({
            user: req.user.id,
            subject,
            category,
            priority,
            message,
            messages: [initialMessage],
            lastResponseAt: Date.now(),
            lastRespondedBy: 'user',
            lastResponderUser: req.user.id,
        });

        res.status(201).json({ ticket });
    } catch (err) {
        res.status(500).json({ message: 'Unable to submit request' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user.id })
            .sort({ updatedAt: -1 })
            .populate('messages.admin', 'name email')
            .populate('messages.user', 'name email');
        res.json({ tickets });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch tickets' });
    }
});

router.get('/admin/overview', verifyAdmin, async (_req, res) => {
    try {
        const [total, open, awaitingReply, highPriority] = await Promise.all([
            SupportTicket.countDocuments(),
            SupportTicket.countDocuments({ status: { $ne: 'Resolved' } }),
            SupportTicket.countDocuments({ lastRespondedBy: { $ne: 'admin' } }),
            SupportTicket.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } }),
        ]);

        res.json({
            stats: {
                total,
                open,
                awaitingReply,
                highPriority,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch overview data' });
    }
});

router.get('/admin/tickets', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const filters = {};
        if (status && status !== 'All') {
            filters.status = status;
        }

        const tickets = await SupportTicket.find(filters)
            .populate('user', 'name email')
            .populate('messages.admin', 'name email')
            .populate('messages.user', 'name email')
            .sort({ updatedAt: -1 });

        res.json({ tickets });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch tickets' });
    }
});

router.get('/admin/tickets/:ticketId', verifyAdmin, async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.ticketId)
            .populate('user', 'name email')
            .populate('messages.admin', 'name email')
            .populate('messages.user', 'name email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ ticket });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch ticket' });
    }
});

router.post('/admin/tickets/:ticketId/reply', verifyAdmin, async (req, res) => {
    try {
        const { message, status, resolutionNotes } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const ticket = await SupportTicket.findById(req.params.ticketId).populate('user', 'name email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.messages = ticket.messages || [];
        ticket.messages.push({ sender: 'admin', body: message, admin: req.user.adminId });
        ticket.lastResponseAt = Date.now();
        ticket.lastRespondedBy = 'admin';
        ticket.lastResponderAdmin = req.user.adminId;
        ticket.lastResponderUser = undefined;

        if (status) {
            ticket.status = status;
        }
        if (resolutionNotes) {
            ticket.resolutionNotes = resolutionNotes;
        }

        await ticket.save();
        await ticket.populate([
            { path: 'messages.admin', select: 'name email' },
            { path: 'messages.user', select: 'name email' },
        ]);
        res.json({ ticket });
    } catch (err) {
        res.status(500).json({ message: 'Unable to post reply' });
    }
});

module.exports = router;
