"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Lightweight, hand-laid-out architecture diagram primitives.
 *
 * These are intentionally simple compared to the React Flow diagram used by
 * the FinOps platform — they render fast inside modals, are responsive, and
 * read well on mobile.
 */

interface DiagramFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function DiagramFrame({ children, className }: DiagramFrameProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-card/40 p-4",
        "backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DiagramRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function DiagramRow({ label, children, className }: DiagramRowProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

interface DiagramNodeProps {
  Icon: LucideIcon;
  label: string;
  description?: string;
  tone?: "source" | "compute" | "storage" | "consume" | "auth" | "neutral";
  className?: string;
}

const TONE_STYLES: Record<NonNullable<DiagramNodeProps["tone"]>, string> = {
  source:
    "border-cyan-500/30 bg-cyan-500/5 text-cyan-200 [--tone-icon:hsl(180_70%_60%)]",
  compute:
    "border-orange-500/30 bg-orange-500/5 text-orange-200 [--tone-icon:hsl(28_90%_60%)]",
  storage:
    "border-red-500/30 bg-red-500/5 text-red-200 [--tone-icon:hsl(0_70%_65%)]",
  consume:
    "border-emerald-500/30 bg-emerald-500/5 text-emerald-200 [--tone-icon:hsl(142_60%_60%)]",
  auth:
    "border-violet-500/30 bg-violet-500/5 text-violet-200 [--tone-icon:hsl(265_70%_70%)]",
  neutral:
    "border-border/60 bg-background/40 text-foreground [--tone-icon:hsl(0_0%_75%)]",
};

export function DiagramNode({
  Icon,
  label,
  description,
  tone = "neutral",
  className,
}: DiagramNodeProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border p-3 transition-colors",
        TONE_STYLES[tone],
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className="h-4 w-4 shrink-0"
          style={{ color: "var(--tone-icon)" }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold leading-tight text-foreground">
          {label}
        </span>
      </div>
      {description && (
        <p className="text-[11px] leading-snug text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

interface DiagramArrowProps {
  label?: string;
  className?: string;
}

export function DiagramArrow({ label, className }: DiagramArrowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center py-1",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1">
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
        <svg
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2 L12 14 M6 10 L12 16 L18 10"
            stroke="hsl(var(--primary) / 0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

interface DiagramLegendProps {
  items: { tone: NonNullable<DiagramNodeProps["tone"]>; label: string }[];
  className?: string;
}

export function DiagramLegend({ items, className }: DiagramLegendProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-[11px] text-muted-foreground",
        className
      )}
    >
      {items.map(({ tone, label }) => {
        const swatchStyle = TONE_STYLES[tone];
        return (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm border",
                swatchStyle
              )}
              aria-hidden="true"
            />
            {label}
          </span>
        );
      })}
    </div>
  );
}
