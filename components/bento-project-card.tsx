"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { AnimatedText } from "@/components/typewriter-text";
import { featureFlags } from "@/lib/feature-flags";

interface BentoProjectCardProps extends Project {
  className?: string;
  /** If true, clicking the card opens an interactive modal */
  hasInteractiveDemo?: boolean;
  /** Click handler for interactive demo */
  onInteractiveClick?: () => void;
  /** Button label for the interactive trigger (default: "Details") */
  interactiveLabel?: string;
}

export function BentoProjectCard({
  title,
  description,
  technologies = [],
  liveUrl,
  githubUrl,
  bentoSize = "normal",
  className,
  hasInteractiveDemo,
  onInteractiveClick,
  interactiveLabel = "Details",
}: BentoProjectCardProps) {
  const hasFooter = liveUrl || githubUrl || hasInteractiveDemo;
  const isLarge = bentoSize === "large";
  
  return (
    <Card
      noGlow
      onClick={hasInteractiveDemo ? onInteractiveClick : undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden transition-colors duration-200",
        "border-border/60 bg-card/40",
        "hover:border-border hover:bg-card/60",
        hasInteractiveDemo && "cursor-pointer",
        className
      )}
    >
      <CardHeader className="p-3 pb-1.5">
        {isLarge && (
          <Badge
            variant="outline"
            className="mb-1 w-fit border-border/60 bg-background/40 text-[10px] font-normal text-muted-foreground"
          >
            Featured
          </Badge>
        )}
        
        {featureFlags.enableTypewriterEffect ? (
          <AnimatedText
            text={title}
            animation="blur"
            as="div"
            className={cn(
              "font-semibold leading-tight tracking-tight",
              isLarge ? "text-lg" : "text-sm"
            )}
          />
        ) : (
          <CardTitle className={cn(
            "leading-tight",
            isLarge ? "text-lg" : "text-sm"
          )}>
            {title}
          </CardTitle>
        )}
        
        {featureFlags.enableTypewriterEffect ? (
          <AnimatedText
            text={description}
            animation="fade"
            delay={100}
            as="div"
            className="text-xs text-muted-foreground leading-snug line-clamp-3"
          />
        ) : (
          <CardDescription className="text-xs leading-snug line-clamp-3">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {technologies.length > 0 && (
        <CardContent className="p-3 pt-0 pb-1.5">
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[10px] px-1.5 py-0.5 bg-background/50"
              >
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-background/50">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      )}

      {hasFooter && (
        <CardFooter className="p-3 pt-1.5 mt-auto gap-2">
          {hasInteractiveDemo && (
            <Button
              size="sm"
              className="h-7 text-xs px-3"
              onClick={(e) => {
                e.stopPropagation();
                onInteractiveClick?.();
              }}
            >
              <Expand className="h-3 w-3 mr-1" />
              {interactiveLabel}
            </Button>
          )}
          {liveUrl && !hasInteractiveDemo && (
            <Button asChild size="sm" className="h-7 text-xs px-3">
              <Link
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          )}
          {githubUrl && (
            <Button
              asChild
              size="sm"
              neonColor="#6e7681"
              className="h-7 text-xs px-3"
            >
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-3 w-3 mr-1" />
                GitHub
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
