"use client";

import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { scrollAnimation } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  variant?: Variants;
  amount?: number;
  triggerOnce?: boolean;
}

export function AnimatedSection({
  children,
  id,
  className,
  delay = 0,
  variant,
  amount = 0.1,
  triggerOnce = true,
}: AnimatedSectionProps) {
  const { ref, controls } = useScrollAnimation({ amount, triggerOnce });
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

