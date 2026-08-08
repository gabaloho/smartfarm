import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Farmer's Market",
    template: "%s | Farmer's Market",
  },
  description:
    "Farmer's Market by GONAA FARMS LTD. for farm products, livestock, buyer-seller marketplace listings, and auctions.",
  keywords: [
    "halal",
    "farm",
    "livestock",
    "auction",
    "marketplace",
    "Nigeria",
    "Kaduna",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  icons: {
    icon: "/assets/GONAA FARMS LOGO.jpeg",
    shortcut: "/assets/GONAA FARMS LOGO.jpeg",
    apple: "/assets/GONAA FARMS LOGO.jpeg",
  },
  openGraph: {
    type: "website",
    siteName: "Farmer's Market",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
