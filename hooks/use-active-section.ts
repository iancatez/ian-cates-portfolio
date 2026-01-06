import { useState, useEffect, useRef } from "react";

/**
 * Hook to track which section is currently in view
 * Returns the ID of the active section
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observers: Map<string, IntersectionObserverEntry> = new Map();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observers.set(entry.target.id, entry);
          } else {
            observers.delete(entry.target.id);
          }
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let mostVisible = "";

        observers.forEach((entry, id) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = id;
          }
        });

        if (mostVisible) {
          setActiveSection(mostVisible);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds]);

  return activeSection;
}

