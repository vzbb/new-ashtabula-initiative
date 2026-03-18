import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/v1/slots - Get available pickup slots
router.get('/', async (req, res, next) => {
  try {
    const { store_id, date } = req.query;
    
    if (!store_id) {
      return res.status(400).json({ error: 'Store ID required' });
    }
    
    let query = `
      SELECT s.*, 
        (s.capacity - s.booked) as available_spots
      FROM pickup_slots s
      WHERE s.store_id = $1 AND s.is_available = true
    `;
    const params = [store_id];
    
    if (date) {
      query += ` AND s.date = $2`;
      params.push(date);
    } else {
      // Default to next 7 days
      query += ` AND s.date >= CURRENT_DATE AND s.date <= CURRENT_DATE + 7`;
    }
    
    query += ` ORDER BY s.date, s.time_start`;
    
    const { rows } = await pool.query(query, params);
    
    // Group by date
    const grouped = rows.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
    
    res.json({ slots: rows, grouped });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/slots/:id - Get single slot
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, st.name as store_name, st.address
      FROM pickup_slots s
      JOIN stores st ON s.store_id = st.id
      WHERE s.id = $1
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    res.json({ slot: rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
