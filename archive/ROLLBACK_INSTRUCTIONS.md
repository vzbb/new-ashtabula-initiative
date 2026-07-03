# NAI Landing Page — Rollback Instructions (Vercel)

**Use only with explicit approval.**

## Fast rollback (Vercel UI)
1) Open Vercel project: `new-ashtabula-initiative`
2) Go to **Deployments**
3) Find the last good deployment
4) Click **⋯** → **Promote to Production**

## CLI option (if needed)
```bash
vercel rollback <deployment-url>
```

## Post-rollback checks
- Homepage loads
- Nav links work
- Contact form still reachable
