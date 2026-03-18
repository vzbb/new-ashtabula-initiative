import express from 'express';
import admin from 'firebase-admin';
import { verifyAuth, requireOwner } from '../middleware/auth.js';

const router = express.Router();
const db = admin.apps.length ? admin.firestore() : null;

// Get user dashboard stats
router.get('/dashboard-stats', verifyAuth, requireOwner, async (req, res) => {
  try {
    if (!db) {
      return res.json({
        totalRevenue: 450000, // $4,500 in cents
        totalBookings: 12,
        occupancyRate: 68,
        upcomingBookings: 3,
        recentBookings: [
          {
            id: 'booking-1',
            guestName: 'John Doe',
            propertyName: 'Cozy Lakehouse Retreat',
            checkIn: '2026-07-15',
            checkOut: '2026-07-20',
            amount: 89100,
            status: 'confirmed',
          },
        ],
      });
    }
    
    // Get owner's properties
    const propertiesSnapshot = await db.collection('properties')
      .where('ownerId', '==', req.user.uid)
      .get();
    
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    if (propertyIds.length === 0) {
      return res.json({
        totalRevenue: 0,
        totalBookings: 0,
        occupancyRate: 0,
        upcomingBookings: 0,
        recentBookings: [],
      });
    }
    
    // Get bookings for these properties
    const bookingsSnapshot = await db.collection('bookings')
      .where('propertyId', 'in', propertyIds)
      .where('status', 'in', ['confirmed', 'completed', 'deposit_paid'])
      .get();
    
    const bookings = bookingsSnapshot.docs.map(doc => doc.data());
    
    // Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    const totalBookings = bookings.length;
    
    // Upcoming bookings (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      return checkIn >= new Date() && checkIn <= thirtyDaysFromNow;
    }).length;
    
    // Calculate occupancy rate (simplified)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    
    let occupiedDays = 0;
    bookings.forEach(b => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      
      if (checkIn <= endOfMonth && checkOut >= startOfMonth) {
        const start = checkIn > startOfMonth ? checkIn : startOfMonth;
        const end = checkOut < endOfMonth ? checkOut : endOfMonth;
        occupiedDays += Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      }
    });
    
    const occupancyRate = Math.round((occupiedDays / (daysInMonth * propertyIds.length)) * 100);
    
    // Recent bookings
    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(b => ({
        id: bookingsSnapshot.docs.find(d => d.data() === b)?.id,
        guestName: `${b.guest.firstName} ${b.guest.lastName}`,
        propertyName: propertiesSnapshot.docs.find(p => p.id === b.propertyId)?.data().name,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        amount: b.pricing.total,
        status: b.status,
      }));
    
    res.json({
      totalRevenue,
      totalBookings,
      occupancyRate: Math.min(occupancyRate, 100),
      upcomingBookings,
      recentBookings,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get earnings/payouts
router.get('/earnings', verifyAuth, requireOwner, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    if (!db) {
      return res.json({
        totalEarnings: 450000,
        pendingPayouts: 89100,
        completedPayouts: 360900,
        platformFees: 2250, // 0.5%
        earningsByMonth: [
          { month: '2026-01', earnings: 150000, bookings: 4 },
          { month: '2026-02', earnings: 300000, bookings: 8 },
        ],
      });
    }
    
    // Get completed bookings
    const propertiesSnapshot = await db.collection('properties')
      .where('ownerId', '==', req.user.uid)
      .get();
    
    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
    
    if (propertyIds.length === 0) {
      return res.json({
        totalEarnings: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
        platformFees: 0,
        earningsByMonth: [],
      });
    }
    
    const bookingsSnapshot = await db.collection('bookings')
      .where('propertyId', 'in', propertyIds)
      .where('status', 'in', ['confirmed', 'completed'])
      .get();
    
    const bookings = bookingsSnapshot.docs.map(doc => doc.data());
    
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
    const platformFees = Math.round(totalEarnings * 0.005);
    
    // Group by month
    const earningsByMonth = {};
    bookings.forEach(b => {
      const month = b.checkIn.substring(0, 7);
      if (!earningsByMonth[month]) {
        earningsByMonth[month] = { month, earnings: 0, bookings: 0 };
      }
      earningsByMonth[month].earnings += b.pricing.total;
      earningsByMonth[month].bookings += 1;
    });
    
    res.json({
      totalEarnings,
      pendingPayouts: 0, // Would calculate from pending transfers
      completedPayouts: totalEarnings - platformFees,
      platformFees,
      earningsByMonth: Object.values(earningsByMonth).sort((a, b) => b.month.localeCompare(a.month)),
    });
  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

export default router;