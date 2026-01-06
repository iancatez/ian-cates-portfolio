/**
 * Styling constants for consistent design across the application
 */

export const TRANSITION_DURATION = {
  fast: "150ms",
  medium: "300ms",
  slow: "500ms",
} as const;

export const BORDER_RADIUS = {
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
} as const;

export const SHADOW_GLOW = {
  primary: "0_0_15px_hsl(142_76%_55%_/_0.7),0_0_30px_hsl(142_76%_55%_/_0.5),0_0_45px_hsl(142_76%_55%_/_0.3)",
  primaryHover: "0_0_20px_hsl(142_76%_55%_/_0.8),0_0_40px_hsl(142_76%_55%_/_0.6),0_0_60px_hsl(142_76%_55%_/_0.4)",
  destructive: "0_0_15px_hsl(0_62%_30%_/_0.7),0_0_30px_hsl(0_62%_30%_/_0.5)",
} as const;

