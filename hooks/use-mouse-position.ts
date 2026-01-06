import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook to track mouse position with debouncing for performance
 */
export function useMousePosition(debounceMs: number = 16) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedHandler = (event: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleMouseMove(event);
      }, debounceMs);
    };

    window.addEventListener("mousemove", debouncedHandler);

    return () => {
      window.removeEventListener("mousemove", debouncedHandler);
      clearTimeout(timeoutId);
    };
  }, [handleMouseMove, debounceMs]);

  return mousePosition;
}

