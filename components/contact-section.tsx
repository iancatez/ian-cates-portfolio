"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

// Gmail icon
function GmailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

// X (formerly Twitter) icon
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

const contactLinks = [
  {
    name: "Email",
    href: "mailto:your.email@example.com",
    icon: GmailIcon,
    label: "Send an email",
    neonColor: "#ea4335",
  },
  {
    name: "GitHub",
    href: "https://github.com/yourusername",
    icon: Github,
    label: "View GitHub profile",
    neonColor: "#6e7681",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: Linkedin,
    label: "View LinkedIn profile",
    neonColor: "#0077b5",
  },
  {
    name: "X",
    href: "https://x.com/yourusername",
    icon: XIcon,
    label: "View X profile",
    neonColor: "#ffffff",
  },
];

export function ContactSection() {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {contactLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            asChild
            neonColor={link.neonColor}
            size="icon"
            className="h-10 w-10 rounded-full"
            aria-label={link.label}
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="h-5 w-5" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
