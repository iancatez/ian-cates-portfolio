"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { prefersReducedMotion } from "@/lib/animation-config";

// Animation style options
type AnimationStyle = "words" | "blur" | "slide" | "fade";

interface AnimatedTextProps {
  text: string;
  delay?: number; // Delay before starting (ms)
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  animation?: AnimationStyle;
  staggerDelay?: number; // Delay between words (ms)
  viewportTriggered?: boolean; // Animate when scrolling in/out of viewport
  once?: boolean; // If true, only animate once (don't reset when leaving viewport)
}

// For continuous multi-paragraph animation
interface AnimatedParagraphsProps {
  paragraphs: Array<{
    text: string;
    className?: string;
  }>;
  delay?: number;
  animation?: AnimationStyle;
  viewportTriggered?: boolean;
  once?: boolean; // If true, only animate once (don't reset when leaving viewport)
}

// Word-by-word stagger animation
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// Blur to sharp animation
const blurVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

// Slide up animation
const slideVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Simple fade animation
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.025,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const variantMap: Record<AnimationStyle, Variants> = {
  words: wordVariants,
  blur: blurVariants,
  slide: slideVariants,
  fade: fadeVariants,
};

export function AnimatedText({
  text,
  delay = 0,
  className = "",
  as: Component = "p",
  animation = "words",
  staggerDelay,
  viewportTriggered = true, // Default to viewport-triggered
  once = false, // Default to false - headings/short text can re-animate
}: AnimatedTextProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference after hydration
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  // If reduced motion, render text without animation
  if (reducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  // Split text into words for word-by-word animation
  const words = text.split(" ");
  const selectedVariants = variantMap[animation];

  // Modify variants with delay
  const getCustomVariants = (): Variants => {
    return {
      hidden: selectedVariants.hidden,
      visible: (i: number) => {
        const baseVisible = typeof selectedVariants.visible === "function" 
          ? selectedVariants.visible(i)
          : selectedVariants.visible;
        const baseTransition = (baseVisible as { transition?: { delay?: number } }).transition || {};
        const baseDelay = baseTransition.delay || 0;
        const customStagger = staggerDelay ? (i * (staggerDelay / 1000)) : baseDelay;
        return {
          ...baseVisible,
          transition: {
            ...baseTransition,
            delay: (delay / 1000) + customStagger,
          },
        };
      },
    };
  };

  const variants = delay || staggerDelay ? getCustomVariants() : selectedVariants;

  // Viewport config for scroll-triggered animations
  const viewportConfig = {
    once: once, // Control if animation should only happen once
    amount: 0.3 as const, // Trigger when 30% visible
    margin: "0px" as const,
  };

  // Use inline-block for animations that need it (blur, slide use transform/filter)
  const needsInlineBlock = animation === "blur" || animation === "slide" || animation === "words";

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <span key={index} style={{ display: "inline" }}>
          <motion.span
            custom={index}
            initial="hidden"
            {...(viewportTriggered 
              ? { whileInView: "visible", viewport: viewportConfig }
              : { animate: "visible" }
            )}
            variants={variants}
            style={{ 
              display: needsInlineBlock ? "inline-block" : "inline",
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </Component>
  );
}

// Keep TypewriterText as an alias for backward compatibility
export function TypewriterText({
  text,
  delay = 0,
  className = "",
  as = "p",
}: Omit<AnimatedTextProps, "animation" | "staggerDelay" | "viewportTriggered"> & { speed?: number; onComplete?: () => void; showCursor?: boolean; cursorChar?: string }) {
  return (
    <AnimatedText
      text={text}
      delay={delay}
      className={className}
      as={as}
      animation="words"
      viewportTriggered={true}
    />
  );
}

/**
 * Animates multiple paragraphs as one continuous flow.
 * Word indices continue across paragraphs for seamless animation.
 */
export function AnimatedParagraphs({
  paragraphs,
  delay = 0,
  animation = "fade",
  viewportTriggered = true,
  once = true, // Default to true - long content should stay visible once animated
}: AnimatedParagraphsProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  if (reducedMotion) {
    return (
      <>
        {paragraphs.map((para, i) => (
          <p key={i} className={para.className}>
            {para.text}
          </p>
        ))}
      </>
    );
  }

  const selectedVariants = variantMap[animation];

  // Build all words with their paragraph info
  type WordInfo = { word: string; paragraphIndex: number; globalIndex: number };
  const allWords: WordInfo[] = [];
  let globalIndex = 0;

  paragraphs.forEach((para, paragraphIndex) => {
    const words = para.text.split(" ");
    words.forEach((word) => {
      allWords.push({ word, paragraphIndex, globalIndex });
      globalIndex++;
    });
  });

  // Create variants with delay
  const getVariants = (): Variants => {
    return {
      hidden: selectedVariants.hidden,
      visible: (i: number) => {
        const baseVisible = typeof selectedVariants.visible === "function" 
          ? selectedVariants.visible(i)
          : selectedVariants.visible;
        const baseTransition = (baseVisible as { transition?: { delay?: number } }).transition || {};
        return {
          ...baseVisible,
          transition: {
            ...baseTransition,
            delay: (delay / 1000) + (i * 0.02), // Faster stagger for long text
          },
        };
      },
    };
  };

  const variants = getVariants();

  const viewportConfig = {
    once: once, // Use the prop to control if animation should only happen once
    amount: 0.2 as const,
    margin: "0px" as const,
  };

  // Use inline-block for animations that need it
  const needsInlineBlock = animation === "blur" || animation === "slide" || animation === "words";

  // Group words by paragraph
  const paragraphGroups: WordInfo[][] = [];
  paragraphs.forEach((_, i) => {
    paragraphGroups[i] = allWords.filter((w) => w.paragraphIndex === i);
  });

  return (
    <>
      {paragraphGroups.map((words, paragraphIndex) => (
        <p key={paragraphIndex} className={paragraphs[paragraphIndex].className}>
          {words.map((wordInfo, localIndex) => (
            <span key={localIndex} style={{ display: "inline" }}>
              <motion.span
                custom={wordInfo.globalIndex}
                initial="hidden"
                {...(viewportTriggered 
                  ? { whileInView: "visible", viewport: viewportConfig }
                  : { animate: "visible" }
                )}
                variants={variants}
                style={{ 
                  display: needsInlineBlock ? "inline-block" : "inline",
                }}
              >
                {wordInfo.word}
              </motion.span>
              {localIndex < words.length - 1 && " "}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

