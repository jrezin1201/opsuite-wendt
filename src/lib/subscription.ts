import type { Session } from "next-auth";

export type SubscriptionPlan = 'free' | 'pro';

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  isPro: boolean;
  isFree: boolean;
}

/**
 * Get subscription status from user session
 * @param session - NextAuth session object
 * @returns Subscription status with plan type and boolean flags
 */
export function getSubscriptionStatus(session: Session | null): SubscriptionStatus {
  const isPro = session?.user?.isPro || false;
  const plan: SubscriptionPlan = isPro ? 'pro' : 'free';

  return {
    plan,
    isPro,
    isFree: !isPro,
  };
}

/**
 * Check if user can access a specific feature based on their subscription
 * @param feature - Feature name to check
 * @param session - NextAuth session object
 * @returns true if user can access the feature
 */
export function canUseFeature(feature: string, session: Session | null): boolean {
  // Features that require Pro subscription
  const proFeatures = [
    'export_pdf',        // PDF export via ExportDrawer
    'export_excel',      // Excel export via ExportDrawer
    'sync_devices',      // Cross-device sync
    'priority_support',  // Priority customer support
  ];

  const { isPro } = getSubscriptionStatus(session);

  // If it's a Pro feature, require Pro subscription
  if (proFeatures.includes(feature)) {
    return isPro;
  }

  // All other features are free
  return true;
}

/**
 * Check if user has access to advanced export features
 * Note: Basic export (browser print, copy summary) is free via ExportMenu
 * @param session - NextAuth session object
 * @returns true if user can access Pro export features (PDF/Excel via ExportDrawer)
 */
export function canExportPro(session: Session | null): boolean {
  return canUseFeature('export_pdf', session);
}

/**
 * Check if user has access to device sync
 * @param session - NextAuth session object
 * @returns true if user can sync across devices
 */
export function canSyncDevices(session: Session | null): boolean {
  return canUseFeature('sync_devices', session);
}
