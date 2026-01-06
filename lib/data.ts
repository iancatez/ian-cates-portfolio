export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency?: number; // 0-100, optional
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

// Example skills data - replace with your actual skills
export const skills: Skill[] = [
  { name: "TypeScript", category: "frontend", proficiency: 90 },
  { name: "React", category: "frontend", proficiency: 95 },
  { name: "Next.js", category: "frontend", proficiency: 85 },
  { name: "Tailwind CSS", category: "frontend", proficiency: 90 },
  { name: "Node.js", category: "backend", proficiency: 80 },
  { name: "Python", category: "backend", proficiency: 75 },
  { name: "Git", category: "tools", proficiency: 90 },
  { name: "Docker", category: "tools", proficiency: 70 },
];

/**
 * Projects Configuration
 * 
 * Add or modify projects here. Each project will automatically appear in the carousel.
 * Simply add a new object to this array with the following structure:
 * 
 * {
 *   id: "unique-id",                    // Unique identifier (string)
 *   title: "Project Title",             // Project name
 *   description: "Brief description",   // Short description shown on card
 *   longDescription?: "Full details",   // Optional: Longer description for detail views
 *   image?: "/path/to/image.jpg",       // Optional: Project image
 *   technologies: ["Tech1", "Tech2"],   // Array of technologies used
 *   liveUrl?: "https://...",            // Optional: Live demo URL
 *   githubUrl?: "https://...",          // Optional: GitHub repository URL
 *   featured?: true,                     // Optional: Featured project flag
 * }
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "Project One",
    description: "A brief description of your first project. Explain what it does and what technologies you used.",
    technologies: ["React", "TypeScript", "Next.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Project Two",
    description: "A brief description of your second project. Explain what it does and what technologies you used.",
    technologies: ["Node.js", "Express", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: "3",
    title: "Project Three",
    description: "A brief description of your third project. Explain what it does and what technologies you used.",
    technologies: ["Python", "Django", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: "4",
    title: "Project Four",
    description: "A brief description of your fourth project. Explain what it does and what technologies you used.",
    technologies: ["Python", "Django", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: "5",
    title: "Project Five",
    description: "A brief description of your fifth project. Explain what it does and what technologies you used.",
    technologies: ["Python", "Django", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

