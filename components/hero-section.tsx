"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl space-y-6"
      >
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Ian Cates
        </motion.h1>
        
        <motion.p
          variants={staggerItem}
          className="text-xl text-muted-foreground sm:text-2xl md:text-3xl"
        >
          Data Engineer
        </motion.p>
        
        <motion.p
          variants={staggerItem}
          className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Building production data systems at enterprise scale. Turning messy data into 
          reliable, actionable insights.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg">
            <Link href="#projects">View Projects</Link>
          </Button>
          <Button asChild size="lg" neonColor="#3b82f6">
            <Link href="#about">About Me</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 1, 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 cursor-pointer"
        onClick={scrollToAbout}
        aria-label="Scroll to about section"
      >
        <ChevronDown className="h-8 w-8 text-muted-foreground transition-colors duration-300 hover:text-primary" />
      </motion.div>
    </section>
  );
}

