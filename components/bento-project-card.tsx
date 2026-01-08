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

interface BentoProjectCardProps extends Project {
  className?: string;
  /** If true, clicking the card opens an interactive modal */
  hasInteractiveDemo?: boolean;
  /** Click handler for interactive demo */
  onInteractiveClick?: () => void;
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
}: BentoProjectCardProps) {
  const hasFooter = liveUrl || githubUrl || hasInteractiveDemo;
  const isLarge = bentoSize === "large";
  
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden",
        "border-border/50 bg-card/80 backdrop-blur-sm",
        className
      )}
    >
      <CardHeader className="p-4 pb-2">
        {isLarge && (
          <Badge variant="secondary" className="w-fit text-[10px] mb-1">
            Featured
          </Badge>
        )}
        
        <CardTitle className={cn(
          "leading-tight",
          isLarge ? "text-xl" : "text-base"
        )}>
          {title}
        </CardTitle>
        
        <CardDescription className="text-sm leading-snug line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      {technologies.length > 0 && (
        <CardContent className="p-4 pt-0 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {technologies.slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[10px] px-2 py-0.5 bg-background/50"
              >
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background/50">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
      
      {hasFooter && (
        <CardFooter className="p-4 pt-2 mt-auto gap-2">
          {hasInteractiveDemo && (
            <Button 
              size="sm" 
              className="h-7 text-xs px-3"
              onClick={onInteractiveClick}
              neonColor="#3b82f6"
            >
              <Expand className="h-3 w-3 mr-1" />
              Explore
            </Button>
          )}
          {liveUrl && !hasInteractiveDemo && (
            <Button asChild size="sm" className="h-7 text-xs px-3">
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          )}
          {githubUrl && (
            <Button asChild size="sm" neonColor="#6e7681" className="h-7 text-xs px-3">
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
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
