import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Ensure NEXTAUTH_URL and AUTH_TRUST_HOST are properly handled in production / Vercel
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  // Instruct NextAuth to trust proxy headers from Vercel
  process.env.AUTH_TRUST_HOST = "true";

  // If NEXTAUTH_URL was mistakenly set to localhost in Vercel environment variables,
  // sanitize it using Vercel's automatic production deployment URL
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelDomain && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))) {
    process.env.NEXTAUTH_URL = `https://${vercelDomain}`;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.users.findUnique({
          where: { email: credentials.email.toLowerCase().trim() }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 1. If relative URL (e.g. "/" or "/login"), return as relative so browser stays on current domain
      if (url.startsWith("/")) {
        return url;
      }

      // 2. Resolve environment-aware base URL
      let effectiveBase = baseUrl;
      if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
        if (vercelDomain && (!effectiveBase || effectiveBase.includes("localhost"))) {
          effectiveBase = `https://${vercelDomain}`;
        }
      }

      // 3. Allow same-origin redirects
      try {
        const targetUrl = new URL(url);
        const baseObj = new URL(effectiveBase);
        if (targetUrl.origin === baseObj.origin) {
          return url;
        }
      } catch {
        // Invalid URL fallback
      }

      // 4. Default safe relative destination
      return "/";
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_demo"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
