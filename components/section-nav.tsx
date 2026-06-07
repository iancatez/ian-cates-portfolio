"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

  // When the user CLICKS a nav item, we kick off a smooth scroll. While that
  // scroll is in flight, the page passes through intermediate sections — and
  // without a lock the scroll listener would fire activeId updates for each
  // one, making the pill ping-pong. The lock holds activeId at the clicked
  // target until the page settles.
  const lockRef = React.useRef(false);
  const lockTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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
      // If a click-initiated smooth scroll is in flight, leave the activeId
      // alone — the click already pinned it to the intended target.
      if (lockRef.current) return;

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

    // Pin the pill to the clicked target. Without this lock, the scroll
    // listener would re-compute activeId for every intermediate section the
    // smooth scroll passes through, causing the pill to ping-pong.
    setActiveId(id);
    lockRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    // Smooth-scroll usually finishes in ~500ms; give the lock a generous
    // window so the recompute only re-engages once the page has settled.
    lockTimeoutRef.current = setTimeout(() => {
      lockRef.current = false;
    }, 900);

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  React.useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
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
          {activeId === "home" && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center"
            >
              <motion.span
                layoutId="nav-active-pill"
                className="h-[3px] w-12 rounded-full bg-primary sm:w-16"
                style={{
                  boxShadow:
                    "0 0 10px hsl(var(--primary) / 0.7), 0 0 20px hsl(var(--primary) / 0.45)",
                }}
                transition={{
                  type: "tween",
                  duration: 0.35,
                  ease: [0, 0, 0.2, 1],
                }}
              />
            </span>
          )}
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
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center"
                  >
                    <motion.span
                      layoutId="nav-active-pill"
                      className="h-[3px] w-12 rounded-full bg-primary sm:w-16"
                      style={{
                        boxShadow:
                          "0 0 10px hsl(var(--primary) / 0.7), 0 0 20px hsl(var(--primary) / 0.45)",
                      }}
                      transition={{
                        type: "tween",
                        duration: 0.35,
                        ease: [0, 0, 0.2, 1],
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
