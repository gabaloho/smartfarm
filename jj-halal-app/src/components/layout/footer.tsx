import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail } from "lucide-react";

const EXPLORE_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/shops", label: "Shops" },
  { href: "/flash-sales", label: "Flash Deals" },
  { href: "/offers", label: "Coupons & Offers" },
];

const SUPPORT_LINKS = [
  { href: "/help", label: "FAQ & Help" },
  { href: "/contact", label: "Contact Us" },
  { href: "/vendor-refund-policies", label: "Vendor Refund Policy" },
  { href: "/customer-refund-policies", label: "Customer Refund Policy" },
];

const INFO_LINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/about", label: "About Us" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/assets/jj-logo.png"
                alt="JJ HALAL FARMS LTD."
                width={130}
                height={44}
                className="h-11 w-auto object-contain brightness-0 invert"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fresh, certified halal groceries delivered straight from our farm to your table.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:08094171618" className="flex items-center gap-2 hover:text-green-400">
                <Phone size={14} />
                08094171618
              </a>
              <a href="mailto:info@jjhalalfarms.com" className="flex items-center gap-2 hover:text-green-400">
                <Mail size={14} />
                info@jjhalalfarms.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-400">
                  Plot No 168714 ZUMO ROAD RIGASA KADUNA
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-xs font-semibold">
                FB
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-xs font-semibold">
                IG
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-xs font-semibold">
                X
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Information</h3>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Vendor?</p>
              <Link
                href="/auth/register?type=vendor"
                className="inline-block px-4 py-2 bg-green-700 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} JJ HALAL FARMS LTD. All rights reserved.</p>
          <p>Certified Halal Products</p>
        </div>
      </div>
    </footer>
  );
}
