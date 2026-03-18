import express from 'express';
import pool from '../db/index.js';
import { sendOrderConfirmation, sendOrderCancelled } from '../services/twilio.js';
import { 
  createPaymentIntent, 
  getPaymentIntentClientSecret,
  StripeServiceError 
} from '../services/stripe.js';

const router = express.Router();

// Generate short order code
function generateOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GG-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/v1/orders - Get orders by phone
router.get('/', async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    const { rows } = await pool.query(`
      SELECT o.*, s.name as store_name, s.street, s.city
      FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE o.customer_phone = $1
      ORDER BY o.created_at DESC
    `, [phone]);
    
    res.json({ orders: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/:id - Get order by ID or code
router.get('/:id', async (req, res, next) => {
  try {
    let query, params;
    
    if (req.params.id.startsWith('GG-')) {
      query = 'SELECT * FROM orders WHERE order_code = $1';
      params = [req.params.id];
    } else {
      query = 'SELECT * FROM orders WHERE id = $1';
      params = [req.params.id];
    }
    
    const { rows } = await pool.query(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get store info
    const storeResult = await pool.query(`
      SELECT name, street, city, phone FROM stores WHERE id = $1
    `, [rows[0].store_id]);
    
    res.json({ 
      order: {
        ...rows[0],
        store: storeResult.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/orders - Create new order
router.post('/', async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const {
      store_id,
      customer_phone,
      customer_name,
      car_description,
      items,
      pickup_slot_id,
      payment_method,
      notes
    } = req.body;
    
    // Validate required fields
    if (!store_id || !customer_phone || !customer_name || !items?.length || !pickup_slot_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check slot availability
    const slotResult = await client.query(`
      SELECT * FROM pickup_slots 
      WHERE id = $1 AND is_available = true AND booked < capacity
      FOR UPDATE
    `, [pickup_slot_id]);
    
    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Pickup slot no longer available' });
    }
    
    const slot = slotResult.rows[0];
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal_cents || 0), 0);
    const taxRate = 0.0575; // 5.75% Ohio state tax
    const tax = Math.round(subtotal * taxRate);
    const platformFee = Math.round(subtotal * 0.05); // 5% platform fee
    const total = subtotal + tax;
    
    // Generate order code
    let orderCode = generateOrderCode();
    let codeExists = true;
    let attempts = 0;
    
    while (codeExists && attempts < 10) {
      const codeCheck = await client.query(`
        SELECT id FROM orders WHERE order_code = $1
      `, [orderCode]);
      if (codeCheck.rows.length === 0) {
        codeExists = false;
      } else {
        orderCode = generateOrderCode();
        attempts++;
      }
    }
    
    // Create payment intent if paying by card
    let stripePaymentIntentId = null;
    let clientSecret = null;
    
    if (payment_method === 'card') {
      try {
        const paymentIntent = await createPaymentIntent(total, {
          order_code: orderCode,
          customer_phone
        });
        stripePaymentIntentId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret;
      } catch (err) {
        await client.query('ROLLBACK');
        
        if (err instanceof StripeServiceError) {
          return res.status(400).json({ 
            error: 'Payment processing failed',
            message: err.message,
            code: err.code,
            type: 'stripe_error'
          });
        }
        
        return res.status(400).json({ 
          error: 'Payment processing failed',
          message: 'Unable to process payment. Please try again.' 
        });
      }
    }
    
    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (
        order_code, store_id, customer_phone, customer_name, car_description,
        items, status, pickup_slot_id, pickup_date, pickup_time_start, pickup_time_end,
        payment_method, stripe_payment_intent_id, subtotal_cents, tax_cents, 
        total_cents, platform_fee_cents, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      orderCode,
      store_id,
      customer_phone,
      customer_name,
      car_description,
      JSON.stringify(items),
      'confirmed',
      pickup_slot_id,
      slot.date,
      slot.time_start,
      slot.time_end,
      payment_method,
      stripePaymentIntentId,
      subtotal,
      tax,
      total,
      platformFee,
      notes
    ]);
    
    // Update slot booking count
    await client.query(`
      UPDATE pickup_slots 
      SET booked = booked + 1 
      WHERE id = $1
    `, [pickup_slot_id]);
    
    await client.query('COMMIT');
    
    const order = orderResult.rows[0];
    
    // Send confirmation SMS
    try {
      await sendOrderConfirmation(
        customer_phone,
        orderCode,
        `${slot.date} ${slot.time_start.slice(0, 5)}-${slot.time_end.slice(0, 5)}`
      );
      
      await pool.query(`
        UPDATE orders SET sms_confirmed_sent = true WHERE id = $1
      `, [order.id]);
    } catch (err) {
      console.error('[Orders] SMS send failed:', err.message);
      // Don't fail the order if SMS fails
    }
    
    res.status(201).json({ 
      order,
      client_secret: clientSecret
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// PUT /api/v1/orders/:id/cancel - Cancel order
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    // Get order
    const { rows } = await pool.query(`
      SELECT * FROM orders WHERE id = $1 OR order_code = $1
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = rows[0];
    
    // Only allow cancel if not already picked up or cancelled
    if (order.status === 'picked-up' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    
    // Update order
    const result = await pool.query(`
      UPDATE orders 
      SET status = 'cancelled', cancelled_at = NOW(), cancelled_reason = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [reason, order.id]);
    
    // Release slot
    await pool.query(`
      UPDATE pickup_slots 
      SET booked = GREATEST(0, booked - 1)
      WHERE id = $1
    `, [order.pickup_slot_id]);
    
    // Send cancellation SMS
    try {
      await sendOrderCancelled(order.customer_phone, order.order_code, reason);
    } catch (err) {
      console.error('[Orders] Cancellation SMS failed:', err.message);
    }
    
    res.json({ order: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
