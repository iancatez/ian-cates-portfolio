"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { BentoProjectCard } from "@/components/bento-project-card";
import { DataTransformationModal } from "@/components/projects/data-transformation-modal";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ============================================
// ANIMATION STYLE OPTIONS - Change this to try different effects!
// Options: "stagger" | "scatter" | "spiral" | "cascade" | "scale"
// ============================================
const ANIMATION_STYLE: "stagger" | "scatter" | "spiral" | "cascade" | "scale" = "scatter";

// Animation variants for different styles
const animationVariants = {
  stagger: {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  },
  
  scatter: {
    hidden: (i: number) => {
      const directions = [
        { x: -80, y: -40 },
        { x: 80, y: -60 },
        { x: -60, y: 40 },
        { x: 60, y: 60 },
        { x: 0, y: -80 },
        { x: -40, y: 0 },
        { x: 40, y: -20 },
      ];
      const dir = directions[i % directions.length];
      return { opacity: 0, x: dir.x, y: dir.y, scale: 0.85 };
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    }),
  },
  
  spiral: {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  },
  
  cascade: {
    hidden: { opacity: 0, x: -30, y: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  },
  
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    }),
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function ProjectsSection() {
  const selectedVariants = animationVariants[ANIMATION_STYLE];
  const [isProject1ModalOpen, setIsProject1ModalOpen] = useState(false);
  
  return (
    <>
      <AnimatedSection id="projects" className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center space-y-3"
          >
            <motion.h2 
              variants={staggerItem} 
              className="text-3xl md:text-4xl font-bold"
            >
              Projects
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              A collection of my work and side projects
            </motion.p>
          </motion.div>

          {/* Organic Bento Grid - explicit positioning for asymmetric look */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "180px 160px 180px 180px",
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                custom={index}
                variants={selectedVariants}
                style={{
                  gridArea: project.gridArea,
                }}
              >
                <BentoProjectCard 
                  {...project} 
                  className="h-full"
                  // Project 1 has an interactive demo modal
                  hasInteractiveDemo={project.id === "1"}
                  onInteractiveClick={project.id === "1" ? () => setIsProject1ModalOpen(true) : undefined}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Project 1 Interactive Modal */}
      <DataTransformationModal 
        open={isProject1ModalOpen} 
        onOpenChange={setIsProject1ModalOpen} 
      />
    </>
  );
}
