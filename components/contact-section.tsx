"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const contactLinks = [
  {
    name: "Email",
    href: "mailto:your.email@example.com",
    icon: Mail,
    label: "Send an email",
  },
  {
    name: "GitHub",
    href: "https://github.com/yourusername",
    icon: Github,
    label: "View GitHub profile",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: Linkedin,
    label: "View LinkedIn profile",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourusername",
    icon: Twitter,
    label: "View Twitter profile",
  },
];

export function ContactSection() {
  return (
    <AnimatedSection id="contact" className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center space-y-4"
        >
          <motion.h2 variants={staggerItem} className="text-4xl md:text-5xl font-bold">
            Get In Touch
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Feel free to reach out if you'd like to collaborate or just say hello!
          </motion.p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Ways to connect with me</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={staggerItem}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent transition-colors duration-300"
                      aria-label={link.label}
                    >
                      <Icon className="h-6 w-6 transition-colors duration-300" />
                      <span>{link.name}</span>
                    </Button>
                  </motion.a>
                );
              })}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </AnimatedSection>
  );
}

