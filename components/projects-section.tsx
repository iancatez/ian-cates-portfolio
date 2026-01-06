"use client";

import { AnimatedSection } from "@/components/animated-section";
import { MouseReactiveCard } from "@/components/mouse-reactive-card";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center space-y-4"
        >
          <motion.h2 variants={staggerItem} className="text-4xl md:text-5xl font-bold">
            Projects
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A collection of my work and side projects
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div key={project.id} variants={staggerItem}>
              <MouseReactiveCard intensity="subtle">
                <ProjectCard {...project} />
              </MouseReactiveCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

