"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import type { Skill } from "@/lib/data";

const skillCategories = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools",
  other: "Other",
} as const;

export function AboutSection() {
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <AnimatedSection id="about" className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center space-y-4"
        >
          <motion.h2 variants={staggerItem} className="text-4xl md:text-5xl font-bold">
            About Me
          </motion.h2>
        <motion.p
          variants={staggerItem}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Learn more about my background and experience
        </motion.p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex-shrink-0 mx-auto md:mx-0"
        >
          {/* Neon border wrapper */}
          <div className="relative p-[4px] rounded-full bg-primary neon-glow transition-shadow duration-500">
            <Avatar className="w-48 h-48 md:w-64 md:h-64">
              <AvatarImage
                src="/profile_pic.jpg"
                alt="Ian Cates - Data Engineer"
                className="object-cover"
              />
              <AvatarFallback>IC</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>My journey in data engineering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Data Engineer with 4+ years of experience building, developing, and automating production data systems 
              at enterprise scale. Since 2021, I've specialized in designing end-to-end pipelines, automating manual 
              workflows, and delivering dashboards that drive business decisions.
            </p>
            <p className="text-muted-foreground">
              I've built comprehensive end-to-end data pipelines leveraging Apache Spark for distributed processing, 
              AWS Lambda for serverless compute, AWS SageMaker for ML model deployment, and AWS Glue for ETL workflows. 
              My pipelines integrate with data lakehouses using S3, query engines like AWS Athena and Apache Hive, 
              and data warehouses including AWS Redshift. These systems deliver insights through automated reporting 
              and ML-driven anomaly detection.
            </p>
            <p className="text-muted-foreground">
              I'm comfortable working across AWS, Azure, and GCP with a focus on turning messy data into reliable, 
              actionable reporting. My work spans from building React dashboards to deploying ML models, always 
              with an eye toward automation, scalability, and efficiency.
            </p>
            <p className="text-muted-foreground text-sm pt-2">
              <strong>Education:</strong> B.S. in Cybersecurity from Thomas College (2021) | 
              AWS Certified Data Engineer (2024) | AWS Certified DevOps Engineer Professional (2025)
            </p>
          </CardContent>
        </Card>
      </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {skillCategories[category as keyof typeof skillCategories] || category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

