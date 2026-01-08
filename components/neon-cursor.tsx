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

export function NeonCursor({ 
  neonColor = DEFAULT_NEON_COLOR,
  trailDuration = 400,
  maxTrailPoints = 50
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
      
      if (distance > 3) {
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
  const now = Date.now()

  return (
    <>
      {/* Neon trail - rendered as SVG for smooth lines */}
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
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Draw trail segments */}
        {trail.length > 1 && (
          <g filter="url(#neon-glow)">
            {trail.map((point, index) => {
              if (index === 0) return null
              const prevPoint = trail[index - 1]
              const age = now - point.timestamp
              const opacity = Math.max(0, 1 - age / trailDuration)
              const strokeWidth = 2 + (1 - age / trailDuration) * 2
              
              return (
                <line
                  key={`${point.timestamp}-${index}`}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke={`hsl(${neonColor} / ${opacity})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              )
            })}
          </g>
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
