import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * Stripe Customer Portal Session Creation
 *
 * Creates a billing portal session so customers can manage their subscription,
 * update payment methods, view invoices, and cancel if needed.
 */

export async function POST(req: NextRequest) {
  try {
    console.log("🏛️ Creating billing portal session...");

    const sessionUser = await requireAuth();
    console.log("👤 User authenticated:", sessionUser.id);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      console.error("❌ User not found:", sessionUser.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // User must have a Stripe customer ID to access portal
    if (!user.stripeCustomerId) {
      console.error("❌ No Stripe customer ID for user:", user.email);
      return NextResponse.json(
        { error: "No subscription found. Please upgrade to Pro first." },
        { status: 400 }
      );
    }

    console.log("💳 Stripe customer ID:", user.stripeCustomerId);

    // Get APP_URL from env or construct from request
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const returnUrl = `${appUrl}/billing`;

    console.log("🔧 Creating portal session with return URL:", returnUrl);

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    console.log("✅ Portal session created:", portalSession.id);
    console.log("🔗 Portal URL:", portalSession.url);

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("❌ Portal creation error:", error);
    logger.error("Portal creation error", error);
    const message = error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
