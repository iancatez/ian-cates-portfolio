"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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

const NAV_HEIGHT = 56; // matches h-14 on the container

export function SectionNav({ className }: SectionNavProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeId, setActiveId] = React.useState<SectionId>("home");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement | null>(null);

  // Lock so a click-initiated smooth scroll doesn't get its activeId
  // re-computed by the scroll listener as the page passes through intermediate
  // sections.
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
    // Active when its top has scrolled into the upper 2/3 of the viewport —
    // so the next section lights up when its heading is clearly visible.
    const VIEWPORT_FOCUS_RATIO = 0.66;
    const ids = SECTIONS.map((s) => s.id);

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

    setActiveId(id);
    lockRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      lockRef.current = false;
    }, 900);

    let y = 0;
    let cur: HTMLElement | null = el;
    while (cur) {
      y += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    window.scrollTo({ top: y - NAV_HEIGHT, behavior: "smooth" });
  }, []);

  const scrollToAndClose = React.useCallback(
    (id: SectionId) => {
      setMobileOpen(false);
      scrollTo(id);
    },
    [scrollTo]
  );

  // Close the mobile menu if the viewport grows past `sm`. Avoids the dropdown
  // staying open after rotating a phone to landscape (or resizing on dev).
  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  // Close the mobile menu when the user taps anywhere outside the nav, or
  // presses Escape. Only listens while the menu is open.
  React.useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (
        navRef.current &&
        e.target instanceof Node &&
        !navRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  const visibleNavItems = SECTIONS.filter((s) => s.id !== "home");

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
        scrolled || mobileOpen
          ? "border-b border-border/40 bg-background/85 backdrop-blur-md"
          : "bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-6">
        {/* Brand — desktop pill underline + mobile-friendly press target */}
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
          iancates
          <span className="text-muted-foreground transition-colors duration-200 group-hover:text-primary">
            .dev
          </span>
          {activeId === "home" && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-1 hidden justify-center sm:flex"
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

        {/* Desktop inline nav items */}
        <div className="hidden items-center gap-3 sm:flex">
          {visibleNavItems.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative inline-flex shrink-0 items-center justify-center rounded px-3 py-1 text-sm font-medium transition-colors duration-200",
                  "min-w-[72px] text-center",
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
                      className="h-[3px] w-16 rounded-full bg-primary"
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

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className={cn(
            "-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors sm:hidden",
            "hover:bg-muted/40 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          )}
        >
          <span className="sr-only">
            {mobileOpen ? "Close menu" : "Open menu"}
          </span>
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-md sm:hidden"
          >
            <ul className="flex flex-col gap-1 px-3 py-3">
              {visibleNavItems.map(({ id, label }) => {
                const isActive = activeId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollToAndClose(id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      )}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-primary"
                          style={{
                            boxShadow:
                              "0 0 8px hsl(var(--primary) / 0.7), 0 0 14px hsl(var(--primary) / 0.35)",
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
