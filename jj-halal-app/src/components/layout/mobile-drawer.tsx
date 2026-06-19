"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Phone, MapPin, ChevronRight } from "lucide-react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "eggs", name: "Eggs", icon: "🥚" },
  { slug: "chicken", name: "Chicken", icon: "🐔" },
  { slug: "livestock", name: "Livestock", icon: "🐄" },
  { slug: "marketplace", name: "Marketplace", icon: "🛒" },
  { slug: "auctions", name: "Auctions", icon: "🔨" },
  { slug: "delivery", name: "Delivery", icon: "🚚" },
];

const EXTRA_LINKS = [
  { href: "/livestock", label: "Livestock Sales" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/auctions", label: "Auctions" },
  { href: "/flash-sales", label: "Flash Sale" },
  { href: "/manufacturers", label: "Manufacturers / Publishers" },
  { href: "/authors", label: "Authors" },
  { href: "/help", label: "FAQ" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/customer-refund-policies", label: "Customer Refund Policy" },
  { href: "/vendor-refund-policies", label: "Vendor Refund Policy" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  session: Session | null;
}

export function MobileDrawer({ open, onClose, navLinks, session }: MobileDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[320px] max-w-full bg-white shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-green-700">
          <Link href="/" onClick={onClose} className="text-sm font-extrabold tracking-wide text-white">
            JJ HALAL FARMS LTD.
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-white hover:bg-green-600"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Auth section */}
          {session ? (
            <div className="p-4 bg-green-50 border-b">
              <p className="text-sm font-semibold text-gray-800">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border-b flex gap-2">
              <Link
                href="/auth/login"
                className="flex-1 text-center py-2 bg-green-700 text-white text-sm rounded-md font-medium"
                onClick={onClose}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="flex-1 text-center py-2 border border-green-700 text-green-700 text-sm rounded-md font-medium"
                onClick={onClose}
              >
                Register
              </Link>
            </div>
          )}

          {/* Primary nav */}
          <nav className="py-2 border-b">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                {link.label}
                <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </nav>

          {/* Extra links */}
          <nav className="py-2 border-b">
            {EXTRA_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                {link.label}
                <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </nav>

          {/* Categories */}
          <div className="py-3">
            <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Categories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact footer */}
        <div className="p-4 bg-green-700 text-white text-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <a href="tel:08094171618">08094171618</a>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span className="text-xs">AT19, Jada Road, PRP, Kaduna</span>
          </div>
        </div>
      </div>
    </>
  );
}
