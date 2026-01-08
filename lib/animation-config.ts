/**
 * Shared configuration for scroll-triggered animations
 * 
 * This configuration ensures animations trigger when elements are closer to the
 * center of the viewport, creating a more intentional and less premature feel.
 */

/**
 * Default animation trigger configuration
 * 
 * - amount: 0.4 means 40% of the element must be visible before triggering
 *   (increased from 0.1/10% to require more visibility)
 * - margin: "-20% 0px" creates a "trigger zone" that's 20% from the top and bottom
 *   of the viewport, effectively requiring elements to be closer to center
 */
export const ANIMATION_TRIGGER_CONFIG = {
  /**
   * Amount of element that must be visible (0-1)
   * 0.4 = 40% of element must be visible
   */
  amount: 0.4,
  
  /**
   * Margin to create a trigger zone closer to viewport center
   * Format: "top right bottom left" or "vertical horizontal"
   * "-10% 0px" means: ignore top 10% and bottom 10% of viewport
   * This effectively requires elements to be in the middle 80% of viewport
   * Reduced from -20% to prevent premature disappearing
   */
  margin: "-10% 0px",
  
  /**
   * Whether animation should trigger only once
   * Set to false to enable reverse animations when scrolling past elements
   */
  triggerOnce: false,
} as const;

/**
 * Alternative configuration for elements that should trigger earlier
 * (e.g., large sections that need to start animating sooner)
 */
export const EARLY_ANIMATION_TRIGGER_CONFIG = {
  amount: 0.3,
  margin: "-10% 0px", // Reduced to prevent premature disappearing
  triggerOnce: false,
} as const;

/**
 * Configuration for elements that should trigger very late
 * (e.g., small elements that should be very centered)
 */
export const LATE_ANIMATION_TRIGGER_CONFIG = {
  amount: 0.5,
  margin: "-25% 0px",
  triggerOnce: false,
} as const;

/**
 * Check if user prefers reduced motion
 * Used to disable animations for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

