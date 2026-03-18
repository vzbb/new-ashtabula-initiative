import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/v1/products - List all products (optionally filtered by store)
router.get('/', async (req, res, next) => {
  try {
    const { store_id, category } = req.query;
    let query = `
      SELECT p.*, s.name as store_name
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.is_active = true AND s.is_active = true
    `;
    const params = [];
    
    if (store_id) {
      query += ` AND p.store_id = $${params.length + 1}`;
      params.push(store_id);
    }
    
    if (category) {
      query += ` AND p.category = $${params.length + 1}`;
      params.push(category);
    }
    
    query += ` ORDER BY p.store_id, p.sort_order, p.name`;
    
    const { rows } = await pool.query(query, params);
    res.json({ products: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products/:id - Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, s.name as store_name
      FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE p.id = $1 AND p.is_active = true
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/stores/:storeId/products - Get products for a store
router.get('/store/:storeId', async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT * FROM products
      WHERE store_id = $1 AND is_active = true
    `;
    const params = [req.params.storeId];
    
    if (category) {
      query += ` AND category = $2`;
      params.push(category);
    }
    
    query += ` ORDER BY sort_order, name`;
    
    const { rows } = await pool.query(query, params);
    
    // Group by category
    const grouped = rows.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
    
    res.json({ products: rows, grouped });
  } catch (err) {
    next(err);
  }
});

export default router;
