# Dev Coordination — Shaw

## Event Permit Express — Deploy Status

**State:** Branding applied & verified in source + dist. Deploy SCHEDULED.

**5 branding fixes (verified):**
1. Address: "127 N. Elm St, Jefferson, OH 44047" in footer
2. Email: ashtafair@windstream.net visible as text link
3. Contact: Brian Edelman alongside phone 440-858-6667
4. Accent color: forest green #2E7D32 (was blue-green)
5. Background: warm off-white #FAF8F5 (was cool off-white)

**Cron job:** `6030bcec49ef` — runs `./nai deploy --confirm-production` at midnight UTC Jul 6

**Repairs during deploy attempt:**
- .vercelignore restored (was zero bytes)
- Fixed node_modules corruption: blueprint, adaptive-reuse, auto-detail, aidflow, ai-docent-pro, artist-commission, ashtabula-fence
- Rebuilt missing dist/: pocket-sommelier-pro, eligibility-screener, insta-book
- Cleaned stale .vercel/output/ directories
