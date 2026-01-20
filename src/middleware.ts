import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Production domain redirect (optional)
  // Configure NEXT_PUBLIC_APP_URL in .env for production domain redirects
  const productionDomain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "");
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const isVercelPreview = host.includes("vercel.app");

  // Redirect to canonical domain in production if configured
  if (
    productionDomain &&
    host !== productionDomain &&
    !isLocalhost &&
    !isVercelPreview &&
    process.env.NODE_ENV === "production"
  ) {
    url.hostname = productionDomain;
    url.protocol = "https:";
    return NextResponse.redirect(url, 307); // 307 Temporary - prevents aggressive caching
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
