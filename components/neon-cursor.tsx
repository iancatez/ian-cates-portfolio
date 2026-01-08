"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Default neon color (green)
const DEFAULT_NEON_COLOR = "142 40% 45%"

interface NeonCursorProps {
  className?: string
  /** HSL color values (e.g., "142 40% 45%") */
  neonColor?: string
  /** Size of the cursor glow in pixels */
  size?: number
  /** Whether to show the trailing effect */
  showTrail?: boolean
}

export function NeonCursor({ 
  className, 
  neonColor = DEFAULT_NEON_COLOR,
  size = 20,
  showTrail = true
}: NeonCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [trailPosition, setTrailPosition] = React.useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  
  const trailRef = React.useRef({ x: -100, y: -100 })
  const animationRef = React.useRef<number | null>(null)

  // Smooth trail animation using requestAnimationFrame
  React.useEffect(() => {
    if (!isMounted) return

    const animateTrail = () => {
      const dx = position.x - trailRef.current.x
      const dy = position.y - trailRef.current.y
      
      // Smooth easing - trail follows with delay
      trailRef.current.x += dx * 0.15
      trailRef.current.y += dy * 0.15
      
      setTrailPosition({ x: trailRef.current.x, y: trailRef.current.y })
      
      animationRef.current = requestAnimationFrame(animateTrail)
    }

    animationRef.current = requestAnimationFrame(animateTrail)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [position, isMounted])

  // Track mouse position
  React.useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    // Check if device supports hover (desktop)
    const hasHover = window.matchMedia('(hover: hover)').matches
    
    if (hasHover) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('mouseenter', handleMouseEnter)
      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Don't render on server or on touch devices
  if (!isMounted) {
    return null
  }

  const cursorSize = isClicking ? size * 0.8 : size
  const trailSize = size * 1.5

  const cursorStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x - cursorSize / 2,
    top: position.y - cursorSize / 2,
    width: cursorSize,
    height: cursorSize,
    borderRadius: '50%',
    backgroundColor: `hsl(${neonColor} / 0.8)`,
    boxShadow: `
      0 0 ${cursorSize * 0.5}px hsl(${neonColor} / 0.8),
      0 0 ${cursorSize}px hsl(${neonColor} / 0.6),
      0 0 ${cursorSize * 1.5}px hsl(${neonColor} / 0.4),
      0 0 ${cursorSize * 2}px hsl(${neonColor} / 0.2)
    `,
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: isVisible ? 1 : 0,
    transform: `scale(${isClicking ? 0.8 : 1})`,
    transition: 'opacity 0.3s ease, transform 0.1s ease, width 0.1s ease, height 0.1s ease',
    mixBlendMode: 'screen',
  }

  const trailStyle: React.CSSProperties = {
    position: 'fixed',
    left: trailPosition.x - trailSize / 2,
    top: trailPosition.y - trailSize / 2,
    width: trailSize,
    height: trailSize,
    borderRadius: '50%',
    border: `1px solid hsl(${neonColor} / 0.4)`,
    backgroundColor: 'transparent',
    boxShadow: `
      0 0 ${trailSize * 0.3}px hsl(${neonColor} / 0.2),
      inset 0 0 ${trailSize * 0.3}px hsl(${neonColor} / 0.1)
    `,
    pointerEvents: 'none',
    zIndex: 9998,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }

  return (
    <>
      {/* Trail ring */}
      {showTrail && (
        <div 
          className={cn("neon-cursor-trail", className)}
          style={trailStyle}
          aria-hidden="true"
        />
      )}
      
      {/* Main cursor dot */}
      <div 
        className={cn("neon-cursor", className)}
        style={cursorStyle}
        aria-hidden="true"
      />
    </>
  )
}

