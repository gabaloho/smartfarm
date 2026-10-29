"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8 text-sm text-gray-600">Loading account...</div>;
  }

  if (!session?.user) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to view your account details.</p>
          <Link
            href="/auth/login?callbackUrl=/account"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const firstName = session.user.name?.split(" ")[0] ?? "Customer";
  const isEmailVerified = Boolean(session.user.emailVerified);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image
              src="/assets/gue-smart-farms-logo.svg"
              alt="Gue Smart Farms Limited"
              width={126}
              height={42}
              className="h-9 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="mt-2 text-xs text-gray-600">Manage profile, orders, and account security settings.</p>
          </div>
          <Image src="/assets/promo-popup.png" alt="Promo" width={190} height={96} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {firstName}</h1>
                <p className="mt-1 text-sm text-gray-600">This is your account overview.</p>
              </div>
              <span
                className={
                  isEmailVerified
                    ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                    : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                }
              >
                {isEmailVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Full name</p>
                <p className="mt-1 font-semibold text-gray-900">{session.user.name}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                <p className="mt-1 font-semibold text-gray-900 break-all">{session.user.email}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Account role</p>
                <p className="mt-1 font-semibold text-gray-900">{session.user.role}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Security</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {session.user.twoFactorEnabled ? "2FA enabled" : "2FA not enabled"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/orders"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                View orders
              </Link>
              {session.user.role === "VENDOR" && (
                <Link
                  href="/vendor"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Vendor dashboard
                </Link>
              )}
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Admin panel
                </Link>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                href="/products"
                className="block rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Continue shopping
              </Link>
              <Link
                href="/auth/forgot-password"
                className="block rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Reset password
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
