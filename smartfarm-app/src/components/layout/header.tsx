"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Menu, User, LogOut, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { MobileDrawer } from "./mobile-drawer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/livestock", label: "Livestock" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/auctions", label: "Auctions" },
  { href: "/shops", label: "Shops" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const syncItemCount = () => {
      setItemCount(useCartStore.getState().getItemCount());
    };

    syncItemCount();
    const unsubscribe = useCartStore.subscribe(syncItemCount);

    return unsubscribe;
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Burger (mobile) */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand */}
            <Link href="/" className="relative flex-shrink-0 h-11 sm:h-12 w-44 sm:w-52 overflow-hidden rounded-md">
              <Image
                src="/assets/gue-smart-farms-logo.svg"
                alt="Gue Smart Farms Limited"
                fill
                sizes="(min-width: 640px) 208px, 176px"
                className="object-cover"
                style={{ objectPosition: "center" }}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Link
                href="/search"
                className="hidden sm:flex p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-md"
                aria-label="Search"
              >
                <Search size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-md"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Become a Seller */}
              <Link
                href="/auth/register/seller"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-green-700 text-white text-xs font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Become a Seller
              </Link>

              {/* User menu */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {session.user.role === "VENDOR" && (
                        <Link
                          href="/vendor"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Vendor Dashboard
                        </Link>
                      )}
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navLinks={NAV_LINKS}
        session={session}
      />
    </>
  );
}
