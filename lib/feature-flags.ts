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
  enableCustomCursor: false,

  /**
   * Enable neon glow effect on hero section name
   * When true: "Ian Cates" has animated neon glow with flicker effects
   * When false: Standard white text without glow effects
   */
  enableHeroNeonName: false,

  /**
   * Enable animated text effects on page headings and descriptions
   * When true: Text elements animate word-by-word with blur/slide/fade effects
   * When false: Text appears normally without animation effects
   */
  enableTypewriterEffect: true,
} as const;

// Type for feature flag keys
export type FeatureFlagKey = keyof typeof featureFlags;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}

