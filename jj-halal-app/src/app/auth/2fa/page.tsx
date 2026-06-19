"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

export default function TwoFactorPage() {
  const { data: session, status } = useSession();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  if (status === "loading") {
    return <div className="p-8 text-sm text-gray-600">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Two-factor authentication</h1>
          <p className="mt-2 text-sm text-gray-600">You need to sign in first to manage 2FA.</p>
          <Link
            href="/auth/login"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  async function onSetup() {
    setSetupError(null);
    setSuccess(null);
    setIsSettingUp(true);

    const response = await fetch("/api/auth/2fa/setup", { method: "POST" });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      secret?: string;
      qrCode?: string;
    };

    setIsSettingUp(false);

    if (!response.ok) {
      setSetupError(data.error ?? "Failed to initialize 2FA.");
      return;
    }

    setSecret(data.secret ?? null);
    setQrCode(data.qrCode ?? null);
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifyError(null);
    setSuccess(null);
    setIsVerifying(true);

    const response = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      ok?: boolean;
    };

    setIsVerifying(false);

    if (!response.ok || !data.ok) {
      setVerifyError(data.error ?? "Invalid code.");
      return;
    }

    setSuccess("2FA has been enabled on your account.");
    setToken("");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 flex items-center justify-between gap-3">
          <Image src="/assets/JJ HALAL FARMS LOGO.jpeg" alt="JJ HALAL FARMS LTD." width={130} height={44} className="h-10 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
          <Image src="/assets/JJ HALAL FARMS.jpeg" alt="Brand banner" width={180} height={70} className="hidden sm:block h-14 w-28 rounded-md object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Two-factor authentication (2FA)</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add an authenticator app for stronger account security.
        </p>

        <button
          onClick={onSetup}
          disabled={isSettingUp}
          className="mt-5 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSettingUp ? "Generating setup..." : "Generate 2FA setup"}
        </button>

        {setupError && <p className="mt-3 text-sm text-red-600">{setupError}</p>}

        {qrCode && (
          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900">Step 1: Scan QR code</h2>
            <p className="mt-1 text-sm text-gray-600">Use Google Authenticator, Authy, or Microsoft Authenticator.</p>
            <div className="mt-4 inline-block rounded-lg border border-gray-200 p-2 bg-white">
              <Image src={qrCode} alt="2FA QR code" width={180} height={180} />
            </div>
            {secret && (
              <p className="mt-3 text-xs text-gray-600 break-all">
                Backup secret: <span className="font-mono">{secret}</span>
              </p>
            )}
          </div>
        )}

        {secret && (
          <form onSubmit={onVerify} className="mt-5 rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900">Step 2: Verify your code</h2>
            <p className="mt-1 text-sm text-gray-600">Enter the 6-digit code from your authenticator app.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                placeholder="123456"
                maxLength={8}
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? "Verifying..." : "Enable 2FA"}
              </button>
            </div>
            {verifyError && <p className="mt-3 text-sm text-red-600">{verifyError}</p>}
            {success && <p className="mt-3 text-sm text-green-700">{success}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
