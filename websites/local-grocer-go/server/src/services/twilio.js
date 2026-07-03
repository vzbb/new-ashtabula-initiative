/**
 * Twilio Service Module
 * Handles all SMS and voice operations with comprehensive error handling
 */

import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Custom error class for Twilio errors
export class TwilioServiceError extends Error {
  constructor(message, code, twilioError = null) {
    super(message);
    this.name = 'TwilioServiceError';
    this.type = 'TwilioError';
    this.code = code;
    this.twilioError = twilioError;
  }
}

// Initialize Twilio client
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new TwilioServiceError(
      'Twilio credentials not configured. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.',
      'CONFIG_ERROR'
    );
  }
  
  return twilio(accountSid, authToken);
}

/**
 * Validate phone number format
 */
function validatePhoneNumber(phone) {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  
  // Basic E.164 validation
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(phone)) {
    return { 
      valid: false, 
      error: 'Invalid phone number format. Must be E.164 format (e.g., +1234567890)' 
    };
  }
  
  return { valid: true };
}

/**
 * Format phone number to E.164
 */
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add US country code if not present
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return `+${cleaned}`;
}

/**
 * Send SMS message
 */
export async function sendSMS(to, body) {
  try {
    // Validate inputs
    if (!body) {
      throw new TwilioServiceError(
        'Message body is required',
        'VALIDATION_ERROR'
      );
    }
    
    if (body.length > 1600) {
      throw new TwilioServiceError(
        'Message body too long. Maximum 1600 characters.',
        'VALIDATION_ERROR'
      );
    }
    
    const formattedPhone = formatPhoneNumber(to);
    const validation = validatePhoneNumber(formattedPhone);
    
    if (!validation.valid) {
      throw new TwilioServiceError(
        validation.error,
        'VALIDATION_ERROR'
      );
    }
    
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      throw new TwilioServiceError(
        'TWILIO_PHONE_NUMBER not configured',
        'CONFIG_ERROR'
      );
    }
    
    const client = getTwilioClient();
    
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: formattedPhone,
      statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL
    });
    
    console.log(`[Twilio] SMS sent: ${message.sid} to ${formattedPhone}`);
    
    return {
      sid: message.sid,
      status: message.status,
      to: message.to,
      body: message.body,
      dateCreated: message.dateCreated
    };
    
  } catch (err) {
    if (err instanceof TwilioServiceError) {
      throw err;
    }
    
    // Handle specific Twilio errors
    if (err.code === 21211) {
      throw new TwilioServiceError(
        'Invalid phone number',
        'INVALID_NUMBER',
        err
      );
    }
    
    if (err.code === 21608) {
      throw new TwilioServiceError(
        'This number is not verified. For trial accounts, only verified numbers can receive messages.',
        'UNVERIFIED_NUMBER',
        err
      );
    }
    
    if (err.code === 21610) {
      throw new TwilioServiceError(
        'This recipient has opted out and cannot receive messages.',
        'OPTED_OUT',
        err
      );
    }
    
    if (err.code === 21408) {
      throw new TwilioServiceError(
        'SMS not enabled for this region.',
        'REGION_NOT_ENABLED',
        err
      );
    }
    
    console.error('Twilio SMS error:', err);
    throw new TwilioServiceError(
      'Failed to send SMS message',
      'SEND_ERROR',
      err
    );
  }
}

/**
 * Send order confirmation SMS
 */
export async function sendOrderConfirmation(phone, orderCode, pickupDetails) {
  const message = `Your Local Grocer Go order ${orderCode} is confirmed! 🛒\n\nPickup: ${pickupDetails}\n\nReply STOP to cancel SMS notifications.`;
  
  return sendSMS(phone, message);
}

/**
 * Send order ready SMS
 */
export async function sendOrderReady(phone, orderCode, storeName) {
  const message = `Great news! Your order ${orderCode} from ${storeName} is ready for pickup. 🎉\n\nPlease come to the curbside pickup area.`;
  
  return sendSMS(phone, message);
}

/**
 * Send order cancelled SMS
 */
export async function sendOrderCancelled(phone, orderCode, reason = '') {
  let message = `Your order ${orderCode} has been cancelled.`;
  if (reason) {
    message += ` Reason: ${reason}`;
  }
  message += '\n\nIf you have questions, please contact the store.';
  
  return sendSMS(phone, message);
}

/**
 * Send verification code SMS
 */
export async function sendVerificationCode(phone, code) {
  const message = `Your Local Grocer Go verification code is: ${code}\n\nThis code is valid for 10 minutes. Do not share this code with anyone.`;
  
  return sendSMS(phone, message);
}

/**
 * Make a voice call
 */
export async function makeCall(to, twimlUrl) {
  try {
    const formattedPhone = formatPhoneNumber(to);
    const validation = validatePhoneNumber(formattedPhone);
    
    if (!validation.valid) {
      throw new TwilioServiceError(
        validation.error,
        'VALIDATION_ERROR'
      );
    }
    
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      throw new TwilioServiceError(
        'TWILIO_PHONE_NUMBER not configured',
        'CONFIG_ERROR'
      );
    }
    
    if (!twimlUrl) {
      throw new TwilioServiceError(
        'TwiML URL is required',
        'VALIDATION_ERROR'
      );
    }
    
    const client = getTwilioClient();
    
    const call = await client.calls.create({
      url: twimlUrl,
      to: formattedPhone,
      from: fromNumber
    });
    
    console.log(`[Twilio] Call initiated: ${call.sid} to ${formattedPhone}`);
    
    return {
      sid: call.sid,
      status: call.status,
      to: call.to,
      dateCreated: call.dateCreated
    };
    
  } catch (err) {
    if (err instanceof TwilioServiceError) {
      throw err;
    }
    
    console.error('Twilio call error:', err);
    throw new TwilioServiceError(
      'Failed to initiate call',
      'CALL_ERROR',
      err
    );
  }
}

/**
 * Lookup phone number information
 */
export async function lookupPhoneNumber(phone) {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const validation = validatePhoneNumber(formattedPhone);
    
    if (!validation.valid) {
      throw new TwilioServiceError(
        validation.error,
        'VALIDATION_ERROR'
      );
    }
    
    const client = getTwilioClient();
    
    const lookup = await client.lookups.v2.phoneNumbers(formattedPhone).fetch();
    
    return {
      phoneNumber: lookup.phoneNumber,
      nationalFormat: lookup.nationalFormat,
      countryCode: lookup.countryCode,
      carrier: lookup.carrier,
      valid: lookup.valid
    };
    
  } catch (err) {
    if (err instanceof TwilioServiceError) {
      throw err;
    }
    
    console.error('Twilio lookup error:', err);
    throw new TwilioServiceError(
      'Failed to lookup phone number',
      'LOOKUP_ERROR',
      err
    );
  }
}

/**
 * Get Twilio configuration status
 */
export function getTwilioStatus() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  return {
    configured: !!(accountSid && authToken),
    hasPhoneNumber: !!phoneNumber,
    accountSidPrefix: accountSid ? accountSid.substring(0, 12) + '...' : null,
    phoneNumber: phoneNumber || null
  };
}

/**
 * Check if Twilio is properly configured
 */
export function isTwilioConfigured() {
  return !!(process.env.TWILIO_ACCOUNT_SID && 
            process.env.TWILIO_AUTH_TOKEN && 
            process.env.TWILIO_PHONE_NUMBER);
}
