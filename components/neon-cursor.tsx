"use client"

import * as React from "react"

// Default neon color (green)
const DEFAULT_NEON_COLOR = "142 40% 45%"

interface Point {
  x: number
  y: number
  timestamp: number
}

interface NeonCursorProps {
  /** HSL color values (e.g., "142 40% 45%") */
  neonColor?: string
  /** How long the trail lasts in milliseconds */
  trailDuration?: number
  /** Maximum number of trail points */
  maxTrailPoints?: number
}

// Generate smooth curve path through points using Catmull-Rom spline
function generateSmoothPath(points: Point[]): string {
  if (points.length < 2) return ""
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    // Catmull-Rom to Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

export function NeonCursor({ 
  neonColor = DEFAULT_NEON_COLOR,
  trailDuration = 500,
  maxTrailPoints = 80
}: NeonCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [trail, setTrail] = React.useState<Point[]>([])
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  
  const lastPositionRef = React.useRef({ x: -100, y: -100 })
  const animationRef = React.useRef<number | null>(null)

  // Update trail and fade old points
  React.useEffect(() => {
    if (!isMounted) return

    const updateTrail = () => {
      const now = Date.now()
      
      setTrail(prevTrail => {
        // Remove old points
        const filteredTrail = prevTrail.filter(
          point => now - point.timestamp < trailDuration
        )
        return filteredTrail
      })
      
      animationRef.current = requestAnimationFrame(updateTrail)
    }

    animationRef.current = requestAnimationFrame(updateTrail)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, trailDuration])

  // Track mouse position
  React.useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setPosition(newPos)
      setIsVisible(true)
      
      // Only add to trail if moved enough distance (prevents clustering)
      const dx = newPos.x - lastPositionRef.current.x
      const dy = newPos.y - lastPositionRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 5) {
        lastPositionRef.current = newPos
        setTrail(prev => {
          const newTrail = [...prev, { ...newPos, timestamp: Date.now() }]
          // Limit trail length
          if (newTrail.length > maxTrailPoints) {
            return newTrail.slice(-maxTrailPoints)
          }
          return newTrail
        })
      }
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
  }, [maxTrailPoints])

  // Don't render on server or on touch devices
  if (!isMounted) {
    return null
  }

  const cursorSize = isClicking ? 10 : 12
  const smoothPath = generateSmoothPath(trail)

  return (
    <>
      {/* Neon trail - rendered as SVG for smooth curves */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9997,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Glow filter for neon effect */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feGaussianBlur stdDeviation="8" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Gradient for fading trail */}
          <linearGradient id="trail-gradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={`hsl(${neonColor})`} stopOpacity="0" />
            <stop offset="30%" stopColor={`hsl(${neonColor})`} stopOpacity="0.6" />
            <stop offset="100%" stopColor={`hsl(${neonColor})`} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Smooth trail path */}
        {trail.length > 1 && (
          <path
            d={smoothPath}
            fill="none"
            stroke={`hsl(${neonColor})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon-glow)"
            style={{
              opacity: 0.9,
            }}
          />
        )}
      </svg>

      {/* Custom cursor - bold white dot */}
      <div
        style={{
          position: 'fixed',
          left: position.x - cursorSize / 2,
          top: position.y - cursorSize / 2,
          width: cursorSize,
          height: cursorSize,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 2px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isClicking ? 0.8 : 1})`,
          transition: 'opacity 0.2s ease, transform 0.1s ease',
        }}
        aria-hidden="true"
      />
    </>
  )
}
