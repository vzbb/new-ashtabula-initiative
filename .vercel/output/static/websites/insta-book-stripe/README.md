# Insta-Book Stripe

A vacation rental booking platform with integrated Stripe payments - direct bookings with just 0.5% platform fee vs Airbnb's 17%.

## Features

### For Guests
- Browse and search vacation rentals
- View property details with photos
- Real-time availability calendar
- Instant booking with Stripe payments
- Secure deposit and balance payments

### For Hosts
- Owner dashboard with stats and analytics
- Property management (add, edit listings)
- Booking management with status tracking
- Visual availability calendar
- Stripe Connect integration for payouts
- Earnings tracking and reporting

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Zustand
- **Backend:** Node.js, Express, Firebase Admin SDK
- **Database:** Firestore (Firebase)
- **Cache:** Redis
- **Payments:** Stripe Connect
- **Auth:** Firebase Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- Redis (local or cloud)
- Firebase project
- Stripe account

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd insta-book-stripe

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

Create `.env` files:

**Server** (`server/.env`):
```env
PORT=3001
CLIENT_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
REDIS_URL=redis://localhost:6379
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Running Locally

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

The app will be available at http://localhost:5173

## Deployment

### Client (Vercel)
```bash
cd client
vercel --prod
```

### Server (Railway/Render)
```bash
cd server
# Follow platform-specific deployment steps
```

## Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3001/api/stripe/webhooks`
4. Copy the webhook signing secret to your `.env`

## API Documentation

See [BUILD_LOG.md](BUILD_LOG.md) for complete API endpoint documentation.

## Pricing Comparison

| Platform | Host Fee | Guest Fee | Total |
|----------|----------|-----------|-------|
| Insta-Book | 0.5% | 0% | **0.5%** |
| Airbnb | 3% | ~14% | ~17% |
| VRBO | 8% | 6-12% | 14-20% |

## License

MIT