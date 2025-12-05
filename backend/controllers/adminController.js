const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';
const ADMIN_SESSION_TTL = process.env.ADMIN_SESSION_TTL || '4h';

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const tokenPayload = {
            role: 'admin',
            email: admin.email,
            adminId: admin._id,
        };

        const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: ADMIN_SESSION_TTL });

        return res.json({
            success: true,
            admin: { email: admin.email, name: admin.name },
            accessToken,
            expiresIn: ADMIN_SESSION_TTL,
        });
    } catch (err) {
        console.error('Admin login failed', err);
        return res.status(500).json({ message: 'Unable to sign in right now' });
    }
};
