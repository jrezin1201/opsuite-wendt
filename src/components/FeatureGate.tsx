/**
 * FeatureGate Component
 *
 * Conditionally renders children based on feature flags in site-config.ts
 *
 * Usage:
 * <FeatureGate featureId="ai-studio">
 *   <AIComponent />
 * </FeatureGate>
 */

import { type FeatureId, isFeatureActive } from "@/config/site-config";

interface FeatureGateProps {
  featureId: FeatureId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  featureId,
  children,
  fallback = null,
}: FeatureGateProps) {
  const isActive = isFeatureActive(featureId);

  if (!isActive) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook version for conditional logic in components
 */
export function useFeature(featureId: FeatureId): boolean {
  return isFeatureActive(featureId);
}

/**
 * Multiple feature gate - renders if ANY feature is active
 */
interface MultiFeatureGateProps {
  featureIds: FeatureId[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, requires ALL features to be active
}

export function MultiFeatureGate({
  featureIds,
  children,
  fallback = null,
  requireAll = false,
}: MultiFeatureGateProps) {
  const isActive = requireAll
    ? featureIds.every((id) => isFeatureActive(id))
    : featureIds.some((id) => isFeatureActive(id));

  if (!isActive) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
