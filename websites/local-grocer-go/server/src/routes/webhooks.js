import express from 'express';
import stripe from 'stripe';
import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// POST /webhooks/stripe - Handle Stripe webhooks
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Update order payment status
        await pool.query(`
          UPDATE orders 
          SET status = 'confirmed', updated_at = NOW()
          WHERE stripe_payment_intent_id = $1
        `, [paymentIntent.id]);
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Cancel order on payment failure
        await pool.query(`
          UPDATE orders 
          SET status = 'cancelled', cancelled_reason = 'Payment failed', updated_at = NOW()
          WHERE stripe_payment_intent_id = $1
        `, [paymentIntent.id]);
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

// POST /webhooks/twilio - Handle Twilio webhooks
router.post('/twilio', async (req, res, next) => {
  try {
    const { MessageSid, From, Body, MessageStatus } = req.body;
    
    console.log('Twilio webhook:', { MessageSid, From, Body, MessageStatus });
    
    // Handle STOP requests
    if (Body?.toUpperCase().includes('STOP')) {
      // Opt-out logic here
      console.log(`Opt-out request from ${From}`);
    }
    
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  } catch (err) {
    next(err);
  }
});

export default router;
