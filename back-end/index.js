const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/auth', AuthRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
