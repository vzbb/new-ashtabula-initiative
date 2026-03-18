import admin from 'firebase-admin';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!admin.apps.length) {
      // Development mode - mock user
      req.user = {
        uid: 'dev-user-123',
        email: 'dev@example.com',
        email_verified: true,
      };
      return next();
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export const requireOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user from Firestore to check role
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'Forbidden - User not found' });
    }
    
    const userData = userDoc.data();
    req.userData = userData;
    
    if (userData.role !== 'owner' && userData.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Owner access required' });
    }
    
    next();
  } catch (error) {
    console.error('Owner check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};