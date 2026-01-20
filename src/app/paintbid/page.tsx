/**
 * Backward Compatibility Route - Redirects to Root
 *
 * This route redirects /paintbid to the root (/) where the app now lives
 */

import { redirect } from "next/navigation";

export default function PaintBidRedirect() {
  redirect("/");
}
