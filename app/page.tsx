import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I'm a developer passionate about creating beautiful and functional
          web experiences. Explore my work and learn more about my journey.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">About Me</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
