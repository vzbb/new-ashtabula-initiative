import express from 'express';
import { body, param, validationResult } from 'express-validator';
import admin from 'firebase-admin';
import { verifyAuth, requireOwner } from '../middleware/auth.js';
import { redis } from '../index.js';

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

// Get all public properties
router.get('/', async (req, res) => {
  try {
    const { city, guests, checkIn, checkOut } = req.query;
    
    if (!db) {
      // Return mock data for development
      return res.json({
        properties: [
          {
            id: 'prop-1',
            name: 'Cozy Lakehouse Retreat',
            slug: 'cozy-lakehouse-retreat',
            description: 'Beautiful lakefront property with stunning views',
            type: 'house',
            location: {
              address: '123 Lakeview Dr',
              city: 'Geneva-on-the-Lake',
              state: 'OH',
              zip: '44041',
            },
            photos: [
              { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', caption: 'Lake view', order: 0 },
            ],
            amenities: ['wifi', 'kitchen', 'ac', 'parking', 'lake_access'],
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            pricing: {
              baseRate: 15000, // $150/night in cents
              cleaningFee: 7500, // $75
              minNights: 2,
            },
            publicSettings: { isActive: true },
          },
        ],
        total: 1,
      });
    }
    
    let query = db.collection('properties')
      .where('publicSettings.isActive', '==', true);
    
    if (city) {
      query = query.where('location.city', '==', city);
    }
    
    if (guests) {
      query = query.where('maxGuests', '>=', parseInt(guests));
    }
    
    const snapshot = await query.get();
    
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    res.json({ properties, total: properties.length });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!db) {
      return res.json({
        id: 'prop-1',
        name: 'Cozy Lakehouse Retreat',
        slug: 'cozy-lakehouse-retreat',
        description: 'Beautiful lakefront property with stunning views of Lake Erie. Perfect for family getaways with plenty of outdoor activities nearby.',
        type: 'house',
        location: {
          address: '123 Lakeview Dr',
          city: 'Geneva-on-the-Lake',
          state: 'OH',
          zip: '44041',
          lat: 41.8598,
          lng: -80.9554,
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', caption: 'Lake view', order: 0 },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', caption: 'Living room', order: 1 },
          { url: 'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=800', caption: 'Kitchen', order: 2 },
        ],
        amenities: ['wifi', 'kitchen', 'ac', 'parking', 'lake_access', 'bbq', 'fireplace'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        pricing: {
          baseRate: 15000,
          cleaningFee: 7500,
          damageDeposit: 20000,
          minNights: 2,
          maxNights: 14,
          weeklyDiscount: 10,
        },
        bookingRules: {
          checkInTime: '15:00',
          checkOutTime: '11:00',
          advanceBookingDays: 365,
          instantBook: true,
          cancellationPolicy: 'moderate',
          depositPercent: 50,
          balanceDueDays: 14,
        },
        houseRules: ['No smoking', 'No parties', 'Quiet hours 10pm-8am'],
        publicSettings: { isActive: true },
        ownerId: 'owner-1',
      });
    }
    
    const snapshot = await db.collection('properties')
      .where('slug', '==', slug)
      .where('publicSettings.isActive', '==', true)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const property = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Get property availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.query; // YYYY-MM format
    
    // Check Redis cache first
    const cacheKey = `availability:${id}:${month || 'current'}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    if (!db) {
      // Return mock availability
      const daysInMonth = 31;
      const availability = Array(daysInMonth).fill(1).map((_, i) => {
        // Randomly block some dates
        return Math.random() > 0.3 ? 1 : 0;
      });
      
      const result = {
        propertyId: id,
        month: month || '2026-07',
        days: availability,
        bookedDates: availability.map((a, i) => a === 0 ? `${month || '2026-07'}-${String(i + 1).padStart(2, '0')}` : null).filter(Boolean),
      };
      
      // Cache for 1 hour
      await redis.setex(cacheKey, 3600, JSON.stringify(result));
      return res.json(result);
    }
    
    // Get property to check blocked dates
    const propertyDoc = await db.collection('properties').doc(id).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const property = propertyDoc.data();
    const blockedDates = property.availability?.blockedDates || [];
    
    // Get bookings for this month
    const [year, monthNum] = (month || new Date().toISOString().slice(0, 7)).split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0);
    
    const bookingsSnapshot = await db.collection('bookings')
      .where('propertyId', '==', id)
      .where('status', 'in', ['confirmed', 'deposit_paid'])
      .where('checkIn', '<=', endOfMonth.toISOString().split('T')[0])
      .where('checkOut', '>=', startOfMonth.toISOString().split('T')[0])
      .get();
    
    const bookedDates = new Set();
    
    bookingsSnapshot.docs.forEach(doc => {
      const booking = doc.data();
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        bookedDates.add(d.toISOString().split('T')[0]);
      }
    });
    
    // Add blocked dates
    blockedDates.forEach(date => bookedDates.add(date));
    
    // Build availability array
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const availability = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      availability.push(bookedDates.has(dateStr) ? 0 : 1);
    }
    
    const result = {
      propertyId: id,
      month: month || `${year}-${String(monthNum).padStart(2, '0')}`,
      days: availability,
      bookedDates: Array.from(bookedDates),
    };
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    
    res.json(result);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Create new property (owner only)
router.post('/',
  verifyAuth,
  requireOwner,
  [
    body('name').trim().notEmpty().withMessage('Property name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('type').isIn(['cottage', 'house', 'condo', 'apartment', 'room']).withMessage('Invalid property type'),
    body('location.address').trim().notEmpty().withMessage('Address is required'),
    body('location.city').trim().notEmpty().withMessage('City is required'),
    body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
    body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be 0 or more'),
    body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be 0 or more'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const propertyData = {
        ...req.body,
        ownerId: req.user.uid,
        slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        photos: req.body.photos || [],
        amenities: req.body.amenities || [],
        availability: {
          blockedDates: [],
          defaultAvailability: 'available',
          externalCalendars: [],
        },
        publicSettings: {
          isActive: false, // Requires approval
          ...req.body.publicSettings,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (!db) {
        return res.status(201).json({
          id: 'prop-new-' + Date.now(),
          ...propertyData,
        });
      }
      
      const docRef = await db.collection('properties').add(propertyData);
      
      // Add property to owner's properties array
      await db.collection('users').doc(req.user.uid).update({
        properties: admin.firestore.FieldValue.arrayUnion(docRef.id),
      });
      
      res.status(201).json({ id: docRef.id, ...propertyData });
    } catch (error) {
      console.error('Create property error:', error);
      res.status(500).json({ error: 'Failed to create property' });
    }
  }
);

// Update property (owner only)
router.patch('/:id', verifyAuth, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };
    
    delete updates.id;
    delete updates.ownerId; // Can't change owner
    
    if (!db) {
      return res.json({ id, ...updates });
    }
    
    // Verify ownership
    const propertyDoc = await db.collection('properties').doc(id).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (propertyDoc.data().ownerId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden - Not property owner' });
    }
    
    await db.collection('properties').doc(id).update(updates);
    
    // Clear availability cache
    const keys = await redis.keys(`availability:${id}:*`);
    if (keys.length) {
      await redis.del(...keys);
    }
    
    const updatedDoc = await db.collection('properties').doc(id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Get owner's properties
router.get('/owner/my-properties', verifyAuth, requireOwner, async (req, res) => {
  try {
    if (!db) {
      return res.json({
        properties: [
          {
            id: 'prop-1',
            name: 'Cozy Lakehouse Retreat',
            slug: 'cozy-lakehouse-retreat',
            type: 'house',
            location: { city: 'Geneva-on-the-Lake', state: 'OH' },
            maxGuests: 6,
            pricing: { baseRate: 15000 },
            publicSettings: { isActive: true },
            createdAt: new Date(),
          },
        ],
      });
    }
    
    const snapshot = await db.collection('properties')
      .where('ownerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    res.json({ properties });
  } catch (error) {
    console.error('Get owner properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

export default router;