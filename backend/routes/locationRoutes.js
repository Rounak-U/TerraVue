const express = require('express');

const router = express.Router();

router.post('/reverse', async (req, res) => {
    const { latitude, longitude } = req.body || {};

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    try {
        const params = new URLSearchParams({
            format: 'json',
            lat: latitude.toString(),
            lon: longitude.toString(),
            zoom: '10',
            addressdetails: '1',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
            headers: {
                'User-Agent': 'TerraVue/1.0 (support@terravue.app)',
            },
        });

        if (!response.ok) {
            throw new Error(`Reverse geocoding failed with status ${response.status}`);
        }

        const payload = await response.json();
        const address = payload.address || {};
        const locality = address.city || address.town || address.village || address.county || address.state;
        const country = (address.country_code && address.country_code.toUpperCase()) || address.country;
        const location = [locality, country].filter(Boolean).join(', ') || payload.display_name || 'Unknown location';

        return res.json({
            location,
            coordinates: {
                latitude,
                longitude,
            },
        });
    } catch (error) {
        console.error('Reverse geocoding error:', error.message);
        return res.status(500).json({ message: 'Unable to resolve location at this time.' });
    }
});

module.exports = router;
