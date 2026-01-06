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
  link?: string;
  github?: string;
}

export function ProjectCard({
  title,
  description,
  technologies = [],
  link,
  github,
}: ProjectCardProps) {
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
      {(link || github) && (
        <CardFooter className="mt-auto gap-2">
          {link && (
            <Button asChild variant="default" size="sm">
              <Link href={link} target="_blank" rel="noopener noreferrer">
                View Project
              </Link>
            </Button>
          )}
          {github && (
            <Button asChild variant="outline" size="sm">
              <Link href={github} target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

