# NAI Website API Integration Setup Guide

This document outlines the API setup requirements and configurations for all 4 NAI websites.

---

## 1. civic-insight-engine

### APIs Used
- **Google Gemini API** - AI meeting summarization

### Environment Variables
Create `.env` file in the root directory:

```bash
# Required: Google Gemini API Key
# Get your API key at: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Force mock mode for development
VITE_USE_MOCK_DATA=false
```

### API Features
- Automatic fallback to mock data when API key is missing
- Comprehensive error handling with user-friendly messages
- API health check endpoint (via UI component)
- Structured JSON response validation using Zod

### Testing
```bash
# Start development server
npm run dev

# Test API connection
# Navigate to Admin Panel -> API Status to verify connection
```

### Error Handling
- `AUTH_ERROR` - API key not configured or invalid
- `QUOTA_ERROR` - API quota exceeded
- `RATE_LIMIT` - Too many requests
- `PARSE_ERROR` - Invalid response format
- All errors gracefully fall back to mock data

---

## 2. invest-ashtabula

### APIs Used
- **None currently** - Static site with JSON data
- **Optional:** Google Gemini API for future chatbot feature

### Environment Variables
Create `.env` file in the root directory:

```bash
# Optional: For future AI chatbot feature
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: API base URL if backend is added
VITE_API_URL=http://localhost:3000
```

### Notes
- Currently a static marketing site
- Data loaded from `src/data/sites.json`
- No API integration required for current functionality

---

## 3. permit-whisperer

### APIs Used
- **Google Gemini API** - AI permit assistance

### Environment Variables
Create `.env` file in the root directory:

```bash
# Required: Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Specify Gemini model (defaults to gemini-1.5-flash)
VITE_GEMINI_MODEL=gemini-1.5-flash
```

### API Features
- Clean service module architecture (`src/services/geminiApi.js`)
- Mock mode for demo without API key
- Citation extraction from responses
- Safety filter handling
- Rate limit protection

### Testing
```bash
# Start development server
npm run dev

# The app will show "Demo Mode" banner if API key is missing
# Click "Try demo mode instead" to use mock responses
```

### Error Handling
All errors are caught and displayed with user-friendly messages:
- API key not configured → Shows setup instructions + demo mode link
- Rate limit → Retry suggestion
- Safety blocked → Rephrasing suggestion
- Network errors → Connection troubleshooting

---

## 4. local-grocer-go

### APIs Used
- **Stripe** - Payment processing
- **Twilio** - SMS notifications
- **PostgreSQL** - Database
- **Redis** - Caching (optional)

### Environment Variables

#### Server (`server/.env`)
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/localgrocer
REDIS_URL=redis://localhost:6379

# Stripe (Required)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PLATFORM_FEE_PERCENT=5

# Twilio (Required for SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase Admin (Optional)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client (`client/.env`)
```bash
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key_here
```

### API Features
- Comprehensive health check endpoints
- Rate limiting on all routes
- Custom error classes for each service
- Automatic retry suggestions
- Graceful degradation when services are unavailable

### Health Check Endpoints
```bash
# Overall health
GET /health

# Detailed service status
GET /api/v1/health

# Individual service checks
GET /api/v1/health/stripe
GET /api/v1/health/twilio
GET /api/v1/health/database
```

### Testing
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start server
cd ../server && npm run dev

# Test health endpoint
curl http://localhost:3001/api/v1/health
```

### Error Handling
Each service has custom error types:
- `StripeServiceError` - Payment processing errors
- `TwilioServiceError` - SMS/voice errors

HTTP Status Codes:
- `400` - Validation errors
- `401/403` - Authentication errors
- `404` - Resource not found
- `429` - Rate limit exceeded
- `503` - Service unavailable
- `500` - Internal server error

---

## Quick Start Checklist

### For all sites:
1. [ ] Copy `.env.example` to `.env`
2. [ ] Add your API keys
3. [ ] Install dependencies: `npm install`
4. [ ] Start development server: `npm run dev`

### API Keys Needed:

| Site | Gemini | Stripe | Twilio | Database |
|------|--------|--------|--------|----------|
| civic-insight-engine | ✅ | - | - | - |
| invest-ashtabula | Optional | - | - | - |
| permit-whisperer | ✅ | - | - | - |
| local-grocer-go | - | ✅ | ✅ | ✅ |

---

## Security Notes

1. **Never commit `.env` files** - All `.env` files are in `.gitignore`
2. **Use separate keys for dev/prod** - All services support test/sandbox modes
3. **Rotate keys regularly** - Especially for production deployments
4. **Monitor API usage** - Set up alerts for unexpected quota usage
5. **Use environment-specific variables** - Different keys for local/staging/production

---

## Troubleshooting

### Common Issues

**"API key not configured" error**
- Check `.env` file exists in correct location
- Verify variable name matches exactly
- Restart dev server after adding env vars

**CORS errors**
- Verify `CLIENT_URL` matches your frontend URL
- Check for trailing slashes in URLs

**Rate limit errors**
- Check rate limit configuration
- Implement client-side request throttling
- Consider upgrading API plan

**Payment/SMS not working**
- Verify test mode vs live mode keys
- Check webhook configuration for Stripe
- Verify Twilio phone number is valid

---

## Support

For issues with specific APIs:
- **Gemini**: https://ai.google.dev/docs
- **Stripe**: https://stripe.com/docs
- **Twilio**: https://www.twilio.com/docs
