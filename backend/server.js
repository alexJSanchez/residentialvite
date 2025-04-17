const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the data/images directory
app.use('/images', express.static(path.join(__dirname, 'data/images')));

// Import routes (we'll create these next)
const residentialRoutes = require('./routes/residentials');

// Use routes
app.use('/api/residentials', residentialRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Residential API' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 