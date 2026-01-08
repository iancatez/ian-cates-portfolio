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
  /** Bento grid size for styling */
  bentoSize?: "large" | "tall" | "wide" | "normal";
  /** CSS Grid area: "row-start / col-start / row-end / col-end" */
  gridArea?: string;
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
/**
 * Bento Grid with explicit positioning for organic layout
 * Using gridArea for precise placement that looks random
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "FinOps Data Lakehouse",
    description: "Enterprise cost data pipeline normalizing 20+ vendor sources to FOCUS v1.2 schema specification. Features automated cost allocation, schema unification, and real-time anomaly detection.",
    technologies: ["AWS Athena", "Glue", "Python", "dbt", "Terraform", "Spark"],
    featured: true,
    bentoSize: "large",
    gridArea: "1 / 1 / 3 / 3", // row-start / col-start / row-end / col-end
  },
  {
    id: "2",
    title: "Project Two",
    description: "Automated ETL workflows with data quality.",
    technologies: ["Airflow", "dbt", "Snowflake"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "normal",
    gridArea: "1 / 3 / 2 / 4",
  },
  {
    id: "3",
    title: "Project Three",
    description: "Real-time streaming analytics solution with event-driven architecture.",
    technologies: ["Kafka", "Flink", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "tall",
    gridArea: "2 / 3 / 4 / 4",
  },
  {
    id: "4",
    title: "Project Four",
    description: "ML pipeline automation.",
    technologies: ["SageMaker", "MLflow"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "normal",
    gridArea: "3 / 1 / 4 / 2",
  },
  {
    id: "5",
    title: "Project Five",
    description: "Cloud-native data lakehouse with cost optimization and governance.",
    technologies: ["Glue", "Athena", "Lake Formation"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "normal",
    gridArea: "3 / 2 / 4 / 3",
  },
  {
    id: "6",
    title: "Project Six",
    description: "Infrastructure as code for reproducible cloud environments and CI/CD pipelines.",
    technologies: ["Terraform", "CDK", "GitHub Actions"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "wide",
    gridArea: "4 / 1 / 5 / 3",
  },
  {
    id: "7",
    title: "Project Seven",
    description: "Monitoring stack.",
    technologies: ["CloudWatch", "Grafana","DataDog"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    bentoSize: "normal",
    gridArea: "4 / 3 / 5 / 4",
  },
];

