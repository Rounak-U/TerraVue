const Tour = require('../models/Tour');
const { indianSignatureTours } = require('../data/indianSignatureTours');

const ensureSignatureTours = async () => {
    if (!Array.isArray(indianSignatureTours) || indianSignatureTours.length === 0) {
        return;
    }

    try {
        for (const tour of indianSignatureTours) {
            await Tour.findOneAndUpdate(
                { title: tour.title },
                { $set: tour },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        console.log(`✓ Synced ${indianSignatureTours.length} signature India tours`);
    } catch (error) {
        console.error('Failed to sync signature tours', error);
    }
};

module.exports = ensureSignatureTours;
