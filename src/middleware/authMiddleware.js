const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env.config');

/**
 * Middleware to authenticate the JWT token.
 * Decodes the token and attaches the user's ID and role to the request object.
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the token

    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(403).json({ error: 'Invalid token payload' });
    }

    // Attach decoded payload to the request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('❌ Invalid token:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to authorize roles.
 * Ensures the user has one of the allowed roles.
 */
exports.authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Extract role from the decoded JWT

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }

    next();
  };
};