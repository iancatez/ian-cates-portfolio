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

interface ProjectCardProps {
  title: string;
  description: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  // Legacy prop names for backward compatibility
  link?: string;
  github?: string;
}

export function ProjectCard({
  title,
  description,
  technologies = [],
  liveUrl,
  githubUrl,
  link, // Legacy prop
  github, // Legacy prop
}: ProjectCardProps) {
  // Use new prop names if available, fall back to legacy names
  const projectLink = liveUrl || link;
  const projectGithub = githubUrl || github;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {technologies.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      )}
      {(projectLink || projectGithub) && (
        <CardFooter className="mt-auto gap-2">
          {projectLink && (
            <Button asChild variant="default" size="sm">
              <Link href={projectLink} target="_blank" rel="noopener noreferrer">
                View Project
              </Link>
            </Button>
          )}
          {projectGithub && (
            <Button asChild variant="outline" size="sm">
              <Link href={projectGithub} target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

