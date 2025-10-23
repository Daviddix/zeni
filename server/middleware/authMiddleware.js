const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase authentication token
 * Attaches decoded user info to req.user
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authentication token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token using Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      // Add any custom claims if you've set them
      admin: decodedToken.admin || false
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please sign in again.' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Authentication failed' 
    });
  }
};

/**
 * Middleware to check if user has admin privileges
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required' 
    });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
