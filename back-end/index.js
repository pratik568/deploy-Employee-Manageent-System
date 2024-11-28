const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
require('dotenv').config();
require('./Models/db');  // MongoDB connection setup

const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(bodyParser.json());

// Enhanced CORS setup
app.use(cors({
    origin: ['http://localhost:3000', 'https://deploy-employee-manageent-system-i3zf.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Include OPTIONS method
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
    credentials: true  // Allows cookies and Authorization headers
}));

// Handle preflight requests explicitly
app.options('*', cors());  // Respond to all preflight requests

// Health check endpoint
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/auth', AuthRouter);  // All routes defined in AuthRouter.js

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

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
