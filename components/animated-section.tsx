"use client";

import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { scrollAnimation } from "@/lib/animations";
import { ANIMATION_TRIGGER_CONFIG } from "@/lib/animation-config";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  variant?: Variants;
  /**
   * Amount of element that must be visible (0-1)
   * Default: 0.4 (40% of element must be visible - improved from 0.1)
   */
  amount?: number;
  /**
   * Margin to create a trigger zone closer to viewport center
   * Default: "-20% 0px" (ignore top/bottom 20% of viewport)
   */
  margin?: string;
  /**
   * Whether animation should trigger only once
   * Default: false (enables reverse animations when scrolling past elements)
   */
  triggerOnce?: boolean;
}

export function AnimatedSection({
  children,
  id,
  className,
  delay = 0,
  variant,
  amount = 0.1, // Minimal threshold - let children handle their own animations
  margin = "0px", // No margin - stay visible longer
  triggerOnce = false, // Enable reverse animations
}: AnimatedSectionProps) {
  const { ref, controls } = useScrollAnimation({ amount, margin, triggerOnce });
  const animationVariant = variant || scrollAnimation;

  const customVariant: Variants = delay
    ? {
        hidden: animationVariant.hidden,
        visible: {
          ...(typeof animationVariant.visible === "object" &&
          animationVariant.visible !== null
            ? animationVariant.visible
            : {}),
          transition: {
            duration: 0.6,
            ease: "easeOut",
            delay,
          },
        },
      }
    : animationVariant;

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={customVariant}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}

