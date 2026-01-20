import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * Stripe Checkout Session Creation
 *
 * CRITICAL: This route MUST pass metadata.userId to the checkout session.
 * Why? The webhook uses metadata.userId to map Stripe events back to our database users.
 * Without it, the webhook cannot reliably activate Pro status.
 */

export async function POST(req: NextRequest) {
  try {
    console.log("🛒 Creating checkout session...");

    const sessionUser = await requireAuth();
    console.log("👤 User authenticated:", sessionUser.id);

    // Fetch full user from database to get stripeCustomerId
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      console.error("❌ User not found:", sessionUser.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("📧 User email:", user.email);
    console.log("💳 Existing Stripe customer ID:", user.stripeCustomerId || "none");

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      console.log("🆕 Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
      console.log("✅ Stripe customer created:", stripeCustomerId);

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
      console.log("✅ User updated with stripeCustomerId");
    } else {
      console.log("✓ Using existing Stripe customer:", stripeCustomerId);
    }

    // Get APP_URL from env or construct from request
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    console.log("🔧 Creating checkout session with:");
    console.log("  - Customer ID:", stripeCustomerId);
    console.log("  - User ID (metadata):", user.id);
    console.log("  - Email:", user.email);
    console.log("  - Price ID:", STRIPE_PRICE_ID);

    // Create Stripe Checkout session
    // IMPORTANT: metadata.userId is CRITICAL for webhook user mapping
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata: {
        userId: user.id, // CRITICAL: Used by webhook to find user
      },
    });

    console.log("✅ Checkout session created:", session.id);
    console.log("🔗 Checkout URL:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    logger.error("Checkout error", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
