import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Feedback API Route
 *
 * Accepts feedback from both authenticated and anonymous users.
 * Stores feedback with useful metadata for the builder.
 */

export async function POST(req: NextRequest) {
  try {
    console.log("💬 Feedback submission received");

    // Parse request body
    const body = await req.json();
    const { message, pathname } = body;

    // Validation
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be less than 2000 characters" },
        { status: 400 }
      );
    }

    if (!pathname || typeof pathname !== "string") {
      return NextResponse.json(
        { error: "Pathname is required" },
        { status: 400 }
      );
    }

    // Get current user (optional - returns null if not authenticated)
    const user = await getCurrentUser();
    console.log("👤 User:", user ? user.id : "anonymous");

    // Extract user agent
    const userAgent = req.headers.get("user-agent") || undefined;

    // Create feedback entry
    const feedback = await prisma.feedback.create({
      data: {
        message,
        pathname,
        userId: user?.id || null,
        userEmail: user?.email || null,
        userAgent,
        isPro: user?.isPro || false,
      },
    });

    console.log("✅ Feedback saved:", feedback.id);

    return NextResponse.json({ ok: true, id: feedback.id });
  } catch (error) {
    console.error("❌ Feedback submission error:", error);
    const message = error instanceof Error ? error.message : "Failed to submit feedback";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
