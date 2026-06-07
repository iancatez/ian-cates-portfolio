"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional architecture/workflow diagram rendered above the body */
  diagram?: React.ReactNode;
  /** Optional named sub-sections (e.g., highlights, responsibilities) */
  highlights?: { label: string; items: string[] }[];
  /**
   * Fully custom body. When provided, replaces the standard
   * diagram/longDescription/highlights layout — used to give each project a
   * distinct visual identity.
   */
  customBody?: React.ReactNode;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  diagram,
  highlights,
  customBody,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl">
            {project.title}
          </DialogTitle>
          {project.description && (
            <DialogDescription className="text-sm sm:text-base leading-relaxed">
              {project.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-auto pr-1 pt-2">
          {project.technologies?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="bg-background/40 text-[11px]"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          ) : null}

          {customBody ?? (
            <>
              {diagram && (
                <section className="space-y-2">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Architecture
                  </h3>
                  {diagram}
                </section>
              )}

              {project.longDescription && (
                <section className="space-y-2">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    What it does
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {project.longDescription}
                  </p>
                </section>
              )}

              {highlights?.length ? (
                <section className="space-y-4">
                  {highlights.map(({ label, items }) => (
                    <div key={label} className="space-y-2">
                      <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {label}
                      </h3>
                      <ul className="grid gap-1.5 text-sm text-muted-foreground sm:text-[15px]">
                        {items.map((item) => (
                          <li key={item} className="flex gap-2 leading-relaxed">
                            <span
                              aria-hidden="true"
                              className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
