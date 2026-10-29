import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PATH = "/admin";
const VENDOR_PATH = "/vendor";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const role = token?.role as string | undefined;

  if (pathname.startsWith(ADMIN_PATH)) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  if (pathname.startsWith(VENDOR_PATH)) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (role !== "VENDOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
