import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { OutcomesSection } from "@/components/outcomes-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <OutcomesSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
