"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Intensity levels for realistic neon flicker (never fully dark due to glow persistence)
const INTENSITY_LEVELS = {
  off: 0.15,      // Ambient glow - neon never goes fully dark
  dim: 0.4,       // Dim flicker
  medium: 0.7,    // Medium intensity
  bright: 0.9,    // Almost full
  full: 1.0,      // Full brightness
  surge: 1.15,    // Brief surge above normal
}

// Default neon color (green)
const DEFAULT_NEON_COLOR = "142 40% 45%"

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

interface NeonTopBarProps {
  className?: string
  /** HSL color values (e.g., "142 40% 45%") */
  neonColor?: string
  /** Height of the bar in pixels */
  height?: number
}

export function NeonTopBar({ 
  className, 
  neonColor = DEFAULT_NEON_COLOR,
  height = 2 
}: NeonTopBarProps) {
  const [intensity, setIntensity] = React.useState(0)
  const [isMounted, setIsMounted] = React.useState(false)
  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([])
  const isActiveRef = React.useRef(false)

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
    
    // Random delay between clusters (2-5 seconds with irregular distribution)
    const baseDelay = 2000 + Math.random() * 3000
    // Add extra randomness - sometimes quick succession, sometimes longer pause
    const extraDelay = Math.random() < 0.3 ? Math.random() * 2000 : 0
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

  // Start the neon effect on mount
  React.useEffect(() => {
    setIsMounted(true)
    isActiveRef.current = true

    // Small delay before starting to avoid hydration issues
    const startDelay = setTimeout(() => {
      // Execute startup struggle sequence
      const startupSequence = generateStartupSequence()
      executeSequence(startupSequence, () => {
        setIntensity(INTENSITY_LEVELS.full)
        // Start scheduling random flickers
        scheduleNextFlicker()
      })
    }, 500)

    return () => {
      clearTimeout(startDelay)
      isActiveRef.current = false
      clearAllTimeouts()
    }
  }, [executeSequence, scheduleNextFlicker, clearAllTimeouts])

  // Calculate glow styles based on intensity
  const glowStyles = React.useMemo(() => {
    const i = intensity
    const glowOpacity1 = 0.8 * i
    const glowOpacity2 = 0.6 * i
    const glowOpacity3 = 0.4 * i
    const glowSize1 = 8 * i
    const glowSize2 = 16 * i
    const glowSize3 = 24 * i
    
    return {
      backgroundColor: `hsl(${neonColor} / ${Math.max(0.3, i)})`,
      boxShadow: `
        0 0 ${glowSize1}px hsl(${neonColor} / ${glowOpacity1}),
        0 0 ${glowSize2}px hsl(${neonColor} / ${glowOpacity2}),
        0 0 ${glowSize3}px hsl(${neonColor} / ${glowOpacity3}),
        0 2px ${glowSize2}px hsl(${neonColor} / ${glowOpacity2})
      `,
    }
  }, [intensity, neonColor])

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div 
        className={cn("fixed top-0 left-0 right-0 z-50", className)}
        style={{ height: `${height}px` }}
      />
    )
  }

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pointer-events-none",
        className
      )}
      style={{ 
        height: `${height}px`,
        ...glowStyles,
        transition: 'background-color 0.05s ease, box-shadow 0.05s ease',
      }}
      aria-hidden="true"
    />
  )
}

