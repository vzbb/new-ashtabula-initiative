import express from 'express';
import admin from 'firebase-admin';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();
const db = admin.apps.length ? admin.firestore() : null;

// Get current user profile
router.get('/me', verifyAuth, async (req, res) => {
  try {
    if (!db) {
      return res.json({
        id: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || 'Test User',
        role: 'owner',
        subscription: {
          tier: 'pro',
          status: 'active',
        },
      });
    }
    
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      const newUser = {
        id: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.email?.split('@')[0] || 'User',
        role: 'guest',
        subscription: {
          tier: 'basic',
          status: 'trialing',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          notificationPreferences: {
            email: true,
            sms: false,
            bookingConfirmations: true,
            paymentNotifications: true,
          },
        },
        properties: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await db.collection('users').doc(req.user.uid).set(newUser);
      return res.json(newUser);
    }
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.patch('/me', verifyAuth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.id; // Don't allow ID change
    delete updates.role; // Don't allow role change via this endpoint
    
    updates.updatedAt = new Date();
    
    if (!db) {
      return res.json({ id: req.user.uid, ...updates });
    }
    
    await db.collection('users').doc(req.user.uid).update(updates);
    
    const updatedDoc = await db.collection('users').doc(req.user.uid).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Register new user (called after Firebase Auth signup)
router.post('/register', verifyAuth, async (req, res) => {
  try {
    const { displayName, phone, role = 'guest' } = req.body;
    
    const userData = {
      id: req.user.uid,
      email: req.user.email,
      displayName: displayName || req.user.email?.split('@')[0] || 'User',
      phone: phone || null,
      role,
      stripeAccountId: null,
      stripeAccountStatus: 'pending',
      subscription: {
        tier: 'basic',
        status: 'trialing',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        currentPeriodEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        notificationPreferences: {
          email: true,
          sms: false,
          bookingConfirmations: true,
          paymentNotifications: true,
        },
      },
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (db) {
      await db.collection('users').doc(req.user.uid).set(userData);
    }
    
    res.status(201).json(userData);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

export default router;