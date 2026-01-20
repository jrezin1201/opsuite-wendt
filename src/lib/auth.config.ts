import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

// Keep as a plain object to avoid NextAuthOptions type mismatch across v4/v5 surfaces.
export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  // Turn on debug so Vercel logs show the real root cause
  debug: true,

  logger: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(code: any, metadata: any) {
      console.error("[auth][error]", JSON.stringify({ code, metadata }, null, 2));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(code: any) {
      console.warn("[auth][warn]", code);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(code: any, metadata: any) {
      console.log("[auth][debug]", JSON.stringify({ code, metadata }, null, 2));
    },
  },

  // For Auth.js / NextAuth v5 behind Vercel/proxies.
  trustHost: true,

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.isPro = user.isPro ?? false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "database" as const,
  },
};
