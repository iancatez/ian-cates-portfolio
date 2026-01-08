'use client'

import * as React from 'react'
import fluidCursor from '@/hooks/use-fluid-cursor'

interface FluidCursorProps {
  showCursor?: boolean
}

export function FluidCursor({ showCursor = true }: FluidCursorProps) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isClicking, setIsClicking] = React.useState(false)
  const [hasValidPosition, setHasValidPosition] = React.useState(false)

  // Initialize fluid effect after component mounts
  React.useEffect(() => {
    setIsMounted(true)
    fluidCursor()
  }, [])

  // Track cursor position for the white dot
  React.useEffect(() => {
    if (!isMounted) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!hasValidPosition) {
        setHasValidPosition(true)
      }
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
  }, [isMounted, hasValidPosition])

  const cursorSize = isClicking ? 10 : 12

  return (
    <>
      {/* Fluid canvas - z-[1] to be just above background but below content */}
      <div className="fixed top-0 left-0 z-[1] pointer-events-none">
        <canvas 
          id="fluid" 
          className="w-screen h-screen opacity-5"
        />
      </div>

      {/* White dot cursor */}
      {showCursor && hasValidPosition && (
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
