# JJ HALAL Operations Runbook

## Critical Endpoints

- Health: `/api/health`
- Ops summary: `/api/admin/ops/summary`
- Audit events: `/api/admin/audit-events`
- Inventory events: `/api/admin/inventory-events`
- Paystack webhook: `/api/payments/paystack/webhook`
- Stripe webhook: `/api/payments/stripe/webhook`

## Runtime Safety Guarantees

- Webhook idempotency:
   - Duplicate Stripe/Paystack deliveries are ignored safely.
   - Events are tracked in `webhook_events` by `(event_source, event_id)` uniqueness.
- Inventory restoration idempotency:
   - Stock reversal events are tracked in `order_inventory_events`.
   - A reversal event can only be applied once per order/event type.
- Operational indexes:
   - Read-heavy index creation is self-healed at runtime through `/api/health` and key list endpoints.
   - No manual migration is required for these operational indexes.

## Launch Checklist

1. Confirm production secrets:
   - `AUTH_SECRET`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `PAYSTACK_SECRET_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
2. Verify webhook registration in provider dashboards with HTTPS domain.
3. Run smoke test:
   - Place order with Paystack and Stripe.
   - Confirm webhook updates order to `PAID`.
   - Confirm Admin Ops shows webhook success event.
4. Run automated endpoint smoke checks:
   - PowerShell: `$env:SMOKE_BASE_URL="https://www.gonaa.ng"; $env:SMOKE_API_BASE_URL="https://api.gonaa.ng"; npm run smoke:prod`
   - Bash/CI: `SMOKE_BASE_URL=https://www.gonaa.ng SMOKE_API_BASE_URL=https://api.gonaa.ng npm run smoke:prod`
   - Expect all checks to pass before peak traffic windows.
   - If web pages pass but API checks return `404`, your frontend and API are not deployed on the same host/path.

## Incident: Payment Failed After Stock Reserved

1. Check `/api/admin/ops/summary`:
   - `failedPaymentCount24h`
   - `paymentFailureEvents24h`
2. Confirm inventory reversal in `/api/admin/inventory-events` with event `PAYMENT_FAILED`.
3. If event missing, manually mark order payment status to `FAILED` from admin order actions.
4. If provider retries webhook repeatedly, confirm duplicate processing is blocked by checking `webhook_events` count growth (one row per provider event).

## Incident: Refund Processed

1. Confirm order payment status is `REFUNDED`.
2. Check inventory event for `PAYMENT_REFUNDED`.
3. Confirm audit event type `payment.stripe.refunded` or provider-specific equivalent.

## Incident: Order Cancelled by Buyer

1. Ensure order status is `CANCELLED`.
2. Verify inventory event `ORDER_CANCELLED` was created.

## Daily Monitoring

1. Open Admin Ops Console: `/admin/ops`.
2. Review:
   - Pending payments
   - Stale pending orders
   - Failed payment events
   - Inventory reversal events
3. Investigate any spike in failures before daily close.

## Rollback Guidance

If a new deployment introduces payment or checkout errors:

1. Roll back to previous deployment.
2. Keep webhook endpoints active on stable release.
3. Re-run checkout smoke test.
4. Check for unmatched orders with `PENDING` payment status older than one hour.
