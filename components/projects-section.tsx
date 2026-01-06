"use client";

import { AnimatedSection } from "@/components/animated-section";
import { MouseReactiveCard } from "@/components/mouse-reactive-card";
import { ProjectCard } from "@/components/project-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project) => (
                <CarouselItem
                  key={project.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <MouseReactiveCard intensity="subtle">
                    <ProjectCard {...project} />
                  </MouseReactiveCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

