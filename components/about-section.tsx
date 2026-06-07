"use client";

import { AnimatedSection } from "@/components/animated-section";
import { staggerItem } from "@/lib/animations";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <AnimatedSection id="about" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        <motion.header
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            About Me
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
            Data engineer, full-stack engineer, guitarist, and traveler.
            Passionate about the depth of learning and growth.
          </p>
        </motion.header>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          {/* Photo group — horizontal strip on mobile, vertical stack on desktop */}
          <motion.div
            variants={staggerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="shrink-0"
          >
            <div className="flex gap-3 sm:flex-col">
              <PhotoTile
                src="/profile_pic.png"
                alt="Ian Cates"
                objectPosition="65% 30%"
              />
              <PhotoTile
                src="/profile_pic_2.png"
                alt="Ian in Japan"
                objectPosition="50% 62%"
              />
              <PhotoTile
                src="/profile_pic_3.png"
                alt="Pointing across a mountain valley in Japan"
                objectPosition="20% 92%"
              />
            </div>
          </motion.div>

          {/* Text — simple, no card, just paragraphs aligned to the photo */}
          <motion.div
            variants={staggerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="space-y-4 text-[15px] leading-relaxed text-muted-foreground"
          >
            <p>
              I&apos;m a{" "}
              <span className="font-semibold text-foreground">
                data engineer and full-stack engineer
              </span>{" "}
              with 4+ years building and integrating serverless data platforms on the cloud. My
              passions live at the intersection of three things:{" "}
              <span className="text-foreground">data</span>,{" "}
              <span className="text-foreground">full-stack development</span>,
              and <span className="text-foreground">security</span>. Most of
              the work ends up touching all three at once.
            </p>
            <p>
              The shape of what I build is intentionally end-to-end. ELT/ETL
              processes and DAG platforms, API services, operator portals, and
              the infrastructure-as-code that ships them all sit on the same
              canvas. The engineer who designs the pipeline writes the
              dashboard the data lands in. I enjoy impactful work: the kind
              that gets noticed and makes meaningful changes.
            </p>
            <p>
              Beyond any specific stack, I&apos;m genuinely fascinated by how
              the practice of building software is changing. The pre-AI
              discipline I came up on still grounds the work: careful modules,
              slow-and-correct review, deep observability. I treat agentic
              coding workflows as a first-class production system in their own
              right, with prompts, evals, telemetry, and review held to the
              same bar as everything else. Knowing when to lean on these tools
              and when to slow down is its own challenge, and one that only matters
              more as the field continues to shift.
            </p>
            <p>
              My cybersecurity background never stopped influencing how I
              build. Least-privilege access, federated SSO, secret rotation,
              and encryption everywhere are second nature at this point. That
              security lens shapes every design choice in the data work: who
              can read this, how does it rotate, what&apos;s the blast radius.
            </p>
            <p className="text-sm">
              B.S. Cybersecurity (2021) · AWS Certified Data Engineer (2024) ·
              AWS Certified DevOps Engineer Professional (2025)
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function PhotoTile({
  src,
  alt,
  objectPosition,
}: {
  src: string;
  alt: string;
  objectPosition: string;
}) {
  return (
    <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border/50 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] sm:h-52 sm:w-52">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
      />
    </div>
  );
}
