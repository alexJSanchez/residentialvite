const express = require('express');
const router = express.Router();
const residentialData = require('../data/residentials');

// Get all residentials
router.get('/', (req, res) => {
    try {
        console.log('Getting all residentials');
        res.json(residentialData);
    } catch (error) {
        console.error('Error getting residentials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search residentials
router.get('/search', (req, res) => {
    try {
        const { query } = req.query;
        console.log('Searching residentials with query:', query);

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const results = residentialData.filter(property => {
            const searchStr = query.toLowerCase();
            return (
                property.Address.toLowerCase().includes(searchStr) ||
                property.Super.toLowerCase().includes(searchStr)
            );
        });

        console.log(`Found ${results.length} matching residentials`);
        res.json(results);
    } catch (error) {
        console.error('Error searching residentials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get residential by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log('Getting residential with ID:', id);

        const property = residentialData.find(p => p.id === id);

        if (!property) {
            console.log('Property not found for ID:', id);
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json(property);
    } catch (error) {
        console.error('Error getting residential by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 