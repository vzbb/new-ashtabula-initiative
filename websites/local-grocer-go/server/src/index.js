import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDatabase } from './db/index.js';
import { seedDatabase } from './db/seed.js';
import storeRoutes from './routes/stores.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import slotRoutes from './routes/slots.js';
import smsRoutes from './routes/sms.js';
import webhookRoutes from './routes/webhooks.js';
import storeAdminRoutes from './routes/store-admin.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ['STRIPE_SECRET_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing environment variables:', missingEnvVars.join(', '));
  console.warn('   Some features may not work correctly.');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for SMS
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'SMS limit exceeded. Please try again later.' }
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/webhook+json' }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/sms', smsLimiter, smsRoutes);
app.use('/api/v1/store-admin', storeAdminRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/webhooks', webhookRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Local Grocer Go API',
    version: '1.0.0',
    endpoints: {
      stores: '/api/v1/stores',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      slots: '/api/v1/slots',
      sms: '/api/v1/sms',
      health: '/api/v1/health',
      admin: '/api/v1/store-admin'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      '/api/v1/stores',
      '/api/v1/products', 
      '/api/v1/orders',
      '/api/v1/health',
      '/health'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.type === 'StripeError') {
    return res.status(400).json({
      error: 'Payment processing error',
      message: err.message,
      code: err.code,
      type: 'stripe_error'
    });
  }
  
  if (err.type === 'TwilioError') {
    return res.status(400).json({
      error: 'SMS service error',
      message: err.message,
      code: err.code,
      type: 'twilio_error'
    });
  }
  
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists'
    });
  }
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Unable to connect to required service'
    });
  }
  
  // Generic error response
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    error: err.name || 'Internal server error',
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  };
  
  res.status(statusCode).json(response);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    const pool = await initDatabase();
    
    // Store db pool in app for use in routes
    app.set('db', pool);
    
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Local Grocer Go server running on port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`💊 Health: http://localhost:${PORT}/health`);
      
      if (missingEnvVars.length > 0) {
        console.log('\n⚠️  Configuration issues detected:');
        missingEnvVars.forEach(v => console.log(`   - ${v} is not set`));
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
