#!/usr/bin/env node

const baseUrl = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiBaseUrl = (process.env.SMOKE_API_BASE_URL || baseUrl).replace(/\/$/, "");
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || "15000");

const checks = [
  {
    name: "Home page",
    target: "web",
    method: "GET",
    path: "/",
    expectStatus: [200],
  },
  {
    name: "Marketplace page",
    target: "web",
    method: "GET",
    path: "/marketplace",
    expectStatus: [200],
  },
  {
    name: "Health endpoint",
    target: "api",
    method: "GET",
    path: "/api/health",
    expectStatus: [200],
    validateJson: (body) => typeof body === "object" && body !== null,
  },
  {
    name: "Customer orders auth guard",
    target: "api",
    method: "GET",
    path: "/api/orders",
    expectStatus: [401, 403],
  },
  {
    name: "Admin ops auth guard",
    target: "api",
    method: "GET",
    path: "/api/admin/ops/summary",
    expectStatus: [401, 403],
  },
  {
    name: "Paystack webhook signature guard",
    target: "api",
    method: "POST",
    path: "/api/payments/paystack/webhook",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ event: "charge.success", data: { reference: "smoke-test-ref" } }),
    expectStatus: [400, 401],
  },
  {
    name: "Stripe webhook signature guard",
    target: "api",
    method: "POST",
    path: "/api/payments/stripe/webhook",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ type: "payment_intent.succeeded", data: { object: {} } }),
    expectStatus: [400, 401],
  },
];

function withTimeout(signal, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

async function runCheck(check) {
  const root = check.target === "api" ? apiBaseUrl : baseUrl;
  const url = `${root}${check.path}`;
  const timeout = withTimeout(undefined, timeoutMs);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      method: check.method,
      headers: check.headers,
      body: check.body,
      signal: timeout.signal,
      redirect: "follow",
    });

    const elapsed = Date.now() - started;
    const ok = check.expectStatus.includes(response.status);

    let jsonValidationOk = true;
    if (ok && check.validateJson) {
      try {
        const body = await response.json();
        jsonValidationOk = check.validateJson(body);
      } catch {
        jsonValidationOk = false;
      }
    }

    if (!ok || !jsonValidationOk) {
      return {
        ok: false,
        name: check.name,
        method: check.method,
        path: check.path,
        status: response.status,
        finalUrl: response.url,
        elapsed,
        reason: !ok
          ? `Expected ${check.expectStatus.join("/")} but got ${response.status}`
          : "JSON response validation failed",
      };
    }

    return {
      ok: true,
      name: check.name,
      method: check.method,
      path: check.path,
      status: response.status,
      finalUrl: response.url,
      elapsed,
    };
  } catch (error) {
    return {
      ok: false,
      name: check.name,
      method: check.method,
      path: check.path,
      status: null,
      elapsed: Date.now() - started,
      reason: error instanceof Error ? error.message : String(error),
    };
  } finally {
    timeout.clear();
  }
}

async function main() {
  console.log(`Running smoke tests against ${baseUrl}`);
  console.log(`API smoke target: ${apiBaseUrl}`);
  console.log(`Timeout per check: ${timeoutMs}ms`);

  const results = [];
  for (const check of checks) {
    const result = await runCheck(check);
    results.push(result);
    const status = result.status === null ? "ERR" : String(result.status);
    const marker = result.ok ? "PASS" : "FAIL";
    const root = check.target === "api" ? apiBaseUrl : baseUrl;
    const redirected = result.finalUrl && result.finalUrl !== `${root}${check.path}`
      ? ` -> ${result.finalUrl}`
      : "";
    const detail = result.ok ? "" : ` | ${result.reason}`;
    console.log(`${marker} ${check.method} ${check.path} [${status}] ${result.elapsed}ms${redirected}${detail}`);
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`\nSummary: ${passed}/${results.length} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Smoke test runner failed:", error);
  process.exit(1);
});
