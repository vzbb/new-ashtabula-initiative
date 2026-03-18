import express from 'express';
import admin from 'firebase-admin';
import { verifyAuth, requireOwner } from '../middleware/auth.js';
import { stripe } from '../index.js';

const router = express.Router();
const db = admin.apps.length ? admin.firestore() : null;

// Create Stripe Connect onboarding link
router.post('/connect/onboard', verifyAuth, requireOwner, async (req, res) => {
  try {
    const { refreshUrl, returnUrl } = req.body;
    
    let userData;
    if (!db) {
      userData = { stripeAccountId: null };
    } else {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      userData = userDoc.data();
    }
    
    let accountId = userData.stripeAccountId;
    
    // Create account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: {
              interval: 'daily',
            },
          },
        },
      });
      
      accountId = account.id;
      
      if (db) {
        await db.collection('users').doc(req.user.uid).update({
          stripeAccountId: accountId,
          stripeAccountStatus: 'pending',
          updatedAt: new Date(),
        });
      }
    }
    
    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || `${process.env.CLIENT_URL}/owner/stripe/onboarding?error=refresh`,
      return_url: returnUrl || `${process.env.CLIENT_URL}/owner/stripe/onboarding?success=true`,
      type: 'account_onboarding',
    });
    
    res.json({
      url: accountLink.url,
      accountId,
    });
  } catch (error) {
    console.error('Connect onboard error:', error);
    res.status(500).json({ error: 'Failed to create onboarding link' });
  }
});

// Check Stripe Connect account status
router.get('/connect/status', verifyAuth, requireOwner, async (req, res) => {
  try {
    let userData;
    if (!db) {
      return res.json({
        connected: false,
        status: 'pending',
        requirements: {
          currently_due: ['external_account', 'business_profile.url'],
        },
      });
    }
    
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    userData = userDoc.data();
    
    if (!userData.stripeAccountId) {
      return res.json({
        connected: false,
        status: 'not_started',
      });
    }
    
    const account = await stripe.accounts.retrieve(userData.stripeAccountId);
    
    // Update status in database
    let status = 'pending';
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active';
    } else if (account.requirements.disabled_reason) {
      status = 'restricted';
    }
    
    await db.collection('users').doc(req.user.uid).update({
      stripeAccountStatus: status,
      updatedAt: new Date(),
    });
    
    res.json({
      connected: account.charges_enabled && account.payouts_enabled,
      status,
      requirements: account.requirements,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (error) {
    console.error('Connect status error:', error);
    res.status(500).json({ error: 'Failed to check account status' });
  }
});

// Create payment intent for deposit
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Missing bookingId or amount' });
    }
    
    // Get booking and property info
    let booking, property;
    if (!db) {
      booking = {
        propertyId: 'prop-1',
        ownerId: 'owner-1',
        guest: { email: 'guest@example.com' },
        pricing: { depositAmount: amount },
      };
      property = { ownerId: 'owner-1' };
    } else {
      const bookingDoc = await db.collection('bookings').doc(bookingId).get();
      if (!bookingDoc.exists) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      booking = bookingDoc.data();
      
      const propertyDoc = await db.collection('properties').doc(booking.propertyId).get();
      property = propertyDoc.data();
    }
    
    // Get owner's Stripe account
    let ownerStripeAccountId;
    if (db) {
      const ownerDoc = await db.collection('users').doc(booking.ownerId).get();
      ownerStripeAccountId = ownerDoc.data()?.stripeAccountId;
    }
    
    // Calculate platform fee (0.5%)
    const platformFee = Math.round(amount * 0.005);
    
    const paymentIntentData = {
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId,
        type: 'deposit',
        propertyId: booking.propertyId,
      },
      receipt_email: booking.guest.email,
      application_fee_amount: platformFee,
    };
    
    // If owner has Connect account, transfer to them
    if (ownerStripeAccountId) {
      paymentIntentData.transfer_data = {
        destination: ownerStripeAccountId,
      };
    }
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Stripe webhook handler
router.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  console.log('Stripe webhook received:', event.type);
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
        
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
        
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
  const { bookingId, type } = paymentIntent.metadata;
  
  if (!bookingId || !db) return;
  
  const bookingRef = db.collection('bookings').doc(bookingId);
  const bookingDoc = await bookingRef.get();
  
  if (!bookingDoc.exists) return;
  
  const update = {
    updatedAt: new Date(),
  };
  
  if (type === 'deposit') {
    update['payment.deposit'] = {
      status: 'held',
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      chargedAt: new Date(),
    };
    update.status = 'deposit_paid';
    
    // Schedule balance payment
    const booking = bookingDoc.data();
    const checkInDate = new Date(booking.checkIn);
    const balanceDueDate = new Date(checkInDate.getTime() - (booking.bookingRules?.balanceDueDays || 14) * 24 * 60 * 60 * 1000);
    
    update['payment.balance.scheduledChargeAt'] = balanceDueDate;
  } else if (type === 'balance') {
    update['payment.balance'] = {
      status: 'charged',
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      chargedAt: new Date(),
    };
    update.status = 'confirmed';
  }
  
  await bookingRef.update(update);
  
  // Send confirmation email (placeholder)
  console.log(`Payment succeeded for booking ${bookingId}`);
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent) {
  const { bookingId, type } = paymentIntent.metadata;
  
  if (!bookingId || !db) return;
  
  const update = {
    updatedAt: new Date(),
  };
  
  if (type === 'deposit') {
    update['payment.deposit.status'] = 'failed';
    update.status = 'pending_deposit';
  } else if (type === 'balance') {
    update['payment.balance.status'] = 'failed';
  }
  
  await db.collection('bookings').doc(bookingId).update(update);
}

// Handle refund
async function handleChargeRefunded(charge) {
  const paymentIntentId = charge.payment_intent;
  
  if (!db || !paymentIntentId) return;
  
  // Find booking with this payment intent
  const bookingsSnapshot = await db.collection('bookings')
    .where('payment.deposit.stripePaymentIntentId', '==', paymentIntentId)
    .get();
  
  bookingsSnapshot.docs.forEach(async (doc) => {
    await doc.ref.update({
      'payment.deposit.status': 'refunded',
      updatedAt: new Date(),
    });
  });
}

// Handle Connect account update
async function handleAccountUpdated(account) {
  if (!db) return;
  
  // Find user with this Stripe account
  const usersSnapshot = await db.collection('users')
    .where('stripeAccountId', '==', account.id)
    .get();
  
  let status = 'pending';
  if (account.charges_enabled && account.payouts_enabled) {
    status = 'active';
  } else if (account.requirements.disabled_reason) {
    status = 'restricted';
  }
  
  usersSnapshot.docs.forEach(async (doc) => {
    await doc.ref.update({
      stripeAccountStatus: status,
      updatedAt: new Date(),
    });
  });
}

export default router;