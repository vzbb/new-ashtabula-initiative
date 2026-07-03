import pool from './index.js';

export async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if already seeded
    const { rows } = await client.query('SELECT COUNT(*) FROM stores');
    if (parseInt(rows[0].count) > 0) {
      console.log('Database already seeded');
      return;
    }

    // Insert Sander's Market
    const sandersResult = await client.query(`
      INSERT INTO stores (name, type, street, city, zip, lat, lng, phone, hours, description, fulfillment_type)
      VALUES (
        'Sander''s Market - Jefferson',
        'independent',
        '125 E Jefferson St',
        'Jefferson',
        '44047',
        41.7384,
        -80.7684,
        '+14405762345',
        '{
          "pickup": {
            "monday": {"open": "09:00", "close": "19:00"},
            "tuesday": {"open": "09:00", "close": "19:00"},
            "wednesday": {"open": "09:00", "close": "19:00"},
            "thursday": {"open": "09:00", "close": "19:00"},
            "friday": {"open": "09:00", "close": "20:00"},
            "saturday": {"open": "09:00", "close": "20:00"},
            "sunday": {"open": "10:00", "close": "18:00"}
          }
        }',
        'Family-owned grocery serving Ashtabula County since 1952. Fresh produce, quality meats, and hometown service.',
        'store-staff'
      )
      RETURNING id
    `);
    const sandersId = sandersResult.rows[0].id;

    // Insert Harbor Gardens
    const harborResult = await client.query(`
      INSERT INTO stores (name, type, street, city, zip, lat, lng, phone, hours, description, fulfillment_type)
      VALUES (
        'Harbor Gardens Local Food Hub',
        'producer-hub',
        '4506 Lake Rd',
        'Ashtabula',
        '44004',
        41.9023,
        -80.7891,
        '+14409981234',
        '{
          "pickup": {
            "tuesday": {"open": "14:00", "close": "18:00"},
            "thursday": {"open": "14:00", "close": "18:00"},
            "saturday": {"open": "09:00", "close": "14:00"}
          }
        }',
        'Connecting local farmers and food producers with the community. Fresh, seasonal, and locally grown.',
        'owner-managed'
      )
      RETURNING id
    `);
    const harborId = harborResult.rows[0].id;

    // Insert products for Sander's Market
    const sandersProducts = [
      { name: 'Large Eggs', category: 'eggs', price: 399, unit: 'dozen', description: 'Grade A Large Eggs, 12 count' },
      { name: 'Whole Milk', category: 'dairy', price: 349, unit: 'gallon', description: 'Fresh whole milk from local dairy farms' },
      { name: 'Sliced White Bread', category: 'bread', price: 249, unit: 'each', description: 'Soft sandwich bread, baked fresh daily' },
      { name: 'Ground Beef (85/15)', category: 'meat', price: 549, unit: 'lb', description: 'Fresh ground beef, perfect for burgers or tacos' },
      { name: 'Boneless Chicken Breast', category: 'meat', price: 449, unit: 'lb', description: 'Premium chicken breast, family pack' },
      { name: 'Roma Tomatoes', category: 'produce', price: 199, unit: 'lb', description: 'Vine-ripened Roma tomatoes' },
      { name: 'Yellow Onions', category: 'produce', price: 129, unit: 'lb', description: 'Cooking onions, 3lb bag equivalent' },
      { name: 'Russet Potatoes', category: 'produce', price: 149, unit: 'lb', description: 'Perfect for baking or mashing' },
      { name: 'Bananas', category: 'produce', price: 79, unit: 'lb', description: 'Yellow bananas, ready to eat' },
      { name: 'Shredded Cheddar Cheese', category: 'dairy', price: 399, unit: 'pack', description: 'Sharp cheddar, 2 cups shredded' },
      { name: 'Butter (Salted)', category: 'dairy', price: 449, unit: 'pack', description: 'Creamery butter, 1lb' },
      { name: 'All-Purpose Flour', category: 'pantry', price: 299, unit: 'pack', description: '5lb bag, unbleached' },
      { name: 'White Rice', category: 'pantry', price: 249, unit: 'pack', description: 'Long grain rice, 2lb bag' },
      { name: 'Spaghetti Pasta', category: 'pantry', price: 149, unit: 'pack', description: 'Durum wheat pasta, 16oz' },
      { name: 'Marinara Sauce', category: 'pantry', price: 199, unit: 'each', description: 'Classic tomato sauce, 24oz jar' }
    ];

    for (const p of sandersProducts) {
      await client.query(`
        INSERT INTO products (store_id, name, description, category, price_cents, unit, is_local, inventory_count, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [sandersId, p.name, p.description, p.category, p.price, p.unit, false, 100, sandersProducts.indexOf(p)]);
    }

    // Insert products for Harbor Gardens (local specialty items)
    const harborProducts = [
      { name: 'Farm Fresh Eggs', category: 'eggs', price: 599, unit: 'dozen', description: 'Pasture-raised eggs from Heritage Farms', is_local: true },
      { name: 'Raw Honey (Local)', category: 'local-specialty', price: 899, unit: 'each', description: 'Ashtabula County wildflower honey, 12oz', is_local: true },
      { name: 'Grass-Fed Ground Beef', category: 'meat', price: 849, unit: 'lb', description: '100% grass-fed beef from Breezy Hill Farm', is_local: true },
      { name: 'Heirloom Tomatoes', category: 'produce', price: 399, unit: 'lb', description: 'Mixed heirloom varieties, vine-ripened', is_local: true },
      { name: 'Fresh Greens Mix', category: 'produce', price: 549, unit: 'pack', description: 'Spring mix from Harbor Gardens greenhouse', is_local: true },
      { name: 'Artisan Sourdough', category: 'bread', price: 699, unit: 'each', description: 'Naturally leavened, baked fresh Tuesday & Friday', is_local: true },
      { name: 'Maple Syrup (Grade A)', category: 'local-specialty', price: 1299, unit: 'each', description: 'Pure Ohio maple syrup, 8oz', is_local: true },
      { name: 'Fresh Goat Cheese', category: 'dairy', price: 749, unit: 'pack', description: 'Soft chèvre from Lake Effect Creamery', is_local: true }
    ];

    for (const p of harborProducts) {
      await client.query(`
        INSERT INTO products (store_id, name, description, category, price_cents, unit, is_local, inventory_count, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [harborId, p.name, p.description, p.category, p.price, p.unit, p.is_local, 50, harborProducts.indexOf(p)]);
    }

    // Generate pickup slots for next 7 days
    const stores = [sandersId, harborId];
    for (const storeId of stores) {
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate slots every hour from 10am to 6pm
        for (let hour = 10; hour < 18; hour++) {
          await client.query(`
            INSERT INTO pickup_slots (store_id, date, time_start, time_end, capacity)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING
          `, [storeId, dateStr, `${hour}:00`, `${hour + 1}:00`, 5]);
        }
      }
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database seeding error:', err);
    throw err;
  } finally {
    client.release();
  }
}
