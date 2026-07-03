# API Setup Guide - Truck Wash Booking

## Required API Key

This application uses the **Google Gemini API** to generate booking confirmations.

## Setup Instructions

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. Edit the `.env` file:
   ```bash
   nano .env
   ```

3. Replace the placeholder with your actual API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Restart the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## API Error Handling

The application includes comprehensive error handling for:

- **401 Unauthorized**: Invalid API key
- **403 Forbidden**: API key lacks permissions
- **429 Rate Limit**: Too many requests
- **500/502/503**: Gemini service unavailable
- **Network errors**: Connection issues

## Testing the API

1. Start the dev server: `npm run dev`
2. Select a date and fleet size
3. Click "Reserve Your Slot"
4. Verify the booking confirmation appears

## Troubleshooting

### "Please configure your Gemini API key"
The `.env` file is missing or the API key is not set. Check that:
- `.env` file exists in the project root
- `VITE_GEMINI_API_KEY` is set to a valid key
- You've restarted the dev server after adding the key

### "Invalid API key format"
The API key appears to be malformed. Gemini API keys are typically 39 characters long.

### "Rate limit exceeded"
You've made too many requests. Wait a moment and try again.

### "Gemini API service is temporarily unavailable"
Google's service may be down. Try again in a few minutes.

## Security Notes

- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys are client-side exposed (Vite prefix) - for demo purposes only
- For production, consider using a backend proxy
