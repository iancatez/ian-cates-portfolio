"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Default neon color (green)
const DEFAULT_NEON_COLOR = "142 40% 45%"

interface NeonCursorProps {
  className?: string
  /** HSL color values (e.g., "142 40% 45%") */
  neonColor?: string
  /** Size of the glow effect in pixels */
  size?: number
}

export function NeonCursor({ 
  className, 
  neonColor = DEFAULT_NEON_COLOR,
  size = 40
}: NeonCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  
  const glowRef = React.useRef({ x: -100, y: -100 })
  const animationRef = React.useRef<number | null>(null)

  // Smooth glow animation using requestAnimationFrame
  React.useEffect(() => {
    if (!isMounted) return

    const animateGlow = () => {
      const dx = position.x - glowRef.current.x
      const dy = position.y - glowRef.current.y
      
      // Smooth easing - glow follows cursor with slight delay
      glowRef.current.x += dx * 0.2
      glowRef.current.y += dy * 0.2
      
      // Force re-render by updating a ref-based position
      const glowElement = document.getElementById('neon-glow-effect')
      if (glowElement) {
        glowElement.style.left = `${glowRef.current.x - size / 2}px`
        glowElement.style.top = `${glowRef.current.y - size / 2}px`
      }
      
      animationRef.current = requestAnimationFrame(animateGlow)
    }

    animationRef.current = requestAnimationFrame(animateGlow)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [position, isMounted, size])

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

  const glowSize = isClicking ? size * 1.3 : size

  const glowStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x - glowSize / 2,
    top: position.y - glowSize / 2,
    width: glowSize,
    height: glowSize,
    borderRadius: '50%',
    background: `radial-gradient(circle, hsl(${neonColor} / 0.3) 0%, hsl(${neonColor} / 0.1) 40%, transparent 70%)`,
    boxShadow: `
      0 0 ${glowSize * 0.5}px hsl(${neonColor} / 0.4),
      0 0 ${glowSize}px hsl(${neonColor} / 0.2),
      0 0 ${glowSize * 1.5}px hsl(${neonColor} / 0.1)
    `,
    pointerEvents: 'none',
    zIndex: 9998,
    opacity: isVisible ? 1 : 0,
    transform: `scale(${isClicking ? 1.2 : 1})`,
    transition: 'opacity 0.3s ease, transform 0.15s ease',
    mixBlendMode: 'screen',
  }

  return (
    <div 
      id="neon-glow-effect"
      className={cn("neon-cursor-glow", className)}
      style={glowStyle}
      aria-hidden="true"
    />
  )
}
