"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Default neon color (green) - matches --primary
const DEFAULT_NEON_COLOR = "142 40% 45%"

// Intensity levels for realistic neon flicker (never fully dark due to glow persistence)
const INTENSITY_LEVELS = {
  off: 0.15,      // Ambient glow - neon never goes fully dark
  dim: 0.4,       // Dim flicker
  medium: 0.7,    // Medium intensity
  bright: 0.9,    // Almost full
  full: 1.0,      // Full brightness
  surge: 1.15,    // Brief surge above normal
}

// Generate a random micro-flicker cluster (bzzzt-bzzzt... bzzzt pattern)
function generateFlickerCluster(): { intensity: number; duration: number }[] {
  const cluster: { intensity: number; duration: number }[] = []
  
  // Random number of flickers in cluster (2-4)
  const flickerCount = 2 + Math.floor(Math.random() * 3)
  
  for (let i = 0; i < flickerCount; i++) {
    // Random dim intensity
    const dimLevel = Math.random() < 0.3 
      ? INTENSITY_LEVELS.off 
      : Math.random() < 0.5 
        ? INTENSITY_LEVELS.dim 
        : INTENSITY_LEVELS.medium
    
    // Quick dim (20-50ms)
    cluster.push({ intensity: dimLevel, duration: 20 + Math.random() * 30 })
    
    // Quick recovery with possible surge (30-60ms)
    const recoveryIntensity = Math.random() < 0.3 
      ? INTENSITY_LEVELS.surge 
      : INTENSITY_LEVELS.full
    cluster.push({ intensity: recoveryIntensity, duration: 30 + Math.random() * 30 })
    
    // Small pause between flickers in cluster (0-80ms)
    if (i < flickerCount - 1) {
      cluster.push({ intensity: INTENSITY_LEVELS.full, duration: Math.random() * 80 })
    }
  }
  
  return cluster
}

