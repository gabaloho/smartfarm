"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function VerifyEmailPageContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onVerify() {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Verification failed.");
      return;
    }

    setMessage(data.message ?? "Email verified successfully.");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 p-4">
          <Image src="/assets/gue-smart-farms-logo.svg" alt="Gue Smart Farms Limited" width={120} height={40} className="h-9 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-600">
          Confirm your email to secure your account and continue shopping.
        </p>

        {!token ? (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Verification token is missing. Open this page from your email link.
          </p>
        ) : (
          <button
            onClick={onVerify}
            disabled={isLoading}
            className="mt-5 w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify email"}
          </button>
        )}

        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-semibold text-green-700 hover:text-green-800">
            Go to sign in
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
            Back home
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          <Image src="/assets/promo-popup.png" alt="Promo" width={600} height={260} className="h-24 w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-600">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
