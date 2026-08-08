"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordPageContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to reset password.");
      return;
    }

    setMessage(data.message ?? "Password reset successful.");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 p-4">
          <Image
            src="/assets/GONAA FARMS LOGO.jpeg"
            alt="Farmer's Market"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Set a new password for your account.
        </p>

        {!token ? (
          <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Reset token is missing. Open this page from your email link.
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                required
              />
            </div>

            {message && <p className="text-sm text-green-700">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Resetting password..." : "Reset password"}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-sm text-gray-600">Loading...</div>}
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
