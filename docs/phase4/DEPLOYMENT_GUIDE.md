# Phase 4 — Deployment Guide

## 1. Production Build
```bash
npm run build   # Should complete with zero errors
npm run start    # Test production build locally
```

## 2. Vercel Deployment
1. Push `main` branch to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
4. Deploy

## 3. Supabase Production
- Create separate Supabase project for production
- Run all migration SQL from T1's steps
- Enable RLS on all tables
- Create storage buckets (product-images, condition-photos)
- Seed platform_config with default values
- Create super admin account

## 4. Post-Deployment
- Smoke test all major flows
- Verify emails are sending
- Verify image uploads work
- Monitor for errors in Vercel logs
