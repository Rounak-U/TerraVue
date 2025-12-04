const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "myrefreshsecret123";

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create access (short-lived) and refresh (long-lived) tokens
        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Persist refresh token with user
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Invalid refresh token" });

        // Check the refresh token exists in DB for this user
        if (!user.refreshTokens || !user.refreshTokens.includes(token)) {
            return res.status(401).json({ message: "Refresh token not recognized" });
        }

        const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

// POST /api/auth/logout
exports.logoutUser = async (req, res) => {
    const { token } = req.body; // refresh token
    if (!token) return res.status(400).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ message: "Invalid token" });

        user.refreshTokens = (user.refreshTokens || []).filter(t => t !== token);
        await user.save();

        res.json({ success: true, message: "Logged out" });
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
