"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { BentoProjectCard } from "@/components/bento-project-card";
import { DataTransformationModal } from "@/components/projects/data-transformation-modal";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { ANIMATION_TRIGGER_CONFIG, EARLY_ANIMATION_TRIGGER_CONFIG } from "@/lib/animation-config";

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
        delay: i * 0.06,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  },
  
  scatter: {
    hidden: (i: number) => {
      const directions = [
        { x: -80, y: -40 },  // 0 - Project 1
        { x: 80, y: -60 },   // 1 - Project 2
        { x: -60, y: 40 },   // 2 - Project 3
        { x: -80, y: 0 },    // 3 - Project 4 (moves in from LEFT)
        { x: 80, y: 0 },     // 4 - Project 5 (moves in from RIGHT)
        { x: -40, y: 40 },   // 5 - Project 6
        { x: 40, y: 40 },    // 6 - Project 7
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
        delay: i * 0.06,
        duration: 0.6,
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
        delay: i * 0.06,
        duration: 0.6,
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
        delay: i * 0.06,
        duration: 0.6,
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
        delay: i * 0.06,
        duration: 0.6,
        type: "spring" as const,
        stiffness: 150,
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
          {/* Header - each element animates independently */}
          <div className="text-center space-y-3">
            <motion.h2 
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ 
                once: false, // Enable reverse animations when scrolling past
                amount: 0.1, // Appear at 10% visibility
                margin: "0px", // No margin - stay visible longer
              }}
              className="text-3xl md:text-4xl font-bold"
            >
              Projects
            </motion.h2>
            <motion.p
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ 
                once: false, // Enable reverse animations when scrolling past
                amount: 0.1, // Appear at 10% visibility
                margin: "0px", // No margin - stay visible longer
              }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              A collection of my work and side projects
            </motion.p>
          </div>

          {/* Organic Bento Grid - explicit positioning for asymmetric look */}
          {/* Each card animates individually as it enters viewport */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "180px 160px 180px 180px",
            }}
          >
            {projects.map((project, index) => {
              // Top 2 cards (id "1" and "2") should appear sooner
              const isTopCard = project.id === "1" || project.id === "2";
              
              return (
              <motion.div
                key={project.id}
                custom={index}
                variants={selectedVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ 
                  once: false, // Enable reverse animations when scrolling past
                  amount: isTopCard ? 0.05 : 0.1, // Top cards appear at 5%, others at 10%
                  margin: "0px", // No margin - stay visible longer, allow animations to complete
                }}
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
              );
            })}
          </div>
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
