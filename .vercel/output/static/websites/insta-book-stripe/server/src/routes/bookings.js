import express from 'express';
import { body, validationResult } from 'express-validator';
import admin from 'firebase-admin';
import { verifyAuth } from '../middleware/auth.js';
import { stripe, redis } from '../index.js';

const router = express.Router();
const db = admin.apps.length ? admin.firestore() : null;

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Calculate booking pricing
router.post('/calculate', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;
    
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get property pricing
    let property;
    if (!db) {
      property = {
        pricing: {
          baseRate: 15000,
          cleaningFee: 7500,
          damageDeposit: 20000,
          weeklyDiscount: 10,
          minNights: 2,
        },
        bookingRules: {
          depositPercent: 50,
          balanceDueDays: 14,
        },
      };
    } else {
      const propertyDoc = await db.collection('properties').doc(propertyId).get();
      if (!propertyDoc.exists) {
        return res.status(404).json({ error: 'Property not found' });
      }
      property = propertyDoc.data();
    }
    
    // Calculate nights
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (nights < (property.pricing.minNights || 1)) {
      return res.status(400).json({ 
        error: `Minimum ${property.pricing.minNights} nights required` 
      });
    }
    
    // Calculate pricing
    let nightlyRate = property.pricing.baseRate;
    let subtotal = nightlyRate * nights;
    
    // Apply weekly discount
    const weeks = Math.floor(nights / 7);
    if (weeks > 0 && property.pricing.weeklyDiscount) {
      const weeklyDiscountAmount = (subtotal * property.pricing.weeklyDiscount) / 100;
      subtotal -= weeklyDiscountAmount;
    }
    
    const cleaningFee = property.pricing.cleaningFee || 0;
    const taxes = Math.round((subtotal + cleaningFee) * 0.08); // 8% tax
    const total = subtotal + cleaningFee + taxes;
    
    const depositPercent = property.bookingRules?.depositPercent || 50;
    const depositAmount = Math.round(total * (depositPercent / 100));
    const balanceAmount = total - depositAmount;
    
    res.json({
      breakdown: {
        nightlyRate,
        nights,
        subtotal,
        cleaningFee,
        taxes,
        total,
      },
      depositAmount,
      balanceAmount,
      balanceDueDate: new Date(startDate.getTime() - (property.bookingRules?.balanceDueDays || 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Calculate pricing error:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

// Create booking inquiry/hold
router.post('/inquiry',
  [
    body('propertyId').notEmpty(),
    body('checkIn').isISO8601(),
    body('checkOut').isISO8601(),
    body('guest.email').isEmail(),
    body('guest.firstName').trim().notEmpty(),
    body('guest.lastName').trim().notEmpty(),
    body('guest.phone').notEmpty(),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { propertyId, checkIn, checkOut, guest, specialRequests } = req.body;
      
      // Calculate pricing
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      // Get property
      let property, ownerId;
      if (!db) {
        property = {
          pricing: { baseRate: 15000, cleaningFee: 7500 },
          bookingRules: { depositPercent: 50 },
          ownerId: 'owner-1',
        };
        ownerId = 'owner-1';
      } else {
        const propertyDoc = await db.collection('properties').doc(propertyId).get();
        if (!propertyDoc.exists) {
          return res.status(404).json({ error: 'Property not found' });
        }
        property = propertyDoc.data();
        ownerId = property.ownerId;
      }
      
      const subtotal = property.pricing.baseRate * nights;
      const total = subtotal + property.pricing.cleaningFee + Math.round((subtotal + property.pricing.cleaningFee) * 0.08);
      const depositPercent = property.bookingRules?.depositPercent || 50;
      const depositAmount = Math.round(total * (depositPercent / 100));
      const balanceAmount = total - depositAmount;
      
      const bookingData = {
        propertyId,
        ownerId,
        guest: {
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phone: guest.phone,
          adults: guest.adults || 2,
          children: guest.children || 0,
          pets: guest.pets || 0,
          specialRequests: specialRequests || '',
        },
        checkIn,
        checkOut,
        nights,
        pricing: {
          nightlyRate: property.pricing.baseRate,
          subtotal,
          cleaningFee: property.pricing.cleaningFee,
          taxes: Math.round((subtotal + property.pricing.cleaningFee) * 0.08),
          total,
          depositAmount,
          balanceAmount,
        },
        payment: {
          deposit: { status: 'pending', amount: depositAmount },
          balance: { status: 'pending', amount: balanceAmount },
          damageHold: { status: 'pending', amount: property.pricing.damageDeposit || 0 },
        },
        status: 'inquiry',
        communications: {
          confirmationSent: false,
          reminder24hSent: false,
          reminder1hSent: false,
          checkInInstructionsSent: false,
        },
        source: 'direct',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      let bookingId;
      if (db) {
        const docRef = await db.collection('bookings').add(bookingData);
        bookingId = docRef.id;
        
        // Temporarily hold dates (15 minutes)
        await redis.setex(`booking-hold:${propertyId}:${checkIn}:${checkOut}`, 900, bookingId);
      } else {
        bookingId = 'booking-' + Date.now();
      }
      
      res.status(201).json({
        id: bookingId,
        ...bookingData,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      console.error('Create inquiry error:', error);
      res.status(500).json({ error: 'Failed to create booking inquiry' });
    }
  }
);

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!db) {
      return res.json({
        id,
        propertyId: 'prop-1',
        ownerId: 'owner-1',
        guest: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          adults: 2,
          children: 0,
        },
        checkIn: '2026-07-15',
        checkOut: '2026-07-20',
        nights: 5,
        pricing: {
          nightlyRate: 15000,
          subtotal: 75000,
          cleaningFee: 7500,
          taxes: 6600,
          total: 89100,
          depositAmount: 44550,
          balanceAmount: 44550,
        },
        payment: {
          deposit: { status: 'held', amount: 44550 },
          balance: { status: 'scheduled', amount: 44550 },
        },
        status: 'confirmed',
        createdAt: new Date(),
      });
    }
    
    const bookingDoc = await db.collection('bookings').doc(id).get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ id: bookingDoc.id, ...bookingDoc.data() });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Get owner's bookings
router.get('/owner/my-bookings', verifyAuth, async (req, res) => {
  try {
    const { status, propertyId, from, to } = req.query;
    
    if (!db) {
      return res.json({
        bookings: [
          {
            id: 'booking-1',
            propertyId: 'prop-1',
            propertyName: 'Cozy Lakehouse Retreat',
            guest: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890',
            },
            checkIn: '2026-07-15',
            checkOut: '2026-07-20',
            nights: 5,
            pricing: { total: 89100 },
            status: 'confirmed',
            createdAt: new Date(),
          },
        ],
      });
    }
    
    let query = db.collection('bookings').where('ownerId', '==', req.user.uid);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (propertyId) {
      query = query.where('propertyId', '==', propertyId);
    }
    
    if (from) {
      query = query.where('checkIn', '>=', from);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    const bookings = await Promise.all(snapshot.docs.map(async (doc) => {
      const booking = { id: doc.id, ...doc.data() };
      // Get property name
      const propertyDoc = await db.collection('properties').doc(booking.propertyId).get();
      if (propertyDoc.exists) {
        booking.propertyName = propertyDoc.data().name;
      }
      return booking;
    }));
    
    res.json({ bookings });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.post('/:id/cancel', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!db) {
      return res.json({
        id,
        status: 'cancelled',
        cancellation: {
          cancelledAt: new Date(),
          reason,
          cancelledBy: 'guest',
        },
      });
    }
    
    const bookingDoc = await db.collection('bookings').doc(id).get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookingDoc.data();
    
    // Verify permission (owner or guest with email token)
    const isOwner = booking.ownerId === req.user.uid;
    // TODO: Verify guest via email token
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Process refund if deposit was paid
    if (booking.payment?.deposit?.status === 'held' && booking.payment.deposit.stripePaymentIntentId) {
      // Calculate refund amount based on cancellation policy
      let refundAmount = booking.pricing.depositAmount;
      const checkInDate = new Date(booking.checkIn);
      const daysUntilCheckIn = Math.ceil((checkInDate - new Date()) / (1000 * 60 * 60 * 24));
      
      // Apply cancellation policy
      const policy = booking.cancellationPolicy || 'moderate';
      if (policy === 'strict' && daysUntilCheckIn < 30) {
        refundAmount = 0;
      } else if (policy === 'moderate' && daysUntilCheckIn < 7) {
        refundAmount = Math.round(refundAmount * 0.5);
      }
      
      if (refundAmount > 0) {
        await stripe.refunds.create({
          payment_intent: booking.payment.deposit.stripePaymentIntentId,
          amount: refundAmount,
        });
      }
    }
    
    await db.collection('bookings').doc(id).update({
      status: 'cancelled',
      cancellation: {
        cancelledAt: new Date(),
        reason,
        refundAmount: booking.pricing.depositAmount,
        cancelledBy: isOwner ? 'owner' : 'guest',
      },
      updatedAt: new Date(),
    });
    
    // Clear availability cache
    const keys = await redis.keys(`availability:${booking.propertyId}:*`);
    if (keys.length) {
      await redis.del(...keys);
    }
    
    res.json({ id, status: 'cancelled' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;