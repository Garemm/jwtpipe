const jwt = require('jsonwebtoken');

// Must match the secret used to sign tokens in auth.controller.js.
// Reads from the JWT_SECRET environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware: verifyToken
 *
 * Expects the request to carry a Bearer token in the Authorization header:
 *   Authorization: Bearer <token>
 *
 * On success — attaches the decoded payload to req.user and calls next().
 * On failure — responds with 401 Unauthorized.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Header must be present and start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token signature and expiry
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded payload (userId, email) to the request object
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // Token is expired, tampered with, or otherwise invalid
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { verifyToken };
