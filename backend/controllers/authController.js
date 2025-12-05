const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "myrefreshsecret123";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const buildTokens = (userId) => ({
    accessToken: jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
});

const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    lastLogin: user.lastLogin
});

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, authProvider: 'local' });
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

        if (!user.password) {
            return res.status(400).json({ message: "Please continue with Google Sign-In for this account." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = buildTokens(user._id);

        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(refreshToken);
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            user: publicUser(user),
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.googleSignIn = async (req, res) => {
    if (!googleClient) {
        return res.status(500).json({ message: "Google authentication is not configured" });
    }

    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: "Missing Google credential" });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const googleId = payload?.sub;
        const email = payload?.email;

        if (!googleId || !email) {
            return res.status(400).json({ message: "Unable to verify Google account" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name: payload.name || 'Traveler',
                email,
                authProvider: 'google',
                googleId,
                avatar: payload.picture
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
            }
            if (!user.password) {
                user.authProvider = 'google';
            }
            if (payload.picture && !user.avatar) {
                user.avatar = payload.picture;
            }
        }

        user.lastLogin = new Date();

        const { accessToken, refreshToken } = buildTokens(user._id);
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({
            success: true,
            user: publicUser(user),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Google sign-in failed', error);
        res.status(401).json({ message: "Invalid Google credentials" });
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
