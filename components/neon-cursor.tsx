"use client"

import * as React from "react"

// Default neon color (green)
const DEFAULT_NEON_COLOR = "142 40% 45%"

interface Point {
  x: number
  y: number
  timestamp: number
  velocity: number // pixels per ms at this point
}

interface NeonCursorProps {
  /** HSL color values (e.g., "142 40% 45%") */
  neonColor?: string
  /** Target trail length in pixels (trail catches up when cursor stops) */
  trailLength?: number
  /** Maximum number of trail points */
  maxTrailPoints?: number
  /** Minimum velocity for trail catch-up when cursor is stationary (pixels/ms) */
  minCatchUpVelocity?: number
}

// Calculate curvature at a point (how sharp the turn is)
function calculateCurvature(p0: Point, p1: Point, p2: Point): number {
  const v1x = p1.x - p0.x
  const v1y = p1.y - p0.y
  const v2x = p2.x - p1.x
  const v2y = p2.y - p1.y
  
  const len1 = Math.sqrt(v1x * v1x + v1y * v1y)
  const len2 = Math.sqrt(v2x * v2x + v2y * v2y)
  
  if (len1 < 0.001 || len2 < 0.001) return 0
  
  const n1x = v1x / len1
  const n1y = v1y / len1
  const n2x = v2x / len2
  const n2y = v2y / len2
  
  const cross = n1x * n2y - n1y * n2x
  const dot = n1x * n2x + n1y * n2y
  
  return Math.abs(Math.atan2(cross, dot)) / Math.PI
}

// Generate smooth curve path with adaptive tension based on curvature
function generateSmoothPath(points: Point[]): string {
  if (points.length < 2) return ""
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  const baseTension = 6
  const maxTension = 12
  const velocityTensionFactor = 2

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const curvature = calculateCurvature(p0, p1, p2)
    const avgVelocity = (p1.velocity + p2.velocity) / 2
    const curvatureTension = curvature * (maxTension - baseTension)
    const velocityTension = Math.min(avgVelocity * velocityTensionFactor, 3)
    const tension = baseTension + curvatureTension + velocityTension

    const cp1x = p1.x + (p2.x - p0.x) / tension
    const cp1y = p1.y + (p2.y - p0.y) / tension
    const cp2x = p2.x - (p3.x - p1.x) / tension
    const cp2y = p2.y - (p3.y - p1.y) / tension

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

// Calculate total path length
function getPathLength(points: Point[]): number {
  let length = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    length += Math.sqrt(dx * dx + dy * dy)
  }
  return length
}

// Get points starting from a distance offset along the path
function getPointsFromOffset(points: Point[], offset: number): Point[] {
  if (offset <= 0 || points.length < 2) return points
  
  let accumulated = 0
  let startIndex = 0
  let startT = 0
  
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    
    if (accumulated + segmentLength >= offset) {
      startIndex = i - 1
      startT = segmentLength > 0 ? (offset - accumulated) / segmentLength : 0
      break
    }
    
    accumulated += segmentLength
    startIndex = i
  }
  
  if (startIndex >= points.length - 1) {
    return []
  }
  
  const p1 = points[startIndex]
  const p2 = points[startIndex + 1]
  const interpolatedStart: Point = {
    x: p1.x + (p2.x - p1.x) * startT,
    y: p1.y + (p2.y - p1.y) * startT,
    timestamp: p1.timestamp + (p2.timestamp - p1.timestamp) * startT,
    velocity: p1.velocity + (p2.velocity - p1.velocity) * startT,
  }
  
  return [interpolatedStart, ...points.slice(startIndex + 1)]
}

// Get average velocity from points
function getAverageVelocity(points: Point[]): number {
  if (points.length === 0) return 0.3
  const sum = points.reduce((acc, p) => acc + p.velocity, 0)
  return sum / points.length
}

// Check if position is valid (not initial placeholder)
function isValidPosition(pos: { x: number; y: number }): boolean {
  return pos.x >= 0 && pos.y >= 0
}

