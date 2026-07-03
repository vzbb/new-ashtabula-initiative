import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/localgrocer'
});

export default pool;

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Stores table
      CREATE TABLE IF NOT EXISTS stores (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('independent', 'chain', 'producer-hub')),
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        phone VARCHAR(20) NOT NULL,
        hours JSONB NOT NULL DEFAULT '{}',
        logo_url TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        fulfillment_type VARCHAR(50) NOT NULL DEFAULT 'store-staff',
        stripe_account_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL CHECK (category IN ('eggs', 'dairy', 'bread', 'meat', 'produce', 'pantry', 'local-specialty')),
        price_cents INTEGER NOT NULL,
        unit VARCHAR(20) NOT NULL CHECK (unit IN ('each', 'lb', 'dozen', 'gallon', 'pack')),
        image_url TEXT,
        is_local BOOLEAN DEFAULT false,
        is_organic BOOLEAN DEFAULT false,
        is_snap_eligible BOOLEAN DEFAULT false,
        inventory_count INTEGER,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Pickup slots table
      CREATE TABLE IF NOT EXISTS pickup_slots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time_start TIME NOT NULL,
        time_end TIME NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 10,
        booked INTEGER NOT NULL DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        cutoff_hours INTEGER DEFAULT 2,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id, date, time_start)
      );

      -- Orders table
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_code VARCHAR(20) UNIQUE NOT NULL,
        store_id UUID REFERENCES stores(id),
        customer_phone VARCHAR(20) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        car_description VARCHAR(255),
        items JSONB NOT NULL DEFAULT '[]',
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked-up', 'cancelled')),
        pickup_slot_id UUID REFERENCES pickup_slots(id),
        pickup_date DATE,
        pickup_time_start TIME,
        pickup_time_end TIME,
        payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'cash', 'snap')),
        stripe_payment_intent_id VARCHAR(255),
        subtotal_cents INTEGER NOT NULL,
        tax_cents INTEGER NOT NULL,
        total_cents INTEGER NOT NULL,
        platform_fee_cents INTEGER NOT NULL,
        sms_confirmed_sent BOOLEAN DEFAULT false,
        sms_ready_sent BOOLEAN DEFAULT false,
        sms_reminder_sent BOOLEAN DEFAULT false,
        notes TEXT,
        cancelled_at TIMESTAMP,
        cancelled_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Store users (for dashboard access)
      CREATE TABLE IF NOT EXISTS store_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
      CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
      CREATE INDEX IF NOT EXISTS idx_slots_store ON pickup_slots(store_id);
      CREATE INDEX IF NOT EXISTS idx_slots_date ON pickup_slots(date);
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
}
