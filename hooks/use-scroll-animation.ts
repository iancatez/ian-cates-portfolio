import { useRef, useEffect } from "react";
import { useInView, useAnimation } from "framer-motion";

interface UseScrollAnimationOptions {
  amount?: number;
  triggerOnce?: boolean;
}

/**
 * Hook for scroll-triggered animations
 * Returns ref to attach to element and animation controls
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { amount = 0.1, triggerOnce = true } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, once: triggerOnce });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!triggerOnce) {
      controls.start("hidden");
    }
  }, [isInView, controls, triggerOnce]);

  return { ref, isInView, controls };
}

