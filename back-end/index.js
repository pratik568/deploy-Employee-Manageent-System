const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
require('dotenv').config();
require('./Models/db');  // MongoDB connection setup

const PORT = process.env.PORT || 8080;

// Enhanced CORS setup
app.use(cors({
    origin: ['http://localhost:3000', 'https://deploy-employee-manageent-system-6z34.vercel.app'],  // Add your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // Allows cookies and Authorization headers
}));

// Handle preflight requests explicitly
app.options('*', cors(), (req, res) => {
    res.sendStatus(200);
});

// Middleware setup
app.use(bodyParser.json());

// Health check endpoint
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/auth', AuthRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack
    res.status(err.status || 500).json({ 
        success: false,
        message: err.message || 'Internal Server Error' 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
