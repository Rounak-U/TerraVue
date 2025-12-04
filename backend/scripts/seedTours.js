const mongoose = require('mongoose');
const Tour = require('../models/Tour');
require('dotenv').config();

const toursData = [
    {
        title: "Maldives Beach Paradise",
        country: "Maldives",
        category: "Beach",
        days: 5,
        price: 107917,
        oldPrice: 132717,
        currency: "INR",
        description: "Experience pristine beaches, crystal clear waters, and luxury resort stays in the beautiful Maldives.",
        rating: 4.8,
        reviews: 245,
        image: "/images/tours/Maldives.jpeg",
        highlights: ["Private beach access", "Snorkeling in coral reefs", "Water sports activities", "Sunset cruise", "Spa treatments"],
        maxGroupSize: 8,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Swiss Alps Mountain Trek",
        country: "Switzerland",
        category: "Mountain",
        days: 7,
        price: 157717,
        oldPrice: 190717,
        currency: "INR",
        description: "Hike through stunning Alpine landscapes with breathtaking views of snow-capped peaks.",
        rating: 4.9,
        reviews: 312,
        image: "/images/tours/Ladakh.jpg",
        highlights: ["Guided mountain hiking", "Alpine lodge stays", "Scenic cable car rides", "Local cheese tasting", "Photography opportunities"],
        maxGroupSize: 12,
        difficulty: "Hard",
        available: true
    },
    {
        title: "Tokyo City Adventure",
        country: "Japan",
        category: "City",
        days: 4,
        price: 74617,
        oldPrice: 91217,
        currency: "INR",
        description: "Explore the vibrant streets of Tokyo, from ancient temples to modern skyscrapers.",
        rating: 4.7,
        reviews: 198,
        image: "/images/tours/Manali.jpg",
        highlights: ["Temple visits", "Traditional tea ceremony", "Street food tour", "Shibuya crossing experience", "Nightlife exploration"],
        maxGroupSize: 15,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Amazon Rainforest Expedition",
        country: "Peru",
        category: "Adventure",
        days: 6,
        price: 132717,
        oldPrice: 157617,
        currency: "INR",
        description: "Discover the biodiversity of the Amazon with expert naturalists and jungle guides.",
        rating: 4.6,
        reviews: 167,
        image: "/images/tours/Munnar.jpg",
        highlights: ["Jungle trekking", "Wildlife spotting", "River expeditions", "Indigenous village visits", "Bird watching"],
        maxGroupSize: 10,
        difficulty: "Hard",
        available: true
    },
    {
        title: "Egypt Ancient Wonders",
        country: "Egypt",
        category: "Culture",
        days: 5,
        price: 82917,
        oldPrice: 107917,
        currency: "INR",
        description: "Visit the iconic pyramids, temples, and museums of ancient Egypt with expert archaeological guides.",
        rating: 4.8,
        reviews: 289,
        image: "/images/tours/goa.jpg",
        highlights: ["Giza pyramids tour", "Nile river cruise", "Egyptian Museum", "Luxor temple visit", "Local bazaar exploration"],
        maxGroupSize: 20,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Bali Luxury Retreat",
        country: "Indonesia",
        category: "Luxury",
        days: 6,
        price: 149317,
        oldPrice: 182717,
        currency: "INR",
        description: "Indulge in luxury villas, world-class spas, and fine dining in tropical paradise.",
        rating: 4.9,
        reviews: 356,
        image: "/images/tours/bali.jpg",
        highlights: ["Five-star resort stays", "Spa and wellness", "Gourmet dining", "Sunset dinners", "Private beach access"],
        maxGroupSize: 6,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Iceland Glaciers & Geysers",
        country: "Iceland",
        category: "Adventure",
        days: 5,
        price: 124417,
        oldPrice: 149317,
        currency: "INR",
        description: "Experience Iceland's dramatic landscapes with glaciers, waterfalls, and geothermal hot springs.",
        rating: 4.7,
        reviews: 203,
        image: "/images/tours/rajasthan.jpg",
        highlights: ["Glacier hiking", "Waterfall tours", "Blue lagoon visit", "Geothermal springs", "Northern lights (seasonal)"],
        maxGroupSize: 12,
        difficulty: "Moderate",
        available: true
    },
    {
        title: "Caribbean Cruise",
        country: "Caribbean",
        category: "Beach",
        days: 7,
        price: 140917,
        oldPrice: 174117,
        currency: "INR",
        description: "Island hopping adventure across stunning Caribbean destinations with pristine beaches.",
        rating: 4.8,
        reviews: 278,
        image: "/images/tours/dubai.jpg",
        highlights: ["Multiple island visits", "Beach activities", "Water sports", "Local cuisine", "Dance shows"],
        maxGroupSize: 18,
        difficulty: "Easy",
        available: true
    },
    {
        title: "New York Metropolis",
        country: "USA",
        category: "City",
        days: 4,
        price: 66317,
        oldPrice: 82917,
        currency: "INR",
        description: "Explore the world's most iconic city with Broadway shows, museums, and vibrant culture.",
        rating: 4.6,
        reviews: 421,
        image: "/images/tours/newyork.jpg",
        highlights: ["Broadway show", "Empire State Building", "Museum of Modern Art", "Central Park tour", "Times Square experience"],
        maxGroupSize: 20,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Patagonia Adventure",
        country: "Argentina",
        category: "Adventure",
        days: 8,
        price: 165917,
        oldPrice: 207417,
        currency: "INR",
        description: "Trek through pristine wilderness, glaciers, and stunning mountain scenery in Patagonia.",
        rating: 4.9,
        reviews: 145,
        image: "/images/tours/sydney.jpg",
        highlights: ["Perito Moreno Glacier", "Mountain trekking", "Wildlife spotting", "Canyon exploration", "Camping experiences"],
        maxGroupSize: 10,
        difficulty: "Hard",
        available: true
    },
    {
        title: "Paris Romance Escape",
        country: "France",
        category: "Culture",
        days: 4,
        price: 74617,
        oldPrice: 99517,
        currency: "INR",
        description: "Fall in love with Paris - the city of lights, art, and romance.",
        rating: 4.8,
        reviews: 512,
        image: "/images/tours/paris.jpg",
        highlights: ["Eiffel Tower visit", "Louvre Museum", "Seine river cruise", "Cafe culture", "Shopping districts"],
        maxGroupSize: 15,
        difficulty: "Easy",
        available: true
    },
    {
        title: "Morocco Desert Safari",
        country: "Morocco",
        category: "Adventure",
        days: 6,
        price: 99517,
        oldPrice: 124417,
        currency: "INR",
        description: "Experience Sahara Desert with camel treks, traditional Berber villages, and exotic markets.",
        rating: 4.7,
        reviews: 189,
        image: "/images/tours/barcelona.jpg",
        highlights: ["Camel trekking", "Berber village tours", "Desert camping", "Tagine cooking", "Medina exploration"],
        maxGroupSize: 12,
        difficulty: "Moderate",
        available: true
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/terravue');
        console.log('✓ Connected to MongoDB');

        // Clear existing tours
        await Tour.deleteMany({});
        console.log('✓ Cleared existing tours');

        // Insert new tours
        const insertedTours = await Tour.insertMany(toursData);
        console.log(`✓ Successfully inserted ${insertedTours.length} tours`);

        // Display summary
        const stats = await Tour.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📊 Tours by Category:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count}`);
        });

        const totalCount = await Tour.countDocuments();
        console.log(`\n✓ Total tours in database: ${totalCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
