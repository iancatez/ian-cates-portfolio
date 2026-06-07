"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  className?: string;
}

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "outcomes", label: "Outcomes" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function SectionNav({ className }: SectionNavProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeId, setActiveId] = React.useState<SectionId>("home");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    // A section is "active" when its top has scrolled into the upper portion
    // of the viewport. Using ~2/3 down so the next section lights up as soon
    // as its heading is clearly visible at the bottom of the screen — not
    // only after it's all the way at the top under the nav.
    const VIEWPORT_FOCUS_RATIO = 0.66;
    const ids = SECTIONS.map((s) => s.id);

    // Walk offsetParent chain so framer-motion's `y` transforms (which warp
    // getBoundingClientRect) don't break detection. offsetTop is layout-pure.
    const getAbsoluteTop = (el: HTMLElement) => {
      let y = 0;
      let cur: HTMLElement | null = el;
      while (cur) {
        y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return y;
    };

    const recompute = () => {
      const threshold =
        window.scrollY + window.innerHeight * VIEWPORT_FOCUS_RATIO;
      let bestId: SectionId = "home";
      let bestTop = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = getAbsoluteTop(el);
        if (top <= threshold && top > bestTop) {
          bestTop = top;
          bestId = id;
        }
      }
      setActiveId((prev) => (prev === bestId ? prev : bestId));
    };

    recompute();
    const onScroll = () => requestAnimationFrame(recompute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTo = React.useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Optimistic highlight on click — the scroll listener will keep it accurate
    // as the smooth scroll progresses or the user scrolls further.
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md"
          : "bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-6">
        {/* Brand — same hover/active treatment as the nav items.
            Acts as the "Home" indicator: underline lights up when activeId === "home". */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          aria-current={activeId === "home" ? "page" : undefined}
          className={cn(
            "group relative rounded px-2 py-1 font-mono text-xs sm:text-sm sm:px-3 tracking-tight text-foreground",
            "transition-colors duration-200 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          )}
        >
          ian_cates
          <span className="text-muted-foreground transition-colors duration-200 group-hover:text-primary">
            .dev
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -bottom-1 left-1/2 h-[3px] w-12 sm:w-16 -translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200",
              "group-hover:opacity-100",
              activeId === "home" && "opacity-100"
            )}
            style={{
              boxShadow:
                "0 0 10px hsl(var(--primary) / 0.7), 0 0 20px hsl(var(--primary) / 0.45)",
            }}
          />
        </button>

        <div className="flex items-center gap-0 sm:gap-3">
          {SECTIONS.filter((s) => s.id !== "home").map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative inline-flex shrink-0 items-center justify-center rounded px-2 py-1 text-xs sm:text-sm sm:px-3 font-medium transition-colors duration-200",
                  "sm:min-w-[72px] text-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -bottom-1 left-1/2 h-[3px] w-12 sm:w-16 -translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200",
                    "group-hover:opacity-100",
                    isActive && "opacity-100"
                  )}
                  style={{
                    boxShadow:
                      "0 0 10px hsl(var(--primary) / 0.7), 0 0 20px hsl(var(--primary) / 0.45)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
