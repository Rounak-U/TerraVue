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

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://terravue.vercel.app',
            'http://localhost:3000',
            'http://localhost:3001'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now, but you can restrict this
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // For any other route, serve index.html (for React Router)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

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
