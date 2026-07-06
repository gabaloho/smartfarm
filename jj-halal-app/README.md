# JJ HALAL App

Farmer's Market platform by JJ HALAL FARMS LTD. built with Next.js App Router, NextAuth, Prisma, and Zustand.

## Features Implemented

- Branded storefront homepage (hero, categories, promotions)
- Catalog pages with filters and category routing
- Auth flow pages (login, register, email verify, 2FA setup)
- Buyer and seller registration from one onboarding flow
- Seller onboarding fields (brand name required, CAC optional, seller profile details)
- NextAuth credential auth with role-aware middleware
- Cart, checkout, payment instruction flow
- Customer orders tracking pages
- Admin dashboard (metrics + order status updates)
- Vendor portal (inventory + vendor order workflow)
- Auctions page open to all users

## Brand Assets

Brand assets copied from template folder are in:

- `public/assets/jj-logo.png`
- `public/assets/daily-needs-hero.jpg`
- `public/assets/promo-popup.png`
- `public/assets/banner.jpeg`

## Environment Setup

1. Review `.env.example`.
2. Update `.env.local` with your real values.
3. Generate a secure `AUTH_SECRET`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database (Prisma)

If running with PostgreSQL:

```bash
npx prisma generate
npx prisma db push
```

## Important Routes

- `/` Home
- `/products` Catalog
- `/cart` Cart
- `/checkout` Checkout
- `/payment` Payment status
- `/orders` Customer orders
- `/admin` Admin dashboard (ADMIN role)
- `/vendor` Vendor portal (VENDOR/ADMIN role)

## Notes

- Current order flow is application-level and local-state driven for frontend progress.
- Prisma schema is present and ready for deeper DB-backed integration.

## Production Readiness Checklist

- Set secure values in `.env.local` (`AUTH_SECRET`, payment keys, email keys, DB URL).
- Run `npx prisma generate` after schema updates.
- Run `npm run lint` and `npm run build` before deployment.
- Deploy with `NODE_ENV=production` and `NEXT_PUBLIC_APP_URL` set to live HTTPS domain.
- Ensure PostgreSQL backups and monitoring are configured in production.
