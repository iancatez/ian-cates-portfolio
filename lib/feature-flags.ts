/**
 * Feature flags for controlling experimental features
 * 
 * These can be toggled to enable/disable features across the app.
 * In production, these could be driven by environment variables or a feature flag service.
 */

export const featureFlags = {
  /**
   * Enable custom fluid cursor effect
   * When true: Shows the WebGL fluid cursor trail and custom white dot cursor
   * When false: Uses the browser's default cursor
   */
  enableCustomCursor: true,
} as const;

// Type for feature flag keys
export type FeatureFlagKey = keyof typeof featureFlags;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}

