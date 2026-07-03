/**
 * Local Grocer Go - API Health Check Module
 * Provides endpoints for monitoring external API status
 */

import express from 'express';
import stripe from 'stripe';
import twilio from 'twilio';

const router = express.Router();

/**
 * Check Stripe API status
 */
async function checkStripeStatus() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return {
        status: 'not_configured',
        message: 'STRIPE_SECRET_KEY not set'
      };
    }

    const stripeClient = stripe(stripeKey);
    
    // Try to retrieve balance as a simple API test
    await stripeClient.balance.retrieve();
    
    return {
      status: 'ok',
      message: 'Stripe API connection successful',
      keyPrefix: stripeKey.substring(0, 8) + '...'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      code: error.code
    };
  }
}

/**
 * Check Twilio API status
 */
async function checkTwilioStatus() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      return {
        status: 'not_configured',
        message: 'TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set'
      };
    }

    const client = twilio(accountSid, authToken);
    
    // Try to fetch account info as a simple API test
    await client.api.accounts(accountSid).fetch();
    
    return {
      status: 'ok',
      message: 'Twilio API connection successful',
      accountSid: accountSid.substring(0, 12) + '...'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      code: error.code
    };
  }
}

/**
 * Check Database status
 */
async function checkDatabaseStatus(pool) {
  try {
    await pool.query('SELECT NOW()');
    return {
      status: 'ok',
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

// GET /api/v1/health - Overall health check
router.get('/', async (req, res) => {
  const pool = req.app.get('db');
  
  const [stripeStatus, twilioStatus, dbStatus] = await Promise.allSettled([
    checkStripeStatus(),
    checkTwilioStatus(),
    pool ? checkDatabaseStatus(pool) : Promise.resolve({ status: 'not_configured' })
  ]);

  const results = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      stripe: stripeStatus.status === 'fulfilled' ? stripeStatus.value : { status: 'error', message: stripeStatus.reason?.message },
      twilio: twilioStatus.status === 'fulfilled' ? twilioStatus.value : { status: 'error', message: twilioStatus.reason?.message },
      database: dbStatus.status === 'fulfilled' ? dbStatus.value : { status: 'error', message: dbStatus.reason?.message }
    }
  };

  // Overall status is degraded if any critical service is down
  const criticalServices = ['stripe', 'twilio'];
  const hasErrors = criticalServices.some(
    svc => results.services[svc]?.status === 'error' || results.services[svc]?.status === 'not_configured'
  );
  
  if (hasErrors) {
    results.status = 'degraded';
  }

  res.status(hasErrors ? 503 : 200).json(results);
});

// GET /api/v1/health/:service - Specific service check
router.get('/:service', async (req, res) => {
  const { service } = req.params;
  const pool = req.app.get('db');
  
  let result;
  switch (service) {
    case 'stripe':
      result = await checkStripeStatus();
      break;
    case 'twilio':
      result = await checkTwilioStatus();
      break;
    case 'database':
      result = pool ? await checkDatabaseStatus(pool) : { status: 'not_configured' };
      break;
    default:
      return res.status(404).json({ error: 'Unknown service' });
  }
  
  res.status(result.status === 'ok' ? 200 : 503).json(result);
});

export default router;
