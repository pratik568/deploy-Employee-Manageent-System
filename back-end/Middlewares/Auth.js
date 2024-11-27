const jwt = require('jsonwebtoken'); // Import jwt for token verification

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Retrieve the 'Authorization' header

    // Check if the authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the header

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the JWT secret
        req.user = decoded; // Store the decoded user information in the request object
        // If the decoded token has a 'role' field, you can add admin check
        if (req.user.role && req.user.role === 'admin') {
            req.isAdmin = true; // Mark the request as coming from an admin
        } else {
            req.isAdmin = false; // Regular user
        }

        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }
};

module.exports = { ensureAuthenticated }; // Export the middleware function