export function NeonCursor({ 
  neonColor = DEFAULT_NEON_COLOR,
  trailLength = 350,
  maxTrailPoints = 250,
  minCatchUpVelocity = 0.3
}: NeonCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [targetPosition, setTargetPosition] = React.useState({ x: -100, y: -100 })
  const [trailPoints, setTrailPoints] = React.useState<Point[]>([])
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  const [hasValidPosition, setHasValidPosition] = React.useState(false)
  
  // Refs
  const smoothedPositionRef = React.useRef({ x: -100, y: -100 })
  const lastTrailPositionRef = React.useRef({ x: -100, y: -100 })
  const lastTrailTimeRef = React.useRef(0)
  const rawPositionRef = React.useRef({ x: -100, y: -100 })
  const animationRef = React.useRef<number | null>(null)
  const lastFrameTimeRef = React.useRef(0)
  const lastMoveTimeRef = React.useRef(0)
  const currentVelocityRef = React.useRef(0)
  const isFirstMoveRef = React.useRef(true)

  // Configuration
  const smoothingFactor = 0.5
  const minPointInterval = 8
  const minPointDistance = 2
  const stopThreshold = 50
  const staleThreshold = 300 // Clear trail if paused longer than this (ms)

  React.useEffect(() => {
    if (!isMounted) return

    const animate = (currentTime: number) => {
      const deltaTime = lastFrameTimeRef.current ? currentTime - lastFrameTimeRef.current : 16
      lastFrameTimeRef.current = currentTime
      const now = Date.now()
      
      // Skip if we don't have a valid position yet
      if (!isValidPosition(rawPositionRef.current)) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      // Initialize smoothed position on first valid move
      if (isFirstMoveRef.current) {
        smoothedPositionRef.current = { ...rawPositionRef.current }
        lastTrailPositionRef.current = { ...rawPositionRef.current }
        lastTrailTimeRef.current = now
        isFirstMoveRef.current = false
      }
      
      // Exponential smoothing of cursor position
      smoothedPositionRef.current = {
        x: smoothedPositionRef.current.x + (rawPositionRef.current.x - smoothedPositionRef.current.x) * smoothingFactor,
        y: smoothedPositionRef.current.y + (rawPositionRef.current.y - smoothedPositionRef.current.y) * smoothingFactor,
      }
      
      setPosition({ ...smoothedPositionRef.current })
      
      // Calculate movement since last trail point
      const dx = smoothedPositionRef.current.x - lastTrailPositionRef.current.x
      const dy = smoothedPositionRef.current.y - lastTrailPositionRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const timeSinceLastPoint = now - lastTrailTimeRef.current
      
      // Check for stale trail (long pause) - clear and reset
      if (timeSinceLastPoint > staleThreshold && trailPoints.length > 0) {
        setTrailPoints([])
        lastTrailPositionRef.current = { ...smoothedPositionRef.current }
        lastTrailTimeRef.current = now
        currentVelocityRef.current = 0
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      // Calculate current velocity
      const instantVelocity = timeSinceLastPoint > 0 ? distance / timeSinceLastPoint : 0
      currentVelocityRef.current = currentVelocityRef.current * 0.6 + instantVelocity * 0.4
      
      // Check if cursor is moving
      const timeSinceMove = now - lastMoveTimeRef.current
      const isStopped = timeSinceMove > stopThreshold
      
      // Adaptive sampling
      const adaptiveMinDistance = Math.max(minPointDistance, minPointDistance * (1 - currentVelocityRef.current))
      const adaptiveMinInterval = Math.max(minPointInterval / 2, minPointInterval * (1 - currentVelocityRef.current * 0.5))
      
      // Add new trail point if moving enough
      const shouldAddPoint = (
        timeSinceLastPoint >= adaptiveMinInterval &&
        distance >= adaptiveMinDistance &&
        isValidPosition(smoothedPositionRef.current) &&
        isVisible
      )
      
      if (shouldAddPoint) {
        const velocity = Math.max(instantVelocity, minCatchUpVelocity)
        
        lastTrailPositionRef.current = { ...smoothedPositionRef.current }
        lastTrailTimeRef.current = now
        
        setTrailPoints(prev => {
          const newPoint: Point = {
            x: smoothedPositionRef.current.x,
            y: smoothedPositionRef.current.y,
            timestamp: now,
            velocity: velocity,
          }
          
          const newTrail = [...prev, newPoint]
          
          if (newTrail.length > maxTrailPoints) {
            return newTrail.slice(-maxTrailPoints)
          }
          return newTrail
        })
      }
      
      // Advance trail offset (tail catches up)
      setTrailPoints(currentPoints => {
        if (currentPoints.length < 2) return currentPoints
        
        const pathLength = getPathLength(currentPoints)
        
        const tailVelocity = isStopped 
          ? Math.max(getAverageVelocity(currentPoints.slice(0, 5)), minCatchUpVelocity)
          : currentPoints[0]?.velocity || minCatchUpVelocity
        
        const advanceDistance = tailVelocity * deltaTime
        
        const targetLength = isStopped ? 0 : trailLength
        const excessLength = Math.max(0, pathLength - targetLength)
        
        if (excessLength > 0 || isStopped) {
          const newOffset = Math.min(advanceDistance, pathLength)
          const offsetPoints = getPointsFromOffset(currentPoints, newOffset)
          
          if (offsetPoints.length < 2) {
            return []
          }
          
          return offsetPoints
        }
        
        return currentPoints
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMounted, maxTrailPoints, trailLength, minCatchUpVelocity, isVisible, trailPoints.length])

  // Track raw mouse position
  React.useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      rawPositionRef.current = newPos
      lastMoveTimeRef.current = Date.now()
      setTargetPosition(newPos)
      
      // Mark that we have a valid position
      if (!hasValidPosition) {
        setHasValidPosition(true)
        // Initialize positions immediately on first move
        smoothedPositionRef.current = newPos
        lastTrailPositionRef.current = newPos
        setPosition(newPos)
      }
      
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      // Reset positions when re-entering to avoid line from old position
      const newPos = { x: e.clientX, y: e.clientY }
      rawPositionRef.current = newPos
      smoothedPositionRef.current = newPos
      lastTrailPositionRef.current = newPos
      lastTrailTimeRef.current = Date.now()
      setTargetPosition(newPos)
      setPosition(newPos)
      setTrailPoints([]) // Clear old trail
      setIsVisible(true)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

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
  }, [hasValidPosition])

  // Build trail with cursor position at the end
  // Only include valid points
  const trailWithCursor = React.useMemo(() => {
    // Filter out any invalid points
    const validPoints = trailPoints.filter(p => isValidPosition(p))
    
    if (validPoints.length === 0 || !isValidPosition(targetPosition)) {
      return []
    }
    
    const lastPoint = validPoints[validPoints.length - 1]
    const dx = targetPosition.x - lastPoint.x
    const dy = targetPosition.y - lastPoint.y
    const distToLast = Math.sqrt(dx * dx + dy * dy)
    
    // Add cursor position if different from last point
    if (distToLast > 0.5) {
      return [...validPoints, {
        x: targetPosition.x,
        y: targetPosition.y,
        timestamp: Date.now(),
        velocity: lastPoint.velocity,
      }]
    }
    return validPoints
  }, [trailPoints, targetPosition.x, targetPosition.y])

  // Don't render on server or on touch devices
  if (!isMounted) {
    return null
  }

  const cursorSize = isClicking ? 10 : 12
  const smoothPath = generateSmoothPath(trailWithCursor)

  // Only show trail if we have valid points
  const showTrail = trailWithCursor.length > 1 && hasValidPosition

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
        
        {showTrail && (
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
      {hasValidPosition && (
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
      )}
    </>
  )
}
