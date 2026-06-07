"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { BentoProjectCard } from "@/components/bento-project-card";
import { DataTransformationModal } from "@/components/projects/data-transformation-modal";
import { ProjectDetailModal } from "@/components/projects/project-detail-modal";
import { AiAgentWorkflowDiagram } from "@/components/projects/ai-agent-workflow-diagram";
import { CloudDeploymentDiagram } from "@/components/projects/cloud-deployment-diagram";
import { OperationalInsightsDiagram } from "@/components/projects/operational-insights-diagram";
import { IngestionMeshBody } from "@/components/projects/bodies/ingestion-mesh-body";
import { IngestionRuntimeBody } from "@/components/projects/bodies/ingestion-runtime-body";
import { DagLiteBody } from "@/components/projects/bodies/dag-lite-body";
import { AiCodingBody } from "@/components/projects/bodies/ai-coding-body";
import { TerraformModulesBody } from "@/components/projects/bodies/terraform-modules-body";
import { QuicksightBody } from "@/components/projects/bodies/quicksight-body";
import { projects, type Project } from "@/lib/data";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import { AnimatedText } from "@/components/typewriter-text";
import { featureFlags } from "@/lib/feature-flags";

// ============================================
// ANIMATION STYLE OPTIONS - Change this to try different effects!
// Options: "stagger" | "scatter" | "spiral" | "cascade" | "scale"
// ============================================
const ANIMATION_STYLE: "stagger" | "scatter" | "spiral" | "cascade" | "scale" = "scatter";

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
        { x: -80, y: -40 },
        { x: 80, y: -60 },
        { x: -60, y: 40 },
        { x: -80, y: 0 },
        { x: 80, y: 0 },
        { x: -40, y: 40 },
        { x: 40, y: 40 },
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

function renderDiagram(key: Project["diagramKey"]) {
  switch (key) {
    case "ai-agent-workflow":
      return <AiAgentWorkflowDiagram />;
    case "cloud-deployment":
      return <CloudDeploymentDiagram />;
    case "operational-insights":
      return <OperationalInsightsDiagram />;
    // "data-flow" is the React Flow diagram embedded inside the dedicated
    // DataTransformationModal — handled separately
    case "data-flow":
    default:
      return null;
  }
}

/**
 * Each project gets a bespoke modal body so they don't all read the same.
 * Project 1 has its own DataTransformationModal entirely; the rest map here.
 */
function renderProjectBody(projectId: string): React.ReactNode {
  switch (projectId) {
    case "2":
      return <IngestionMeshBody />;
    case "3":
      return <IngestionRuntimeBody />;
    case "4":
      return <DagLiteBody />;
    case "5":
      return <AiCodingBody />;
    case "6":
      return <TerraformModulesBody />;
    case "7":
      return <QuicksightBody />;
    default:
      return null;
  }
}

export function ProjectsSection() {
  const selectedVariants = animationVariants[ANIMATION_STYLE];
  const [isFinopsModalOpen, setIsFinopsModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const openProject = (project: Project) => {
    if (project.id === "1") {
      setIsFinopsModalOpen(true);
      return;
    }
    setDetailProject(project);
  };

  return (
    <>
      <AnimatedSection id="projects" className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-3">
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1, margin: "0px" }}
            >
              {featureFlags.enableTypewriterEffect ? (
                <AnimatedText
                  text="Projects"
                  animation="blur"
                  as="h2"
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                />
              ) : (
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Projects
                </h2>
              )}
            </motion.div>
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1, margin: "0px" }}
            >
              {featureFlags.enableTypewriterEffect ? (
                <AnimatedText
                  text="Real systems shipped to production."
                  delay={200}
                  animation="words"
                  as="p"
                  className="max-w-2xl text-base md:text-lg text-muted-foreground"
                />
              ) : (
                <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
                  Real systems shipped to production.
                </p>
              )}
            </motion.div>
          </div>

          <div className="bento-grid grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project, index) => {
              const isTopCard = project.id === "1" || project.id === "2";
              const desktopGridArea = project.gridArea;

              return (
                <motion.div
                  key={project.id}
                  custom={index}
                  variants={selectedVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: false,
                    amount: isTopCard ? 0.05 : 0.1,
                    margin: "0px",
                  }}
                  className="bento-item min-h-[180px]"
                  style={
                    {
                      "--bento-area": desktopGridArea,
                    } as React.CSSProperties
                  }
                >
                  <BentoProjectCard
                    {...project}
                    className="h-full"
                    hasInteractiveDemo
                    onInteractiveClick={() => openProject(project)}
                    interactiveLabel={
                      project.id === "1" ? "Explore" : "Details"
                    }
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <DataTransformationModal
        open={isFinopsModalOpen}
        onOpenChange={setIsFinopsModalOpen}
      />

      <ProjectDetailModal
        project={detailProject}
        open={!!detailProject}
        onOpenChange={(open) => {
          if (!open) setDetailProject(null);
        }}
        diagram={detailProject ? renderDiagram(detailProject.diagramKey) : null}
        highlights={detailProject?.highlights}
        customBody={
          detailProject ? renderProjectBody(detailProject.id) : null
        }
      />
    </>
  );
}

