import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/v1/stores - List all active stores
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, type, street, city, zip, lat, lng, phone, hours, logo_url, description, fulfillment_type
      FROM stores
      WHERE is_active = true
      ORDER BY name
    `);
    res.json({ stores: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/stores/:id - Get store details
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, type, street, city, zip, lat, lng, phone, hours, logo_url, description, fulfillment_type
      FROM stores
      WHERE id = $1 AND is_active = true
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json({ store: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/stores/:id/hours - Get store hours for a date
router.get('/:id/hours', async (req, res, next) => {
  try {
    const { date } = req.query;
    const { rows } = await pool.query(`
      SELECT hours FROM stores WHERE id = $1
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const dayOfWeek = date 
      ? new Date(date).toLocaleLowerCase().split(',')[0] 
      : new Date().toLocaleLowerCase().split(',')[0];
    
    const hours = rows[0].hours?.pickup?.[dayOfWeek] || null;
    res.json({ hours, day: dayOfWeek });
  } catch (err) {
    next(err);
  }
});

export default router;
