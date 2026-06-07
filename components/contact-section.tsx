"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ContactLink {
  name: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactElement;
  label: string;
  display: string;
  neonColor: string;
}

const CONTACT_LINKS: ContactLink[] = [
  {
    name: "Email",
    href: "mailto:contact@example.com",
    icon: MailIcon,
    label: "Send an email",
    display: "Email",
    neonColor: "#ea4335",
  },
  {
    name: "GitHub",
    href: "https://github.com/iancatez",
    icon: Github,
    label: "View GitHub profile",
    display: "GitHub",
    neonColor: "#9ca3af",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "View LinkedIn profile",
    display: "LinkedIn",
    neonColor: "#0a66c2",
  },
  {
    name: "X",
    href: "https://x.com",
    icon: XIcon,
    label: "View X profile",
    display: "X",
    neonColor: "#ffffff",
  },
];

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ContactSection() {
  return (
    <section id="contact" className="px-4 py-16">
      <motion.div
        className="container mx-auto flex max-w-3xl flex-col gap-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Contact me
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
            Open to interesting problems. Reach out about engineering roles,
            consulting, or anything you want a second pair of eyes on.
          </p>
        </div>

        <motion.div
          className="flex flex-wrap gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
        >
          {CONTACT_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.name} variants={itemVariants}>
                <Button
                  asChild
                  neonColor={link.neonColor}
                  aria-label={link.label}
                  className="h-10 gap-2 px-4 text-sm font-normal"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.display}</span>
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
