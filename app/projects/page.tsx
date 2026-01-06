import { ProjectCard } from "@/components/project-card";

// Example projects - replace with your actual projects
const projects = [
  {
    title: "Project One",
    description: "A brief description of your first project. Explain what it does and what technologies you used.",
    technologies: ["React", "TypeScript", "Next.js"],
    link: "#",
    github: "#",
  },
  {
    title: "Project Two",
    description: "A brief description of your second project. Explain what it does and what technologies you used.",
    technologies: ["Node.js", "Express", "MongoDB"],
    link: "#",
    github: "#",
  },
  {
    title: "Project Three",
    description: "A brief description of your third project. Explain what it does and what technologies you used.",
    technologies: ["Python", "Django", "PostgreSQL"],
    link: "#",
    github: "#",
  },
];

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
          <p className="text-xl text-muted-foreground">
            A collection of my work and side projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}

