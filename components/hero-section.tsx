"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useMotionValueEvent, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animation-config";

// Intensity levels for realistic neon flicker
const INTENSITY_LEVELS = {
  off: 0.15,
  dim: 0.4,
  medium: 0.7,
  bright: 0.9,
  full: 1.0,
  surge: 1.15,
}

// Custom stagger container with longer delays for hero impact
const heroStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Longer stagger for dramatic effect
      delayChildren: 0.3,
    },
  },
};

// Custom stagger item with slide-up and scale
const heroStaggerItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth reveal
    },
  },
};

// Special variant for the name heading - no opacity/y animation, just fade in
// The neon glow will handle the visual drama
const nameHeadingVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Generate a random micro-flicker cluster
function generateFlickerCluster(): { intensity: number; duration: number }[] {
  const cluster: { intensity: number; duration: number }[] = []
  const flickerCount = 2 + Math.floor(Math.random() * 3)
  
  for (let i = 0; i < flickerCount; i++) {
    const dimLevel = Math.random() < 0.3 
      ? INTENSITY_LEVELS.off 
      : Math.random() < 0.5 
        ? INTENSITY_LEVELS.dim 
        : INTENSITY_LEVELS.medium
    
    cluster.push({ intensity: dimLevel, duration: 20 + Math.random() * 30 })
    
    const recoveryIntensity = Math.random() < 0.3 
      ? INTENSITY_LEVELS.surge 
      : INTENSITY_LEVELS.full
    cluster.push({ intensity: recoveryIntensity, duration: 30 + Math.random() * 30 })
    
    if (i < flickerCount - 1) {
      cluster.push({ intensity: INTENSITY_LEVELS.full, duration: Math.random() * 80 })
    }
  }
  
  return cluster
}

// Generate startup struggle sequence
function generateStartupSequence(): { intensity: number; duration: number }[] {
  const sequence: { intensity: number; duration: number }[] = []
  
  sequence.push({ intensity: INTENSITY_LEVELS.off, duration: 100 })
  
  const attempts = 2 + Math.floor(Math.random() * 2)
  for (let i = 0; i < attempts; i++) {
    sequence.push({ intensity: INTENSITY_LEVELS.dim + Math.random() * 0.3, duration: 40 + Math.random() * 40 })
    sequence.push({ intensity: INTENSITY_LEVELS.off, duration: 80 + Math.random() * 120 })
  }
  
  sequence.push({ intensity: INTENSITY_LEVELS.medium, duration: 50 })
  sequence.push({ intensity: INTENSITY_LEVELS.surge, duration: 30 })
  sequence.push({ intensity: INTENSITY_LEVELS.full, duration: 50 })
  
  return sequence
}

