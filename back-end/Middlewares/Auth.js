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

    // Optionally, handle role-based access control
    req.isAdmin = decoded.role && decoded.role === 'admin';

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } else {
      // General error for unexpected issues
      return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
    }
  }
};

module.exports = { ensureAuthenticated }; // Export the middleware function
