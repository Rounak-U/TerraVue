require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const supportRoutes = require('./routes/supportRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ensureSignatureTours = require('./utils/ensureSignatureTours');
const ensureAdminAccount = require('./utils/ensureAdminAccount');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);
// Serve static files from the React frontend build
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));

// For any other route, serve index.html (for React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await Promise.all([
            ensureAdminAccount(),
            ensureSignatureTours(),
        ]);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to establish a database connection. Server not started.', err);
        process.exit(1);
    }
};

startServer();
