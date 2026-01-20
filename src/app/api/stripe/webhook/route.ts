export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler - Activates Pro Subscriptions
 *
 * CRITICAL: This route MUST use raw body text (not JSON) for signature verification.
 * Why? Stripe's webhook signature is computed from the raw request body.
 * If Next.js parses the body as JSON first, the signature won't match.
 *
 * Local Development Setup:
 * 1. Install: brew install stripe/stripe-cli/stripe
 * 2. Login: stripe login
 * 3. Forward: stripe listen --forward-to localhost:3000/api/stripe/webhook
 * 4. Copy the webhook secret (whsec_...) to .env.local
 */

// Force Node.js runtime (required for raw body access)

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received");

  // Step 1: Read raw body (REQUIRED for signature verification)
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ No signature in webhook request");
    logger.error("Webhook error: No signature provided");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Step 2: Verify Stripe signature
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    console.log("✅ Signature verified");
  } catch (err) {
    console.error("❌ Signature verification failed:", err);
    logger.error("Webhook signature verification failed", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Step 3: Log event type (CRITICAL for debugging)
  console.log("📦 Event type:", event.type);
  logger.info("Webhook event received", { eventType: event.type });

  // Step 4: Process the event
  try {
    switch (event.type) {
      // PRIMARY ACTIVATION EVENT
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Log all relevant session data
        console.log("🛒 Checkout completed:");
        console.log("  - Session ID:", session.id);
        console.log("  - Customer ID:", session.customer);
        console.log("  - Customer email:", session.customer_details?.email);
        console.log("  - Subscription ID:", session.subscription);
        console.log("  - Metadata:", session.metadata);

        logger.info("Processing checkout.session.completed", {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_details?.email,
          subscriptionId: session.subscription,
          metadata: session.metadata,
        });

        // Find user using metadata.userId (BEST method)
        let user = null;
        let lookupMethod = "";

        // Method A: metadata.userId (BEST - set in checkout creation)
        if (session.metadata?.userId) {
          console.log("🔍 Looking up user by metadata.userId:", session.metadata.userId);
          user = await prisma.user.findUnique({
            where: { id: session.metadata.userId },
          });
          if (user) {
            lookupMethod = "metadata.userId";
            console.log("✅ Found user via metadata.userId:", user.email);
          } else {
            console.log("⚠️ metadata.userId provided but user not found:", session.metadata.userId);
          }
        }

        // Method B: customer_details.email (fallback)
        if (!user && session.customer_details?.email) {
          console.log("🔍 Looking up user by email:", session.customer_details.email);
          user = await prisma.user.findUnique({
            where: { email: session.customer_details.email },
          });
          if (user) {
            lookupMethod = "customer_details.email";
            console.log("✅ Found user via email:", user.email);
          } else {
            console.log("⚠️ Email provided but user not found:", session.customer_details.email);
          }
        }

        // Method C: stripeCustomerId (last resort)
        if (!user && session.customer) {
          console.log("🔍 Looking up user by stripeCustomerId:", session.customer);
          user = await prisma.user.findUnique({
            where: { stripeCustomerId: session.customer as string },
          });
          if (user) {
            lookupMethod = "stripeCustomerId";
            console.log("✅ Found user via stripeCustomerId:", user.email);
          } else {
            console.log("⚠️ Customer ID provided but user not found:", session.customer);
          }
        }

        // User not found - log error and exit
        if (!user) {
          console.error("❌ CRITICAL: User not found for checkout session");
          console.error("   Tried:");
          console.error("   - metadata.userId:", session.metadata?.userId || "not provided");
          console.error("   - customer_details.email:", session.customer_details?.email || "not provided");
          console.error("   - stripeCustomerId:", session.customer || "not provided");

          logger.error("User not found for checkout session", undefined, {
            sessionId: session.id,
            metadata: session.metadata,
            customerEmail: session.customer_details?.email,
            customerId: session.customer,
          });

          return NextResponse.json({ received: true, error: "User not found" });
        }

        console.log("👤 User found via:", lookupMethod);
        console.log("   User ID:", user.id);
        console.log("   Email:", user.email);
        console.log("   Current isPro:", user.isPro);

        // Check if already Pro (idempotency)
        if (user.isPro) {
          console.log("ℹ️ User is already Pro, skipping update");
          logger.info("User already Pro, skipping", { userId: user.id });
          return NextResponse.json({ received: true, alreadyPro: true });
        }

        // Update user to Pro
        console.log("💎 Upgrading user to Pro...");
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            isPro: true,
            stripeCustomerId: session.customer as string,
          },
        });

        console.log("✅ User upgraded successfully!");
        console.log("   isPro:", updatedUser.isPro);
        console.log("   stripeCustomerId:", updatedUser.stripeCustomerId);

        logger.info("User upgraded to Pro", {
          userId: user.id,
          email: user.email,
          lookupMethod,
        });

        // Create subscription record if subscription ID exists
        if (session.subscription) {
          console.log("📝 Creating subscription record...");
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

            await prisma.subscription.upsert({
              where: { stripeSubscriptionId: session.subscription as string },
              create: {
                userId: user.id,
                stripeSubscriptionId: session.subscription as string,
                stripeCustomerId: session.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              },
              update: {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              },
            });

            console.log("✅ Subscription record created");
          } catch (subError) {
            console.error("⚠️ Failed to create subscription record:", subError);
            logger.error("Failed to create subscription record", subError);
            // Don't fail the whole webhook - user is already Pro
          }
        }

        break;
      }

      // SECONDARY ACTIVATION EVENT
      case "customer.subscription.created": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;

        console.log("📋 Subscription created:");
        console.log("  - Subscription ID:", subscription.id);
        console.log("  - Customer ID:", subscription.customer);
        console.log("  - Status:", subscription.status);

        // Only activate for active/trialing subscriptions
        if (subscription.status !== "active" && subscription.status !== "trialing") {
          console.log("ℹ️ Subscription not active, skipping");
          return NextResponse.json({ received: true });
        }

        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (!user) {
          console.error("❌ User not found for subscription");
          logger.error("User not found for subscription", undefined, {
            customerId: subscription.customer,
          });
          return NextResponse.json({ received: true, error: "User not found" });
        }

        console.log("👤 Found user:", user.email);

        // Upgrade to Pro if not already
        if (!user.isPro) {
          console.log("💎 Upgrading user to Pro...");
          await prisma.user.update({
            where: { id: user.id },
            data: { isPro: true },
          });
          console.log("✅ User upgraded");
        } else {
          console.log("ℹ️ User already Pro");
        }

        break;
      }

      // RENEWAL EVENT (optional but good to have)
      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;

        console.log("💰 Invoice paid:");
        console.log("  - Invoice ID:", invoice.id);
        console.log("  - Customer ID:", invoice.customer);
        console.log("  - Subscription ID:", invoice.subscription);

        // Skip if no subscription
        if (!invoice.subscription) {
          console.log("ℹ️ No subscription, skipping");
          return NextResponse.json({ received: true });
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        });

        if (!user) {
          console.log("⚠️ User not found for invoice");
          return NextResponse.json({ received: true, error: "User not found" });
        }

        console.log("👤 Found user:", user.email);

        // Ensure Pro status
        if (!user.isPro) {
          console.log("💎 Activating Pro (from renewal)...");
          await prisma.user.update({
            where: { id: user.id },
            data: { isPro: true },
          });
          console.log("✅ Pro activated");
        } else {
          console.log("ℹ️ Pro already active");
        }

        break;
      }

      // SUBSCRIPTION UPDATED
      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;

        console.log("🔄 Subscription updated:");
        console.log("  - Status:", subscription.status);

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (!user) {
          console.log("⚠️ User not found");
          return NextResponse.json({ received: true });
        }

        // Update Pro status based on subscription state
        const shouldBePro = subscription.status === "active" || subscription.status === "trialing";

        if (user.isPro !== shouldBePro) {
          console.log(`💎 Updating Pro status to: ${shouldBePro}`);
          await prisma.user.update({
            where: { id: user.id },
            data: { isPro: shouldBePro },
          });
          console.log("✅ Pro status updated");
        }

        break;
      }

      // SUBSCRIPTION CANCELLED
      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;

        console.log("❌ Subscription deleted");

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user && user.isPro) {
          console.log("💔 Removing Pro status...");
          await prisma.user.update({
            where: { id: user.id },
            data: { isPro: false },
          });
          console.log("✅ Pro status removed");
        }

        break;
      }

      default:
        console.log("ℹ️ Unhandled event type, ignoring");
        logger.debug("Unhandled webhook event type", { eventType: event.type });
    }

    // Always return 200 to acknowledge receipt
    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    // Log error but still return 200 to prevent endless retries
    console.error("❌ Webhook processing error:", error);
    logger.error("Webhook processing error", error, { eventType: event.type });
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}
