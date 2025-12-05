const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const tokenGuard = require('../middleware/verifyToken');
const verifyAdmin = tokenGuard.verifyAdmin;

router.post('/login', loginAdmin);

router.get('/session', verifyAdmin, (req, res) => {
    res.json({ success: true, admin: { email: req.user.email || 'admin' } });
});

module.exports = router;
