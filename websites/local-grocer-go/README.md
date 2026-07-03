# Local Grocer Go

**Click & Collect grocery platform for Ashtabula County**

Connecting rural residents with local independent grocers through simplified online ordering.

![Status](https://img.shields.io/badge/status-MVP%20Complete-brightgreen)
![Tech](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20PostgreSQL-blue)

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Set up environment
cp server/.env.example server/.env
# Edit server/.env with your API keys

# Start development servers
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:3001

## Features

### For Customers
- 🛒 Browse curated staples from local stores
- 📱 No account required - phone verification only
- 💳 Pay with card (Stripe) or at pickup (cash)
- 📲 SMS notifications for order updates
- 🔍 Track orders by phone number

### For Stores
- 📋 Real-time order queue
- 🔄 Status updates (confirmed → preparing → ready)
- 📊 Simple dashboard for staff
- 💰 Automatic payouts via Stripe Connect

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express |
| Database | PostgreSQL 15 |
| Payments | Stripe |
| SMS | Twilio |
| Auth | Phone-based (Firebase placeholder) |

## Project Structure

```
├── client/          # React frontend
├── server/          # Express API
│   ├── src/db/      # Database schema & seed
│   ├── src/routes/  # API endpoints
│   └── src/services/# Stripe & Twilio
└── BUILD_LOG.md     # Implementation details
```

## Environment Variables

See `server/.env.example` for required configuration.

## Screenshots

*Coming soon*

## Roadmap

- [x] MVP Core (Weeks 1-4)
- [ ] Multi-store + Polish (Weeks 5-8)
- [ ] Scale + SNAP (Weeks 9-12)

## License

MIT
