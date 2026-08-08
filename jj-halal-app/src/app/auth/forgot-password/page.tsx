"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    setIsLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to process request.");
      return;
    }

    setMessage(
      data.message ??
        "If this email exists, a password reset link has been sent.",
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your account email and we will send you a reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
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

          {message && <p className="text-sm text-green-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending link..." : "Send reset link"}
          </button>
        </form>

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
