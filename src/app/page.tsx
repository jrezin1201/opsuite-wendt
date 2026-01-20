/**
 * Landing Page Route - Redirects to PaintBid POC
 *
 * Entry point redirects to the main PaintBid application
 */

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/paintbid");
}
