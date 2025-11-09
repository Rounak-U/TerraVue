require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // fixed relative path
const tourRoutes = require('./routes/tourRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>
    console.log('Connected to MongoDB'))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/auth', profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
