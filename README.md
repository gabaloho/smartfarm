# Gue Smart Farms

Gue Smart Farms is an online marketplace for connecting customers with farms and vendors.

## Repository

- [`smartfarm-app/`](./smartfarm-app/) — the marketplace application, built with Next.js, React, TypeScript, Prisma, and NextAuth. It includes product discovery, customer accounts, cart and checkout flows, order tracking, vendor tools, and administration.

## Run the application

The main app lives in `smartfarm-app/`:

```bash
cd smartfarm-app
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Before configuring a local or production environment, review [`smartfarm-app/README.md`](./smartfarm-app/README.md) for setup, routes, and operational guidance. Run `npm run env:check` from `smartfarm-app/` to validate the required environment variables.

## License

The repository is licensed under the MIT License; see [`LICENSE`](./LICENSE).
