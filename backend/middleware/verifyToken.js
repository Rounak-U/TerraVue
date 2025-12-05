const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey123";

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded || {};
        if (!req.user.role) {
            req.user.role = 'user';
        }
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

function verifyAdmin(req, res, next) {
    return verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    });
}

module.exports = verifyToken;
module.exports.verifyAdmin = verifyAdmin;
