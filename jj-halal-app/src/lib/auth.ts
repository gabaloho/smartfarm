import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { verifyTOTP } from "@/lib/totp";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    twoFactorEnabled: boolean;
    emailVerified: Date | null;
    phoneVerified: Date | null;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      twoFactorEnabled: boolean;
      emailVerified: Date | null;
      phoneVerified: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    twoFactorEnabled?: boolean;
    emailVerified?: Date | null;
    phoneVerified?: Date | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.twoFactorEnabled = user.twoFactorEnabled;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.phoneVerified = token.phoneVerified as Date | null;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totp: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;
        if (!user.isActive) return null;
        if (requireEmailVerification && !user.emailVerified) return null;
        if (user.twoFactorEnabled) {
          const totp = String(credentials.totp ?? "").trim();
          if (!totp || !user.twoFactorSecret || !verifyTOTP(user.twoFactorSecret, totp)) {
            return null;
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? "",
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        };
      },
    }),
  ],
});
