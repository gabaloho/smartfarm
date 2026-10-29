"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SELLER_CATEGORIES } from "@/lib/seller-categories";

type RegisterForm = {
  name: string;
  email: string;
  role: "CUSTOMER" | "VENDOR";
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: "PERSONAL" | "INSTITUTIONAL";
  businessName: string;
  businessType: "FARM" | "STORE" | "EATERY" | "RESTAURANT" | "OTHER";
  brandName: string;
  sellerCategory: string;
  cacNumber: string;
  sellerAddress: string;
  sellerBio: string;
};

type RegisterFormProps = {
  mode: "buyer" | "seller";
};

export default function RegisterForm({ mode }: RegisterFormProps) {
  const isSellerMode = mode === "seller";

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    role: isSellerMode ? "VENDOR" : "CUSTOMER",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "PERSONAL",
    businessName: "",
    businessType: "OTHER",
    brandName: "",
    sellerCategory: "",
    cacNumber: "",
    sellerAddress: "",
    sellerBio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const showBusinessUi = isSellerMode;
  const cacRequiredForBusiness =
    showBusinessUi &&
    form.accountType === "INSTITUTIONAL" &&
    (form.businessType === "EATERY" || form.businessType === "RESTAURANT");

  function normalizeCacInput(value: string, businessType: RegisterForm["businessType"]) {
    const compact = value.replace(/\s+/g, "").toUpperCase();
    if (!compact) return "";

    if (businessType === "EATERY" && !compact.startsWith("BN")) {
      return `BN${compact.replace(/^(BN|RC)/, "")}`;
    }

    if (businessType === "RESTAURANT" && !compact.startsWith("RC")) {
      return `RC${compact.replace(/^(BN|RC)/, "")}`;
    }

    return compact;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const payload = {
      ...form,
      institutionName: form.businessName,
      institutionType: form.businessType,
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      verificationToken?: string;
      details?: Record<string, string[] | undefined>;
    };

    setIsLoading(false);

    if (!response.ok) {
      const firstFieldError = data.details
        ? Object.values(data.details).find((messages) => Array.isArray(messages) && messages.length > 0)?.[0]
        : null;
      setError(firstFieldError ?? data.error ?? "Registration failed.");
      return;
    }

    setSuccess(data.message ?? "Account created successfully. Please check your email to verify your account.");
    setForm((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 flex items-center justify-between gap-3">
          <div>
            <Image
              src="/assets/gue-smart-farms-logo.svg"
              alt="Gue Smart Farms Limited"
              width={130}
              height={44}
              className="h-10 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
            />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Farmer&apos;s Market Platform</p>
            <p className="mt-1 text-xs text-gray-600">Create your account to buy, sell, and join auctions.</p>
          </div>
          <Image src="/assets/daily-needs-hero.jpg" alt="Fresh produce" width={120} height={90} className="hidden sm:block h-16 w-24 rounded-lg object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-600">
          {isSellerMode
            ? "Seller signup with verification and store profile setup."
            : "Quick buyer signup for shopping and checkout."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            {isSellerMode ? (
              <>
                Opening a store? Complete seller onboarding here. Need a normal shopping account?{" "}
                <Link href="/auth/register" className="font-semibold text-green-700 hover:text-green-800">
                  Create buyer account
                </Link>
                .
              </>
            ) : (
              <>
                Buying only? This page is for customer accounts. Want to sell on the platform?{" "}
                <Link href="/auth/register/seller" className="font-semibold text-green-700 hover:text-green-800">
                  Become a seller
                </Link>
                .
              </>
            )}
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {isSellerMode
                ? "Use a reachable phone for order coordination and store verification."
                : "Buyers register with a simple personal account for shopping and order tracking."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                required
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-gray-500">
            Password must include at least 8 characters, one uppercase letter, one number, and one special character.
          </p>

          {showBusinessUi && (
          <div>
            <label htmlFor="accountType" className="mb-1.5 block text-sm font-medium text-gray-700">
              Account type
            </label>
            <select
              id="accountType"
              value={form.accountType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  accountType: e.target.value as RegisterForm["accountType"],
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            >
              <option value="PERSONAL">Individual</option>
              <option value="INSTITUTIONAL">Business</option>
            </select>
          </div>
          )}

          {isSellerMode && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-3">
              <h2 className="text-sm font-semibold text-emerald-900">Seller details</h2>
              <div>
                <label htmlFor="brandName" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Brand name
                </label>
                <input
                  id="brandName"
                  value={form.brandName}
                  onChange={(e) => setForm((prev) => ({ ...prev, brandName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  placeholder="e.g. Green Valley Farms"
                  required
                />
              </div>
              <div>
                <label htmlFor="sellerCategory" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Seller category
                </label>
                <select
                  id="sellerCategory"
                  value={form.sellerCategory}
                  onChange={(e) => setForm((prev) => ({ ...prev, sellerCategory: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  required
                >
                  <option value="">Select what you sell</option>
                  {SELLER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sellerAddress" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Business address (optional)
                  </label>
                  <input
                    id="sellerAddress"
                    value={form.sellerAddress}
                    onChange={(e) => setForm((prev) => ({ ...prev, sellerAddress: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    placeholder="Area, city"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="sellerBio" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Seller profile details (optional)
                </label>
                <textarea
                  id="sellerBio"
                  value={form.sellerBio}
                  onChange={(e) => setForm((prev) => ({ ...prev, sellerBio: e.target.value }))}
                  className="min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  placeholder="Tell buyers what you sell and your delivery coverage"
                />
              </div>
            </div>
          )}

          {showBusinessUi && form.accountType === "INSTITUTIONAL" && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
              <p className="text-xs text-gray-600">
                Help us verify your business account by selecting the legal structure that matches your operation.
              </p>
              <div>
                <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business name
                </label>
                <input
                  id="businessName"
                  value={form.businessName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, businessName: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  placeholder="Registered name or trading name"
                  required
                />
              </div>
              <div>
                <label htmlFor="cacNumber" className="mb-1.5 block text-sm font-medium text-gray-700">
                  CAC number {cacRequiredForBusiness ? "(required)" : "(optional)"}
                </label>
                <input
                  id="cacNumber"
                  value={form.cacNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      cacNumber: normalizeCacInput(e.target.value, prev.businessType),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  placeholder={
                    form.businessType === "EATERY"
                      ? "e.g. BN1234567"
                      : form.businessType === "RESTAURANT"
                        ? "e.g. RC1234567"
                        : "e.g. BN1234567 or RC1234567"
                  }
                  required={cacRequiredForBusiness}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Required for Registered business name (CAC BN) and Limited liability company (CAC RC).
                </p>
              </div>
              <div>
                <label htmlFor="businessType" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business legal type
                </label>
                <select
                  id="businessType"
                  value={form.businessType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      businessType: e.target.value as RegisterForm["businessType"],
                      cacNumber: normalizeCacInput(prev.cacNumber, e.target.value as RegisterForm["businessType"]),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                >
                  <option value="FARM">Self-employed (sole proprietor)</option>
                  <option value="STORE">Unregistered business</option>
                  <option value="EATERY">Registered business name (CAC BN)</option>
                  <option value="RESTAURANT">Limited liability company (CAC RC)</option>
                  <option value="OTHER">Other business type</option>
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : isSellerMode ? "Create seller account" : "Create buyer account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-green-700 hover:text-green-800">
            Sign in
          </Link>
        </p>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          <Image src="/assets/gue-smart-farms-banner.svg" alt="Brand banner" width={960} height={240} className="h-24 w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
