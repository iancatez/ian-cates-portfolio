import { useRef, useEffect } from "react";
import { useInView, useAnimation } from "framer-motion";
import { ANIMATION_TRIGGER_CONFIG, prefersReducedMotion } from "@/lib/animation-config";

interface UseScrollAnimationOptions {
  /**
   * Amount of element that must be visible (0-1)
   * Default: 0.4 (40% of element must be visible)
   */
  amount?: number;
  
  /**
   * Margin to create a trigger zone closer to viewport center
   * Format: "top right bottom left" or "vertical horizontal"
   * Default: "-20% 0px" (ignore top/bottom 20% of viewport)
   */
  margin?: string;
  
  /**
   * Whether animation should trigger only once
   * Default: false (enables reverse animations when scrolling past elements)
   */
  triggerOnce?: boolean;
}

/**
 * Hook for scroll-triggered animations
 * 
 * Improved to trigger animations when elements are closer to the center of the viewport,
 * creating a more intentional and less premature feel.
 * 
 * Returns ref to attach to element and animation controls
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { 
    amount = ANIMATION_TRIGGER_CONFIG.amount, 
    margin = ANIMATION_TRIGGER_CONFIG.margin,
    triggerOnce = ANIMATION_TRIGGER_CONFIG.triggerOnce 
  } = options;
  
  const ref = useRef(null);
  
  // Respect prefers-reduced-motion: if enabled, always show content immediately
  const shouldAnimate = !prefersReducedMotion();
  
  const isInView = useInView(ref, { 
    amount: shouldAnimate ? amount : 0, // If reduced motion, trigger immediately
    margin: shouldAnimate ? (margin as any) : undefined,
    once: triggerOnce 
  });
  
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Element entered viewport - animate to visible
      if (shouldAnimate) {
        controls.start("visible");
      } else {
        controls.set("visible");
      }
    } else if (!triggerOnce) {
      // Element left viewport - reverse animation to hidden
      // Only reverse if triggerOnce is false (allows re-triggering)
      if (shouldAnimate) {
        controls.start("hidden");
      } else {
        controls.set("hidden");
      }
    }
  }, [isInView, controls, triggerOnce, shouldAnimate]);

  return { ref, isInView, controls };
}

