import express from 'express';
import pool from '../db/index.js';
import { sendSMS } from '../services/twilio.js';

const router = express.Router();

// Middleware to check store auth (simplified for MVP)
const requireStoreAuth = async (req, res, next) => {
  // In production, validate JWT token
  // For MVP, we'll use a simple API key or session
  const apiKey = req.headers['x-store-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/v1/store-admin/orders - List orders for store
router.get('/orders', requireStoreAuth, async (req, res, next) => {
  try {
    const { store_id, status, date } = req.query;
    
    let query = `
      SELECT o.*, s.name as store_name
      FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    
    if (store_id) {
      query += ` AND o.store_id = $${params.length + 1}`;
      params.push(store_id);
    }
    
    if (status) {
      query += ` AND o.status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (date) {
      query += ` AND o.pickup_date = $${params.length + 1}`;
      params.push(date);
    }
    
    query += ` ORDER BY o.pickup_date, o.pickup_time_start`;
    
    const { rows } = await pool.query(query, params);
    res.json({ orders: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/store-admin/orders/:id - Get order details
router.get('/orders/:id', requireStoreAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.*, s.name as store_name, s.phone as store_phone
      FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE o.id = $1 OR o.order_code = $1
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/store-admin/orders/:id/status - Update order status
router.put('/orders/:id/status', requireStoreAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked-up', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Get order
    const orderResult = await pool.query(`
      SELECT * FROM orders WHERE id = $1 OR order_code = $1
    `, [req.params.id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    // Update status
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, order.id]);
    
    // Send SMS notifications based on status
    try {
      if (status === 'preparing' && !order.sms_confirmed_sent) {
        await sendSMS(order.customer_phone,
          `Good news! We're gathering your order ${order.order_code} now. We'll text when it's ready.`
        );
        await pool.query(`
          UPDATE orders SET sms_confirmed_sent = true WHERE id = $1
        `, [order.id]);
      }
      
      if (status === 'ready' && !order.sms_ready_sent) {
        await sendSMS(order.customer_phone,
          `Your order ${order.order_code} is ready! Come to the pickup counter. We're holding it until ${order.pickup_time_end.slice(0,5)}.`
        );
        await pool.query(`
          UPDATE orders SET sms_ready_sent = true WHERE id = $1
        `, [order.id]);
      }
    } catch (err) {
      console.error('SMS notification failed:', err);
    }
    
    res.json({ order: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/store-admin/products - List products for store
router.get('/products', requireStoreAuth, async (req, res, next) => {
  try {
    const { store_id } = req.query;
    
    const { rows } = await pool.query(`
      SELECT * FROM products
      WHERE store_id = $1
      ORDER BY sort_order, name
    `, [store_id]);
    
    res.json({ products: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/store-admin/products - Create product
router.post('/products', requireStoreAuth, async (req, res, next) => {
  try {
    const {
      store_id, name, description, category, price_cents, unit,
      is_local, is_organic, inventory_count
    } = req.body;
    
    const { rows } = await pool.query(`
      INSERT INTO products (store_id, name, description, category, price_cents, unit, is_local, is_organic, inventory_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [store_id, name, description, category, price_cents, unit, is_local, is_organic, inventory_count]);
    
    res.status(201).json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/store-admin/products/:id - Update product
router.put('/products/:id', requireStoreAuth, async (req, res, next) => {
  try {
    const updates = req.body;
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(updates);
    
    const { rows } = await pool.query(`
      UPDATE products 
      SET ${fields}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [req.params.id, ...values]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/store-admin/products/:id - Delete product (soft delete)
router.delete('/products/:id', requireStoreAuth, async (req, res, next) => {
  try {
    await pool.query(`
      UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1
    `, [req.params.id]);
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
