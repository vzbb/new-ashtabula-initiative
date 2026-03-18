# NAI Landing Page — Contact Form Test Checklist

**Purpose:** Verify serverless `/api/contact` email delivery after SMTP changes.

## Pre-checks
- [ ] Confirm Vercel env vars set (SMTP_HOST/PORT/USER/PASS/FROM/SECURE)
- [ ] Confirm deployment target is correct (new-ashtabula-initiative)

## Test Steps
1) Submit a test message via the live form
   - Name: "Test Sender"
   - Email: a real inbox you can check
   - Challenge: "Form delivery smoke test"
2) Verify response message shows success on page
3) Check contact@noirsys.com inbox (and spam)
4) Reply-to should be the sender’s email

## If it fails
- [ ] Check Vercel function logs
- [ ] Confirm Gmail App Password is active
- [ ] Re-submit after 2 minutes

## Success Criteria
- [ ] Email arrives within 1–2 minutes
- [ ] Reply-to is correct
- [ ] No errors in Vercel logs
