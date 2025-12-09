const mongoose = require('mongoose');
const Tour = require('../models/Tour');
require('dotenv').config();

// Map of tour titles to their image URLs
// Using full URLs that work in production (Vercel will serve from /images/tours/)
const tourImageMap = {
    "Maldives Beach Paradise": "https://terravue.vercel.app/images/tours/Maldives.jpeg",
    "Swiss Alps Mountain Trek": "https://terravue.vercel.app/images/tours/Swiss.jpg",
    "Tokyo City Adventure": "https://terravue.vercel.app/images/tours/Tokyo.jpg",
    "Amazon Rainforest Expedition": "https://terravue.vercel.app/images/tours/Amazon.jpg",
    "Egypt Ancient Wonders": "https://terravue.vercel.app/images/tours/Egypt.jpg",
    "Bali Luxury Retreat": "https://terravue.vercel.app/images/tours/bali.jpg",
    "Iceland Glaciers & Geysers": "https://terravue.vercel.app/images/tours/Iceland.jpg",
    "Caribbean Cruise": "https://terravue.vercel.app/images/tours/Caribbean.jpg",
    "New York Metropolis": "https://terravue.vercel.app/images/tours/newyork.jpg",
    "Patagonia Adventure": "https://terravue.vercel.app/images/tours/Patagonia.jpg",
    "Paris Romance Escape": "https://terravue.vercel.app/images/tours/paris.jpg",
    "Morocco Desert Safari": "https://terravue.vercel.app/images/tours/Morocco.jpg",
    "Kerala Backwater Retreat": "https://terravue.vercel.app/images/tours/Backwaters.jpeg",
    "Rajasthan Palace Circuit": "https://terravue.vercel.app/images/tours/rajasthan.jpg",
    "Ladakh Overland Expedition": "https://terravue.vercel.app/images/tours/Ladakh.jpg",
    "Meghalaya Living Roots Trail": "https://terravue.vercel.app/images/tours/Meghalaya.jpg",
    "Goa Slow Beach Weekender": "https://terravue.vercel.app/images/tours/Goa.jpeg",
    "Varanasi Spiritual Sojourn": "https://terravue.vercel.app/images/tours/Varanasi.jpg",
    "Hampi Heritage Walk": "https://terravue.vercel.app/images/tours/Hampi.jpg",
    "Andaman Island Escape": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "Rishikesh Wellness Retreat": "https://terravue.vercel.app/images/tours/Rishikesh.jpg"
};

const updateTourImages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/terravue');
        console.log('✓ Connected to MongoDB');

        let updatedCount = 0;
        let notFoundCount = 0;

        // Update each tour's image
        for (const [title, imageUrl] of Object.entries(tourImageMap)) {
            const result = await Tour.updateOne(
                { title: title },
                { $set: { image: imageUrl } }
            );

            if (result.matchedCount > 0) {
                console.log(`✓ Updated image for: ${title}`);
                updatedCount++;
            } else {
                console.log(`⚠ Tour not found: ${title}`);
                notFoundCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Updated: ${updatedCount} tours`);
        console.log(`   Not found: ${notFoundCount} tours`);

        // Show all tours with their current images
        const allTours = await Tour.find({}, 'title image');
        console.log(`\n📸 Current tour images:`);
        allTours.forEach(tour => {
            console.log(`   ${tour.title}: ${tour.image}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating tour images:', error.message);
        process.exit(1);
    }
};

updateTourImages();

