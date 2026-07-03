# New Ashtabula Initiative Landing Page

The form on `index.html` now posts to the Vercel serverless endpoint at `/api/contact`, which sends submissions to `contact@noirsys.com`.

## Required Environment Variables

Set these in Vercel Project Settings (or via CLI) before deploying:

- `SMTP_HOST` - SMTP server hostname (example: `smtp.mailprovider.com`)
- `SMTP_PORT` - SMTP server port (example: `587` or `465`)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password or app password
- `SMTP_FROM` - sender address shown in outbound mail (recommended)
- `SMTP_SECURE` - `true` for SMTPS (usually port `465`), otherwise `false`

No secrets are hardcoded in this repo.

## Local Development

1. Install dependencies:
   - `npm install`
2. Create `.env.local` with the variables above.
3. Run Vercel local dev:
   - `npm run dev`
4. Open the local URL shown by Vercel and submit the form in `index.html`.

## Deploy to Vercel

1. Link or create the Vercel project:
   - `vercel`
2. Add environment variables:
   - `vercel env add SMTP_HOST`
   - `vercel env add SMTP_PORT`
   - `vercel env add SMTP_USER`
   - `vercel env add SMTP_PASS`
   - `vercel env add SMTP_FROM`
   - `vercel env add SMTP_SECURE`
3. Deploy production:
   - `npm run deploy`
