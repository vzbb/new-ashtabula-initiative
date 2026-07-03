# API Setup Guide - Mobile Notary

## Overview
This application uses the **Google Gemini API** to generate professional mobile notary appointment confirmations.

## Required API Key

### Gemini API Key
- **Service**: Google Gemini API
- **Purpose**: Generate AI-powered appointment confirmations
- **Environment Variable**: `VITE_GEMINI_API_KEY`
- **Get your key**: https://aistudio.google.com/app/apikey

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Gemini API key:**
   ```bash
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## API Features

### Appointment Confirmation Generation
- Generates professional appointment confirmations
- Includes licensing, bonding, and insurance details
- Reminds clients to bring valid photo ID
- 60 words maximum for concise messaging

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid API keys
- Network connectivity issues
- API rate limiting
- Service unavailable errors
- Timeout handling (30 seconds)

### Error Messages
User-friendly error messages are displayed for:
- Configuration errors (missing API key)
- Authentication failures
- Rate limiting
- Network errors
- Service outages

## API Configuration File
Configuration is managed in `src/config/api.js`:
- `validateApiConfig()` - Validates API key on startup
- `generateAppointmentConfirmation()` - Generates confirmations with error handling
- Timeout handling via AbortController
- Comprehensive HTTP error handling

## Production Deployment

For production builds, the API key can be injected at build time:
```bash
VITE_GEMINI_API_KEY=$GEMINI_API_KEY npm run build
```

Or set in your deployment platform's environment variables.

## Troubleshooting

### "Gemini API key is not configured"
- Ensure `.env` file exists with `VITE_GEMINI_API_KEY`
- Restart the dev server after adding the key
- Check that the key is valid at https://aistudio.google.com/app/apikey

### "API authentication failed"
- Verify your API key is correct
- Check if the key has been revoked
- Ensure the Gemini API is enabled for your project

### "Rate limit exceeded"
- Wait a few moments before trying again
- Consider implementing client-side rate limiting
- Check your Gemini API quota at https://aistudio.google.com/app/apikey

### "Request timed out"
- Check your internet connection
- Verify firewall settings allow connections to `generativelanguage.googleapis.com`
- The timeout is set to 30 seconds

## Security Notes
- Never commit `.env` files to version control
- API keys are client-side exposed (required for frontend usage)
- For production, consider using a backend proxy to hide API keys
- Monitor API usage to prevent abuse
