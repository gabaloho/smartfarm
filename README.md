# Gue Smart Farms

Gue Smart Farms is a halal-focused online marketplace for connecting customers with farms and vendors. The repository contains the main web application and a static daily-needs storefront.

## Repository

- [`smartfarm-app/`](./smartfarm-app/) — the primary marketplace application, built with Next.js, React, TypeScript, Prisma, and NextAuth. It includes product discovery, customer accounts, cart and checkout flows, order tracking, vendor tools, and administration.
- [`daily-needs-full-template/`](./daily-needs-full-template/) — static storefront pages and assets for the daily-needs experience.

## Run the application

The main app lives in `smartfarm-app/`:

```bash
cd smartfarm-app
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Before configuring a local or production environment, review [`smartfarm-app/README.md`](./smartfarm-app/README.md) and [`smartfarm-app/.env.example`](./smartfarm-app/.env.example) for environment variables, database setup, routes, and operational guidance.

## License

The application is licensed under the MIT License; see [`smartfarm-app/LICENSE`](./smartfarm-app/LICENSE).
