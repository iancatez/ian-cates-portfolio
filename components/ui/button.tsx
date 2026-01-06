"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-[hsl(142_40%_45%)] text-[hsl(142_40%_45%)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_hsl(0_62%_30%_/_0.7),0_0_30px_hsl(0_62%_30%_/_0.5)] transition-all",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary hover:shadow-[0_0_15px_hsl(142_76%_55%_/_0.7),0_0_30px_hsl(142_76%_55%_/_0.5),0_0_45px_hsl(142_76%_55%_/_0.3)] transition-all",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_15px_hsl(142_76%_55%_/_0.7),0_0_30px_hsl(142_76%_55%_/_0.5),0_0_45px_hsl(142_76%_55%_/_0.3)] transition-all",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_15px_hsl(142_76%_55%_/_0.7),0_0_30px_hsl(142_76%_55%_/_0.5),0_0_45px_hsl(142_76%_55%_/_0.3)] transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:shadow-[0_0_10px_hsl(142_76%_55%_/_0.5)] transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [intensity, setIntensity] = React.useState(0)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isStartingUp, setIsStartingUp] = React.useState(false)
    const animationRef = React.useRef<number | null>(null)
    const timeoutsRef = React.useRef<NodeJS.Timeout[]>([])
    const isActiveRef = React.useRef(false)
    
    // Clear all pending timeouts
    const clearAllTimeouts = React.useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }, [])

    // Execute a flicker sequence
    const executeSequence = React.useCallback((
      sequence: { intensity: number; duration: number }[],
      onComplete?: () => void
    ) => {
      let totalDelay = 0
      
      sequence.forEach((step, index) => {
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

    // Handle hover start - startup sequence
    const handleMouseEnter = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true)
      isActiveRef.current = true
      setIsStartingUp(true)
      
      // Execute startup struggle sequence
      const startupSequence = generateStartupSequence()
      executeSequence(startupSequence, () => {
        setIsStartingUp(false)
        setIntensity(INTENSITY_LEVELS.full)
        // Start scheduling random flickers
        scheduleNextFlicker()
      })
      
      props.onMouseEnter?.(e)
    }, [executeSequence, scheduleNextFlicker, props])

    // Handle hover end - fade out with glow persistence
    const handleMouseLeave = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false)
      isActiveRef.current = false
      setIsStartingUp(false)
      clearAllTimeouts()
      
      // Smooth fade out
      setIntensity(0)
      
      props.onMouseLeave?.(e)
    }, [clearAllTimeouts, props])

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        clearAllTimeouts()
      }
    }, [clearAllTimeouts])

    // Calculate styles based on intensity
    const neonStyles = React.useMemo(() => {
      if (!isHovered && intensity === 0) {
        return {
          backgroundColor: 'transparent',
          color: 'hsl(142 40% 45%)',
          boxShadow: '0 0 0px transparent',
          transition: 'all 0.5s ease-out',
        }
      }
      
      const i = intensity
      const glowOpacity1 = 0.7 * i
      const glowOpacity2 = 0.5 * i
      const glowOpacity3 = 0.3 * i
      const glowSize1 = 15 * i
      const glowSize2 = 30 * i
      const glowSize3 = 45 * i
      
      return {
        backgroundColor: `hsl(142 40% 45% / ${i})`,
        color: i > 0.5 ? 'white' : 'hsl(142 40% 45%)',
        boxShadow: `
          0 0 ${glowSize1}px hsl(142 40% 45% / ${glowOpacity1}),
          0 0 ${glowSize2}px hsl(142 40% 45% / ${glowOpacity2}),
          0 0 ${glowSize3}px hsl(142 40% 45% / ${glowOpacity3})
        `,
        transition: isStartingUp ? 'none' : 'color 0.1s ease',
      }
    }, [intensity, isHovered, isStartingUp])

    // Only apply neon effect to default variant
    const isDefaultVariant = variant === 'default' || variant === undefined

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onMouseEnter={isDefaultVariant ? handleMouseEnter : props.onMouseEnter}
        onMouseLeave={isDefaultVariant ? handleMouseLeave : props.onMouseLeave}
        style={{
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          ...(isDefaultVariant ? neonStyles : {}),
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
