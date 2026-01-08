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

    // Catmull-Rom to Bezier conversion with tension adjustment
    const tension = 4 // Higher = smoother curves
    const cp1x = p1.x + (p2.x - p0.x) / tension
    const cp1y = p1.y + (p2.y - p0.y) / tension
    const cp2x = p2.x - (p3.x - p1.x) / tension
    const cp2y = p2.y - (p3.y - p1.y) / tension

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

export function NeonCursor({ 
  neonColor = DEFAULT_NEON_COLOR,
  trailDuration = 600,
  maxTrailPoints = 60
}: NeonCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [trail, setTrail] = React.useState<Point[]>([])
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  
  // Refs for smoothing
  const smoothedPositionRef = React.useRef({ x: -100, y: -100 })
  const lastTrailPositionRef = React.useRef({ x: -100, y: -100 })
  const lastTrailTimeRef = React.useRef(0)
  const rawPositionRef = React.useRef({ x: -100, y: -100 })
  const animationRef = React.useRef<number | null>(null)

  // Smoothing factor (0-1, lower = smoother but more lag)
  const smoothingFactor = 0.3
  // Minimum distance between trail points
  const minDistance = 12
  // Minimum time between trail points (ms)
  const minInterval = 16

  // Animation loop for smoothing and trail updates
  React.useEffect(() => {
    if (!isMounted) return

    const animate = () => {
      const now = Date.now()
      
      // Exponential smoothing of cursor position
      smoothedPositionRef.current = {
        x: smoothedPositionRef.current.x + (rawPositionRef.current.x - smoothedPositionRef.current.x) * smoothingFactor,
        y: smoothedPositionRef.current.y + (rawPositionRef.current.y - smoothedPositionRef.current.y) * smoothingFactor,
      }
      
      // Update displayed cursor position
      setPosition({ ...smoothedPositionRef.current })
      
      // Check if we should add a new trail point
      const dx = smoothedPositionRef.current.x - lastTrailPositionRef.current.x
      const dy = smoothedPositionRef.current.y - lastTrailPositionRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const timeSinceLastPoint = now - lastTrailTimeRef.current
      
      if (distance > minDistance && timeSinceLastPoint > minInterval) {
        lastTrailPositionRef.current = { ...smoothedPositionRef.current }
        lastTrailTimeRef.current = now
        
        setTrail(prev => {
          const newTrail = [...prev, { 
            x: smoothedPositionRef.current.x, 
            y: smoothedPositionRef.current.y, 
            timestamp: now 
          }]
          if (newTrail.length > maxTrailPoints) {
            return newTrail.slice(-maxTrailPoints)
          }
          return newTrail
        })
      }
      
      // Remove old trail points
      setTrail(prevTrail => {
        const filteredTrail = prevTrail.filter(
          point => now - point.timestamp < trailDuration
        )
        return filteredTrail
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, trailDuration, maxTrailPoints])

  // Track raw mouse position
  React.useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      rawPositionRef.current = { x: e.clientX, y: e.clientY }
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
