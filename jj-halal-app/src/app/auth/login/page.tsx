"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      totp,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid credentials, unverified email, or 2FA code.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4">
          <Image
            src="/assets/GONAA FARMS LOGO.jpeg"
            alt="GONAA FARMS LTD."
            width={130}
            height={44}
            className="h-10 w-auto object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          <p className="mt-2 text-xs text-gray-600">
            Certified halal groceries from trusted local farms.
          </p>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-600">
          Use your account credentials to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              required
            />
            <div className="mt-2 text-right">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-green-700 hover:text-green-800"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-gray-700"
              htmlFor="totp"
            >
              2FA code (if enabled)
            </label>
            <input
              id="totp"
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              placeholder="123456"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          New here?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Create account
          </Link>
        </p>
        <div className="mt-5 overflow-hidden rounded-xl border border-amber-100">
          <Image
            src="/assets/promo-popup.png"
            alt="Promo"
            width={600}
            height={260}
            className="h-24 w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-sm text-gray-600">Loading...</div>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
