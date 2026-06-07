"use client";

import * as React from "react";
import { useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animation-config";
import GridScan from "@/components/grid-scan";

/**
 * Walk offsetParent chain so framer-motion `y` transforms (which warp
 * getBoundingClientRect) don't break scroll-to-section math. offsetTop is
 * layout-pure.
 */
function getAbsoluteTop(el: HTMLElement): number {
  let y = 0;
  let cur: HTMLElement | null = el;
  while (cur) {
    y += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return y;
}

const NAV_HEIGHT = 56; // h-14

const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function HeroSection() {
  const reduced = typeof window !== "undefined" && prefersReducedMotion();
  const [showChevron, setShowChevron] = React.useState(true);

  // Hide the chevron once the user has scrolled past a chunk of the hero so
  // it doesn't linger over the next section after the scroll lands.
  React.useEffect(() => {
    const onScroll = () => {
      setShowChevron(window.scrollY < window.innerHeight * 0.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use layout-pure offsetTop instead of scrollIntoView's bounding-rect math,
  // so framer-motion's `y: 30` transform on AnimatedSection doesn't cause the
  // scroll to land short of the target.
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = getAbsoluteTop(el) - NAV_HEIGHT;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center"
    >
      {/* GridScan with vertical mask: full strength up top, fading out toward
          the bottom so the hero blends smoothly into the next section. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0) 100%)",
        }}
      >
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#1f3528"
          gridScale={0.1}
          scanColor="#3dff8c"
          scanOpacity={0.45}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          lineJitter={0.1}
          scanGlow={0.5}
          scanSoftness={2}
          // ~50% slower than the default 2s/2s cycle
          scanDuration={3.5}
          scanDelay={3}
          // Mouse already drives skew/tilt; clicking the hero fires an extra
          // scan beam so the surface feels responsive.
          scanOnClick
        />
      </div>
      {/* Soft fade behind the headline so text reads cleanly over the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at center, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0) 70%)",
        }}
      />
      {/* Bottom-edge wash that matches the page background so the hero hands
          off into the About section without a visible seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0) 0%, hsl(var(--background) / 1) 100%)",
        }}
      />
      <motion.div
        variants={reduced ? undefined : heroContainer}
        initial={reduced ? { opacity: 1 } : "hidden"}
        animate="visible"
        className="relative z-10 max-w-2xl space-y-6"
      >
        <motion.p
          variants={reduced ? undefined : heroItem}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          $ whoami
        </motion.p>

        <motion.h1
          variants={reduced ? undefined : heroItem}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          Ian Cates
        </motion.h1>

        <motion.p
          variants={reduced ? undefined : heroItem}
          className="text-lg text-muted-foreground sm:text-xl"
        >
          Data engineer building serverless data platforms on the cloud.
        </motion.p>

        <motion.p
          variants={reduced ? undefined : heroItem}
          className="mx-auto max-w-xl text-sm text-muted-foreground/80 sm:text-base"
        >
          Ingestion pipelines, internal APIs, operator portals, and the
          Terraform that ships them all.
        </motion.p>

        <motion.div
          variants={reduced ? undefined : heroItem}
          className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row"
        >
          <Button size="lg" onClick={() => scrollTo("projects")}>
            View projects
          </Button>
          <Button size="lg" onClick={() => scrollTo("about")}>
            About me
          </Button>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: showChevron ? 0.6 : 0 }}
        transition={{
          delay: showChevron ? 1.2 : 0,
          duration: showChevron ? 0.6 : 0.25,
        }}
        style={{ pointerEvents: showChevron ? "auto" : "none" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.button>
    </section>
  );
}
