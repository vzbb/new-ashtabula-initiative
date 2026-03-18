/**
 * Stripe Service Module
 * Handles all Stripe payment operations with comprehensive error handling
 */

import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Custom error class for Stripe errors
export class StripeServiceError extends Error {
  constructor(message, code, stripeError = null) {
    super(message);
    this.name = 'StripeServiceError';
    this.type = 'StripeError';
    this.code = code;
    this.stripeError = stripeError;
  }
}

// Initialize Stripe client
function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new StripeServiceError(
      'Stripe secret key not configured',
      'CONFIG_ERROR'
    );
  }
  return stripe(key);
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(amountCents, metadata = {}) {
  try {
    const stripeClient = getStripeClient();
    
    // Validate amount
    if (!amountCents || amountCents < 50) { // Minimum 50 cents
      throw new StripeServiceError(
        'Invalid amount. Minimum charge is $0.50',
        'VALIDATION_ERROR'
      );
    }
    
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...metadata,
        created_at: new Date().toISOString()
      }
    });
    
    return paymentIntent;
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    
    // Handle Stripe-specific errors
    if (err.type === 'StripeCardError') {
      throw new StripeServiceError(
        err.message,
        'CARD_ERROR',
        err
      );
    }
    
    if (err.type === 'StripeRateLimitError') {
      throw new StripeServiceError(
        'Too many requests. Please try again.',
        'RATE_LIMIT',
        err
      );
    }
    
    if (err.type === 'StripeInvalidRequestError') {
      throw new StripeServiceError(
        'Invalid payment request.',
        'INVALID_REQUEST',
        err
      );
    }
    
    console.error('Stripe error:', err);
    throw new StripeServiceError(
      'Payment processing failed. Please try again.',
      'UNKNOWN_ERROR',
      err
    );
  }
}

/**
 * Retrieve a payment intent
 */
export async function retrievePaymentIntent(paymentIntentId) {
  try {
    if (!paymentIntentId) {
      throw new StripeServiceError(
        'Payment intent ID required',
        'VALIDATION_ERROR'
      );
    }
    
    const stripeClient = getStripeClient();
    return await stripeClient.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    console.error('Stripe retrieve error:', err);
    throw new StripeServiceError(
      'Failed to retrieve payment information',
      'RETRIEVE_ERROR',
      err
    );
  }
}

/**
 * Get client secret for a payment intent
 */
export async function getPaymentIntentClientSecret(paymentIntentId) {
  try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    return paymentIntent.client_secret;
  } catch (err) {
    throw err;
  }
}

/**
 * Create a refund
 */
export async function createRefund(paymentIntentId, amount = null) {
  try {
    if (!paymentIntentId) {
      throw new StripeServiceError(
        'Payment intent ID required for refund',
        'VALIDATION_ERROR'
      );
    }
    
    const stripeClient = getStripeClient();
    const params = { payment_intent: paymentIntentId };
    
    if (amount) {
      if (amount < 50) {
        throw new StripeServiceError(
          'Refund amount too small',
          'VALIDATION_ERROR'
        );
      }
      params.amount = amount;
    }
    
    return await stripeClient.refunds.create(params);
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    console.error('Stripe refund error:', err);
    throw new StripeServiceError(
      'Refund processing failed',
      'REFUND_ERROR',
      err
    );
  }
}

/**
 * Create a Stripe Connect account for store onboarding
 */
export async function createConnectAccount(email, businessName) {
  try {
    if (!email || !businessName) {
      throw new StripeServiceError(
        'Email and business name required',
        'VALIDATION_ERROR'
      );
    }
    
    const stripeClient = getStripeClient();
    
    const account = await stripeClient.accounts.create({
      type: 'express',
      email,
      business_profile: {
        name: businessName
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });
    
    return account;
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    console.error('Stripe Connect error:', err);
    throw new StripeServiceError(
      'Failed to create Connect account',
      'CONNECT_ERROR',
      err
    );
  }
}

/**
 * Create an account link for onboarding
 */
export async function createAccountLink(accountId, refreshUrl, returnUrl) {
  try {
    if (!accountId || !refreshUrl || !returnUrl) {
      throw new StripeServiceError(
        'Account ID, refresh URL, and return URL required',
        'VALIDATION_ERROR'
      );
    }
    
    const stripeClient = getStripeClient();
    
    const accountLink = await stripeClient.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding'
    });
    
    return accountLink;
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    console.error('Stripe account link error:', err);
    throw new StripeServiceError(
      'Failed to create onboarding link',
      'LINK_ERROR',
      err
    );
  }
}

/**
 * Create a transfer to a connected account
 */
export async function createTransfer(amountCents, destinationAccountId, metadata = {}) {
  try {
    if (!amountCents || !destinationAccountId) {
      throw new StripeServiceError(
        'Amount and destination account required',
        'VALIDATION_ERROR'
      );
    }
    
    const stripeClient = getStripeClient();
    
    const transfer = await stripeClient.transfers.create({
      amount: amountCents,
      currency: 'usd',
      destination: destinationAccountId,
      metadata
    });
    
    return transfer;
  } catch (err) {
    if (err instanceof StripeServiceError) {
      throw err;
    }
    console.error('Stripe transfer error:', err);
    throw new StripeServiceError(
      'Failed to process transfer',
      'TRANSFER_ERROR',
      err
    );
  }
}

/**
 * Get Stripe configuration status
 */
export function getStripeStatus() {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  return {
    configured: !!key,
    hasWebhookSecret: !!webhookSecret,
    keyPrefix: key ? key.substring(0, 8) + '...' : null,
    mode: key?.startsWith('sk_live') ? 'live' : key?.startsWith('sk_test') ? 'test' : 'unknown'
  };
}