// Generate startup struggle sequence
function generateStartupSequence(): { intensity: number; duration: number }[] {
  const sequence: { intensity: number; duration: number }[] = []
  
  // Start from off
  sequence.push({ intensity: INTENSITY_LEVELS.off, duration: 100 })
  
  // 2-3 failed attempts
  const attempts = 2 + Math.floor(Math.random() * 2)
  for (let i = 0; i < attempts; i++) {
    // Quick flash attempt
    sequence.push({ intensity: INTENSITY_LEVELS.dim + Math.random() * 0.3, duration: 40 + Math.random() * 40 })
    // Fall back
    sequence.push({ intensity: INTENSITY_LEVELS.off, duration: 80 + Math.random() * 120 })
  }
  
  // Final successful catch
  sequence.push({ intensity: INTENSITY_LEVELS.medium, duration: 50 })
  sequence.push({ intensity: INTENSITY_LEVELS.surge, duration: 30 })
  sequence.push({ intensity: INTENSITY_LEVELS.full, duration: 50 })
  
  return sequence
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 
   * Custom neon color for the card glow effect.
   * Accepts HSL values (e.g., "142 40% 45%")
   */
  neonColor?: string
  /**
   * Disable the flickering neon effect
   */
  disableFlicker?: boolean
  /**
   * Keep the neon glow always on (without requiring hover).
   * When true, the glow starts on mount and stays on with random flickers.
   * Default: false
   */
  alwaysGlow?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, neonColor = DEFAULT_NEON_COLOR, disableFlicker = false, alwaysGlow = false, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [intensity, setIntensity] = React.useState(alwaysGlow ? INTENSITY_LEVELS.full : 0)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isStartingUp, setIsStartingUp] = React.useState(false)
    const [isAlwaysGlowActive, setIsAlwaysGlowActive] = React.useState(false)
    const timeoutsRef = React.useRef<NodeJS.Timeout[]>([])
    const isActiveRef = React.useRef(alwaysGlow)
    
    // Clear all pending timeouts
    const clearAllTimeouts = React.useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }, [])

    // Execute a flicker sequence
    const executeSequence = React.useCallback((
      sequence: { intensity: number; duration: number }[],
      onComplete?: () => void
    ) => {
      let totalDelay = 0
      
      sequence.forEach((step) => {
        const timeout = setTimeout(() => {
          if (isActiveRef.current) {
            setIntensity(step.intensity)
          }
        }, totalDelay)
        timeoutsRef.current.push(timeout)
        totalDelay += step.duration
      })
      
      if (onComplete) {
        const completeTimeout = setTimeout(() => {
          if (isActiveRef.current) {
            onComplete()
          }
        }, totalDelay)
        timeoutsRef.current.push(completeTimeout)
      }
      
      return totalDelay
    }, [])

    // Schedule random flicker clusters
    const scheduleNextFlicker = React.useCallback(() => {
      if (!isActiveRef.current) return
      
      // Random delay between clusters (1-3 seconds with irregular distribution)
      const baseDelay = 1000 + Math.random() * 2000
      // Add extra randomness - sometimes quick succession, sometimes longer pause
      const extraDelay = Math.random() < 0.3 ? Math.random() * 1500 : 0
      const delay = baseDelay + extraDelay
      
      const timeout = setTimeout(() => {
        if (isActiveRef.current) {
          const cluster = generateFlickerCluster()
          executeSequence(cluster, () => {
            // Return to full brightness after cluster
            setIntensity(INTENSITY_LEVELS.full)
            // Schedule next flicker
            scheduleNextFlicker()
          })
        }
      }, delay)
      timeoutsRef.current.push(timeout)
    }, [executeSequence])

    // Handle hover start - startup sequence (skip if alwaysGlow is enabled)
    const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      // If alwaysGlow is enabled, don't interfere with the always-on glow
      if (alwaysGlow) {
        onMouseEnter?.(e)
        return
      }
      
      setIsHovered(true)
      isActiveRef.current = true
      
      if (disableFlicker) {
        setIntensity(INTENSITY_LEVELS.full)
      } else {
        setIsStartingUp(true)
        // Execute startup struggle sequence
        const startupSequence = generateStartupSequence()
        executeSequence(startupSequence, () => {
          setIsStartingUp(false)
          setIntensity(INTENSITY_LEVELS.full)
          // Start scheduling random flickers
          scheduleNextFlicker()
        })
      }
      
      onMouseEnter?.(e)
    }, [executeSequence, scheduleNextFlicker, disableFlicker, onMouseEnter, alwaysGlow])

    // Handle hover end - fade out (skip if alwaysGlow is enabled)
    const handleMouseLeave = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      // If alwaysGlow is enabled, don't interfere with the always-on glow
      if (alwaysGlow) {
        onMouseLeave?.(e)
        return
      }
      
      setIsHovered(false)
      isActiveRef.current = false
      setIsStartingUp(false)
      clearAllTimeouts()
      
      // Smooth fade out
      setIntensity(0)
      
      onMouseLeave?.(e)
    }, [clearAllTimeouts, onMouseLeave, alwaysGlow])

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        clearAllTimeouts()
      }
    }, [clearAllTimeouts])

    // Handle alwaysGlow - start glow on mount
    React.useEffect(() => {
      if (alwaysGlow && !isAlwaysGlowActive) {
        setIsAlwaysGlowActive(true)
        isActiveRef.current = true
        
        if (disableFlicker) {
          setIntensity(INTENSITY_LEVELS.full)
        } else {
          // Execute startup struggle sequence
          setIsStartingUp(true)
          const startupSequence = generateStartupSequence()
          executeSequence(startupSequence, () => {
            setIsStartingUp(false)
            setIntensity(INTENSITY_LEVELS.full)
            // Start scheduling random flickers
            scheduleNextFlicker()
          })
        }
      }
    }, [alwaysGlow, isAlwaysGlowActive, disableFlicker, executeSequence, scheduleNextFlicker])

    // Calculate glow styles based on intensity
    const glowStyles = React.useMemo(() => {
      // Only return empty styles if not hovered, not alwaysGlow, and intensity is 0
      if (!isHovered && !alwaysGlow && intensity === 0) {
        return {
          borderColor: undefined,
          boxShadow: undefined,
          transition: 'all 0.5s ease-out',
        }
      }
      
      const i = intensity
      const glowOpacity1 = 0.5 * i
      const glowOpacity2 = 0.3 * i
      const glowOpacity3 = 0.2 * i
      const glowSize1 = 15 * i
      const glowSize2 = 30 * i
      const glowSize3 = 45 * i
      
      // Border opacity transitions with intensity
      const borderOpacity = 0.3 + (0.4 * i) // 0.3 to 0.7
      
      return {
        borderColor: `hsl(${neonColor} / ${borderOpacity})`,
        boxShadow: `
          0 0 ${glowSize1}px hsl(${neonColor} / ${glowOpacity1}),
          0 0 ${glowSize2}px hsl(${neonColor} / ${glowOpacity2}),
          0 0 ${glowSize3}px hsl(${neonColor} / ${glowOpacity3})
        `,
        transition: isStartingUp ? 'none' : 'border-color 0.3s ease',
      }
    }, [intensity, isHovered, isStartingUp, neonColor, alwaysGlow])

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          "transform-gpu",
          className
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          ...glowStyles,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
