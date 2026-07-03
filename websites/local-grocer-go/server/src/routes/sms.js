/**
 * SMS Routes
 * Handles SMS verification and messaging
 */

import express from 'express';
import { 
  sendSMS, 
  sendVerificationCode, 
  isTwilioConfigured,
  formatPhoneNumber,
  TwilioServiceError 
} from '../services/twilio.js';

const router = express.Router();

// In-memory storage for verification codes (use Redis in production)
const verificationCodes = new Map();

/**
 * Clean up expired verification codes
 */
function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [phone, data] of verificationCodes.entries()) {
    if (data.expires < now) {
      verificationCodes.delete(phone);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);

// POST /api/v1/sms/send-verification - Send verification code
router.post('/send-verification', async (req, res, next) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        error: 'Phone number required',
        code: 'MISSING_PHONE'
      });
    }
    
    // Check Twilio configuration
    if (!isTwilioConfigured()) {
      return res.status(503).json({
        error: 'SMS service not configured',
        message: 'Twilio credentials not set. SMS functionality is unavailable.',
        code: 'SMS_NOT_CONFIGURED'
      });
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if code was recently sent (rate limiting)
    const existing = verificationCodes.get(formattedPhone);
    if (existing && existing.expires > Date.now() - 55 * 60 * 1000) { // Allow resend after 5 min
      const timeLeft = Math.ceil((existing.expires - (Date.now() - 55 * 60 * 1000)) / 1000 / 60);
      return res.status(429).json({
        error: 'Verification code recently sent',
        message: `Please wait ${timeLeft} minutes before requesting a new code.`,
        code: 'CODE_RECENTLY_SENT',
        retryAfter: timeLeft * 60
      });
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with 10-minute expiry
    verificationCodes.set(formattedPhone, {
      code,
      expires: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    // Send SMS via Twilio
    await sendVerificationCode(formattedPhone, code);
    
    res.json({ 
      success: true, 
      message: 'Verification code sent',
      phone: formattedPhone.replace(/\d(?=\d{4})/g, '*') // Mask phone number
    });
    
  } catch (err) {
    if (err instanceof TwilioServiceError) {
      return res.status(400).json({
        error: err.message,
        code: err.code,
        type: 'twilio_error'
      });
    }
    next(err);
  }
});

// POST /api/v1/sms/verify-code - Verify code
router.post('/verify-code', async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ 
        error: 'Phone and code required',
        code: 'MISSING_FIELDS'
      });
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    const stored = verificationCodes.get(formattedPhone);
    
    if (!stored) {
      return res.status(400).json({ 
        error: 'No verification code found. Please request a new one.',
        code: 'NO_CODE_FOUND'
      });
    }
    
    if (stored.expires < Date.now()) {
      verificationCodes.delete(formattedPhone);
      return res.status(400).json({ 
        error: 'Code expired. Please request a new one.',
        code: 'CODE_EXPIRED'
      });
    }
    
    // Track attempts
    stored.attempts = (stored.attempts || 0) + 1;
    
    // Max 5 attempts
    if (stored.attempts > 5) {
      verificationCodes.delete(formattedPhone);
      return res.status(429).json({
        error: 'Too many failed attempts. Please request a new code.',
        code: 'TOO_MANY_ATTEMPTS'
      });
    }
    
    if (stored.code !== code) {
      const attemptsLeft = 5 - stored.attempts;
      return res.status(400).json({ 
        error: `Invalid code. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
        code: 'INVALID_CODE',
        attemptsLeft
      });
    }
    
    // Clear code after successful verification
    verificationCodes.delete(formattedPhone);
    
    res.json({ 
      success: true, 
      verified: true,
      phone: formattedPhone
    });
    
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/sms/send - Send custom SMS (admin only)
router.post('/send', async (req, res, next) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({
        error: 'Phone and message required',
        code: 'MISSING_FIELDS'
      });
    }
    
    if (!isTwilioConfigured()) {
      return res.status(503).json({
        error: 'SMS service not configured',
        code: 'SMS_NOT_CONFIGURED'
      });
    }
    
    const result = await sendSMS(phone, message);
    
    res.json({
      success: true,
      messageId: result.sid,
      status: result.status
    });
    
  } catch (err) {
    if (err instanceof TwilioServiceError) {
      return res.status(400).json({
        error: err.message,
        code: err.code,
        type: 'twilio_error'
      });
    }
    next(err);
  }
});

// GET /api/v1/sms/status - Check SMS service status
router.get('/status', (req, res) => {
  const { getTwilioStatus, isTwilioConfigured } = require('../services/twilio.js');
  
  const status = getTwilioStatus();
  
  res.json({
    configured: isTwilioConfigured(),
    ...status,
    timestamp: new Date().toISOString()
  });
});

export default router;