export function HeroSection() {
  const [showChevron, setShowChevron] = useState(true);
  const [chevronIntensity, setChevronIntensity] = useState(0);
  const [headingIntensity, setHeadingIntensity] = useState(0);
  const [isHeadingReady, setIsHeadingReady] = useState(false);
  const [sweepPosition, setSweepPosition] = useState(-100); // -100% to start off-screen left
  const { scrollY } = useScroll();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const headingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const sweepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);
  const isHeadingActiveRef = useRef(false);
  const isSweepActiveRef = useRef(false);
  
  // Check for reduced motion preference
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return prefersReducedMotion();
  }, []);

  // Clear all pending timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Clear heading timeouts
  const clearHeadingTimeouts = useCallback(() => {
    headingTimeoutsRef.current.forEach(clearTimeout);
    headingTimeoutsRef.current = [];
  }, []);

  // Execute a flicker sequence for chevron
  const executeSequence = useCallback((
    sequence: { intensity: number; duration: number }[],
    onComplete?: () => void
  ) => {
    let totalDelay = 0;
    
    sequence.forEach((step) => {
      const timeout = setTimeout(() => {
        if (isActiveRef.current) {
          setChevronIntensity(step.intensity);
        }
      }, totalDelay);
      timeoutsRef.current.push(timeout);
      totalDelay += step.duration;
    });
    
    if (onComplete) {
      const completeTimeout = setTimeout(() => {
        if (isActiveRef.current) {
          onComplete();
        }
      }, totalDelay);
      timeoutsRef.current.push(completeTimeout);
    }
    
    return totalDelay;
  }, []);

  // Execute a flicker sequence for heading
  const executeHeadingSequence = useCallback((
    sequence: { intensity: number; duration: number }[],
    onComplete?: () => void
  ) => {
    let totalDelay = 0;
    
    sequence.forEach((step) => {
      const timeout = setTimeout(() => {
        if (isHeadingActiveRef.current) {
          setHeadingIntensity(step.intensity);
        }
      }, totalDelay);
      headingTimeoutsRef.current.push(timeout);
      totalDelay += step.duration;
    });
    
    if (onComplete) {
      const completeTimeout = setTimeout(() => {
        if (isHeadingActiveRef.current) {
          onComplete();
        }
      }, totalDelay);
      headingTimeoutsRef.current.push(completeTimeout);
    }
    
    return totalDelay;
  }, []);

  // Schedule random flicker clusters for chevron
  const scheduleNextFlicker = useCallback(() => {
    if (!isActiveRef.current) return;
    
    const baseDelay = 2000 + Math.random() * 3000;
    const extraDelay = Math.random() < 0.3 ? Math.random() * 2000 : 0;
    const delay = baseDelay + extraDelay;
    
    const timeout = setTimeout(() => {
      if (isActiveRef.current) {
        const cluster = generateFlickerCluster();
        executeSequence(cluster, () => {
          setChevronIntensity(INTENSITY_LEVELS.full);
          scheduleNextFlicker();
        });
      }
    }, delay);
    timeoutsRef.current.push(timeout);
  }, [executeSequence]);

  // Schedule random flicker clusters for heading (less frequent)
  const scheduleNextHeadingFlicker = useCallback(() => {
    if (!isHeadingActiveRef.current) return;
    
    // Heading flickers less often than chevron for subtlety
    const baseDelay = 4000 + Math.random() * 6000;
    const extraDelay = Math.random() < 0.2 ? Math.random() * 3000 : 0;
    const delay = baseDelay + extraDelay;
    
    const timeout = setTimeout(() => {
      if (isHeadingActiveRef.current) {
        const cluster = generateFlickerCluster();
        executeHeadingSequence(cluster, () => {
          setHeadingIntensity(INTENSITY_LEVELS.full);
          scheduleNextHeadingFlicker();
        });
      }
    }, delay);
    headingTimeoutsRef.current.push(timeout);
  }, [executeHeadingSequence]);

  // Animate sweep across the heading
  const animateSweep = useCallback(() => {
    if (!isSweepActiveRef.current || reducedMotion) return;
    
    // Start from left (-100%)
    setSweepPosition(-100);
    
    // Animate to right (200%) over ~1.2 seconds
    const duration = 1200;
    const startTime = Date.now();
    const startPos = -100;
    const endPos = 200;
    
    const animate = () => {
      if (!isSweepActiveRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out curve for smooth sweep
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentPos = startPos + (endPos - startPos) * easeProgress;
      setSweepPosition(currentPos);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Schedule next sweep
        scheduleNextSweep();
      }
    };
    
    requestAnimationFrame(animate);
  }, [reducedMotion]);

  // Schedule the next sweep with random delay
  const scheduleNextSweep = useCallback(() => {
    if (!isSweepActiveRef.current || reducedMotion) return;
    
    // Random delay between sweeps: 5-10 seconds
    const delay = 5000 + Math.random() * 5000;
    
    sweepTimeoutRef.current = setTimeout(() => {
      if (isSweepActiveRef.current) {
        animateSweep();
      }
    }, delay);
  }, [animateSweep, reducedMotion]);

  // Start heading neon effect on mount (before chevron)
  useEffect(() => {
    if (reducedMotion) {
      // Skip animations for reduced motion preference
      setHeadingIntensity(INTENSITY_LEVELS.full);
      setIsHeadingReady(true);
      return;
    }

    isHeadingActiveRef.current = true;

    // Start heading glow with startup sequence - kicks off quickly
    const headingStartDelay = setTimeout(() => {
      const startupSequence = generateStartupSequence();
      executeHeadingSequence(startupSequence, () => {
        setHeadingIntensity(INTENSITY_LEVELS.full);
        setIsHeadingReady(true);
        scheduleNextHeadingFlicker();
      });
    }, 400); // Start shortly after initial fade-in begins

    return () => {
      clearTimeout(headingStartDelay);
      isHeadingActiveRef.current = false;
      clearHeadingTimeouts();
    };
  }, [executeHeadingSequence, scheduleNextHeadingFlicker, clearHeadingTimeouts, reducedMotion]);

  // Start chevron flicker on mount (after heading settles)
  useEffect(() => {
    if (reducedMotion) {
      // Skip animations for reduced motion preference
      setChevronIntensity(INTENSITY_LEVELS.full);
      return;
    }

    isActiveRef.current = true;

    const startDelay = setTimeout(() => {
      const startupSequence = generateStartupSequence();
      executeSequence(startupSequence, () => {
        setChevronIntensity(INTENSITY_LEVELS.full);
        scheduleNextFlicker();
      });
    }, 1800); // Delay startup to after hero content animates in

    return () => {
      clearTimeout(startDelay);
      isActiveRef.current = false;
      clearAllTimeouts();
    };
  }, [executeSequence, scheduleNextFlicker, clearAllTimeouts, reducedMotion]);

  // Start sweep animation after heading is ready
  useEffect(() => {
    if (reducedMotion || !isHeadingReady) return;

    isSweepActiveRef.current = true;
    
    // First sweep after heading startup completes (2 seconds after ready)
    const initialDelay = setTimeout(() => {
      if (isSweepActiveRef.current) {
        animateSweep();
      }
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      isSweepActiveRef.current = false;
      if (sweepTimeoutRef.current) {
        clearTimeout(sweepTimeoutRef.current);
      }
    };
  }, [isHeadingReady, animateSweep, reducedMotion]);

  // Hide chevron when scrolled past ~20% of viewport height
  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold = window.innerHeight * 0.2;
    setShowChevron(latest < threshold);
  });

  // Smooth scroll to a section by ID
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToProjects = useCallback(() => {
    scrollToSection("projects");
  }, [scrollToSection]);

  const scrollToAbout = useCallback(() => {
    scrollToSection("about");
  }, [scrollToSection]);

  // Compute heading glow styles based on intensity
  const headingGlowStyles = useMemo(() => {
    if (reducedMotion) {
      // Simple static glow for reduced motion
      return {
        textShadow: `
          0 0 10px hsl(var(--primary) / 0.5),
          0 0 20px hsl(var(--primary) / 0.3),
          0 0 40px hsl(var(--primary) / 0.2)
        `,
      };
    }

    const i = headingIntensity;
    const glowOpacity1 = 0.8 * i;
    const glowOpacity2 = 0.5 * i;
    const glowOpacity3 = 0.3 * i;
    const glowSize1 = 10 * i;
    const glowSize2 = 25 * i;
    const glowSize3 = 50 * i;
    
    return {
      textShadow: `
        0 0 ${glowSize1}px hsl(var(--primary) / ${glowOpacity1}),
        0 0 ${glowSize2}px hsl(var(--primary) / ${glowOpacity2}),
        0 0 ${glowSize3}px hsl(var(--primary) / ${glowOpacity3})
      `,
      transition: 'text-shadow 0.05s ease',
    };
  }, [headingIntensity, reducedMotion]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center"
    >
      <motion.div
        variants={reducedMotion ? undefined : heroStaggerContainer}
        initial={reducedMotion ? { opacity: 1 } : "hidden"}
        animate="visible"
        className="max-w-4xl space-y-6"
      >
        {/* Name heading with neon glow effect and sweep animation */}
        <motion.div
          variants={reducedMotion ? undefined : nameHeadingVariant}
          className="relative inline-block"
        >
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-primary"
            style={headingGlowStyles}
          >
            Ian Cates
          </h1>
          {/* Sweep highlight overlay */}
          {!reducedMotion && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="absolute inset-y-0 w-[30%]"
                style={{
                  left: `${sweepPosition}%`,
                  background: `linear-gradient(
                    90deg,
                    transparent 0%,
                    hsl(var(--primary) / 0.1) 20%,
                    hsl(var(--primary) / 0.4) 50%,
                    hsl(var(--primary) / 0.1) 80%,
                    transparent 100%
                  )`,
                  filter: 'blur(8px)',
                }}
              />
            </div>
          )}
        </motion.div>
        
        {/* Subtitle with staggered reveal */}
        <motion.p
          variants={reducedMotion ? undefined : heroStaggerItem}
          className="text-xl text-muted-foreground sm:text-2xl md:text-3xl"
        >
          Data Engineer
        </motion.p>
        
        {/* Description with staggered reveal */}
        <motion.p
          variants={reducedMotion ? undefined : heroStaggerItem}
          className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Building production data systems at enterprise scale. Turning messy data into 
          reliable, actionable insights.
        </motion.p>

        {/* Buttons with staggered reveal */}
        <motion.div
          variants={reducedMotion ? undefined : heroStaggerItem}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" onClick={scrollToProjects}>
            View Projects
          </Button>
          <Button size="lg" neonColor="#3b82f6" onClick={scrollToAbout}>
            About Me
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - only visible when at top of hero section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showChevron ? 1 : 0,
          y: showChevron ? [0, 8, 0] : 0,
        }}
        transition={{ 
          opacity: { duration: 0.3 },
          y: {
            delay: 1,
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={scrollToAbout}
        aria-label="Scroll to about section"
        style={{ pointerEvents: showChevron ? 'auto' : 'none' }}
      >
        <ChevronDown 
          className="h-8 w-8 text-primary transition-transform duration-300 hover:scale-110"
          style={{
            opacity: Math.max(0.3, chevronIntensity),
            filter: `
              drop-shadow(0 0 ${4 * chevronIntensity}px hsl(var(--primary)))
              drop-shadow(0 0 ${8 * chevronIntensity}px hsl(var(--primary) / ${0.7 * chevronIntensity}))
              drop-shadow(0 0 ${16 * chevronIntensity}px hsl(var(--primary) / ${0.5 * chevronIntensity}))
            `,
          }}
        />
      </motion.div>
    </section>
  );
}

