import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

// @ts-expect-error - NextAuth v5 types may not perfectly align with our v4-style config
const { auth: getServerSession } = NextAuth(authOptions);

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requirePro() {
  const user = await requireAuth();
  if (!user.isPro) {
    throw new Error("Pro subscription required");
  }
  return user;
}

// Also export the auth function directly for convenience
export { getServerSession as auth };
