"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

        <Card>
          <CardHeader>
            <CardTitle>Background</CardTitle>
            <CardDescription>My journey in development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Add your background information here. Describe your experience,
              education, and what drives you as a developer.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Skills</h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <motion.div key={category} variants={staggerItem}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {skillCategories[category as keyof typeof skillCategories] || category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

