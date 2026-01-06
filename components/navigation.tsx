"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { transitions } from "@/lib/animations";

const navItems = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#about", label: "About", id: "about" },
  { href: "#projects", label: "Projects", id: "projects" },
];

export function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const sectionIds = navItems.map((item) => item.id);
  const activeSection = useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
    
    // Hide nav when scrolling down, show when scrolling up or at top
    if (latest < 50) {
      setIsVisible(true);
    } else if (latest > lastScrollY && latest > 100) {
      // Scrolling down
      setIsVisible(false);
    } else if (latest < lastScrollY) {
      // Scrolling up
      setIsVisible(true);
    }
    
    setLastScrollY(latest);
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={transitions.medium}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all",
        scrolled && "bg-background/80 backdrop-blur-sm shadow-sm"
      )}
      style={{
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => handleClick(e, "#home")}
            className="text-xl font-bold transition-colors duration-300 hover:text-primary"
          >
            Portfolio
          </a>
          <ul className="flex gap-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={cn(
                      "text-sm font-medium transition-colors duration-300 hover:text-foreground",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

