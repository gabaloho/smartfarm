# Gue Smart Farms Limited App

Farmer's Market platform by Gue Smart Farms Limited built with Next.js App Router, NextAuth, Prisma, and Zustand.

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

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Brand Assets

Current brand assets:

- `public/assets/gue-smart-farms-logo.svg`
- `public/assets/gue-smart-farms-banner.svg`
- `public/assets/daily-needs-hero.jpg`
- `public/assets/promo-popup.png`

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

## Environment Preflight

Validate required variables before deploy:

```bash
npm run env:check
```

Strict mode also fails on placeholder values:

```bash
ENV_CHECK_STRICT=1 npm run env:check
```

Email provider requirement:

- Configure either `RESEND_API_KEY`, or
- Configure SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.
- Set `EMAIL_FROM` and `CONTACT_RECEIVER_EMAIL` to your configured mail addresses.

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

## Operational API Endpoints

- `POST /api/checkout/place-order` DB-backed order write with stock decrement and payment reference.
- `GET /api/orders` Authenticated customer order list.
- `GET /api/orders/:orderNumber` Authenticated customer order details.
- `POST /api/orders/:orderNumber` Customer order actions (cancel pending order).
- `GET /api/admin/orders` Admin order operations source.
- `POST /api/admin/orders/:orderNumber` Admin status/payment updates.
- `POST /api/payments/paystack/webhook` Paystack payment reconciliation webhook.
- `POST /api/payments/stripe/webhook` Stripe payment reconciliation webhook.
- `GET /api/health` Health endpoint for uptime monitoring.

## Notes

- Current order flow is application-level and local-state driven for frontend progress.
- Prisma schema is present and ready for deeper DB-backed integration.

## Production Readiness Checklist

- Set secure values in `.env.local` (`AUTH_SECRET`, payment keys, email keys, DB URL).
- Register payment webhooks with your live domain:
	- Paystack webhook: `https://your-domain.example/api/payments/paystack/webhook`
	- Stripe webhook: `https://your-domain.example/api/payments/stripe/webhook`
- Run `npx prisma generate` after schema updates.
- Run `npm run lint` and `npm run build` before deployment.
- Run smoke checks against live hosts:
	- Bash/CI: `SMOKE_BASE_URL=https://your-domain.example SMOKE_API_BASE_URL=https://api.your-domain.example npm run smoke:prod`
	- PowerShell: `$env:SMOKE_BASE_URL="https://your-domain.example"; $env:SMOKE_API_BASE_URL="https://api.your-domain.example"; npm run smoke:prod`
- Deploy with `NODE_ENV=production` and `NEXT_PUBLIC_APP_URL` set to live HTTPS domain.
- Ensure PostgreSQL backups and monitoring are configured in production.

## Paystack Test Mode Setup

Use the Paystack dashboard Test Mode values with this mapping:

- Test Secret Key -> PAYSTACK_SECRET_KEY in .env.local
- Test Public Key -> NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.local
- Test Callback URL -> https://your-domain.example/payment
- Test Webhook URL -> https://your-domain.example/api/payments/paystack/webhook

Notes:

- Callback URL in this app is also sent dynamically during transaction initialization and includes order details.
- For Vercel deployments, avoid enabling strict Paystack API IP whitelist unless you have static outbound egress IPs.
- If you are using a static egress gateway, add only those fixed egress IPs to Paystack IP whitelist.
