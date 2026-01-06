"use client";

import { ReactNode, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MouseReactiveCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "moderate";
}

const intensityConfig = {
  subtle: {
    maxRotate: 5,
    maxTranslate: 10,
  },
  moderate: {
    maxRotate: 10,
    maxTranslate: 20,
  },
};

export function MouseReactiveCard({
  children,
  className,
  intensity = "subtle",
}: MouseReactiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = intensityConfig[intensity];

  // Motion values for smooth animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [config.maxRotate, -config.maxRotate]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-config.maxRotate, config.maxRotate]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Normalize to -0.5 to 0.5 range
    const normalizedX = mouseX / rect.width;
    const normalizedY = mouseY / rect.height;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
      className={cn(
        "transition-transform duration-200",
        "will-change-transform",
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
}

