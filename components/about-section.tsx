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
            Data engineer, full-stack engineer, lifelong tinkerer — building
            production data systems end-to-end.
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
              with 4+ years building serverless data platforms on AWS. The
              shape of my work is intentionally end-to-end — ingestion DAGs,
              FastAPI services, React admin portals, and the Terraform that
              ships them all. Same engineer who designs the pipeline writes the
              dashboard the data lands in.
            </p>
            <p>
              Day-to-day I mix Lambda, Step Functions, EventBridge, and SQS for
              ingestion; Redshift Serverless, Athena, and Glue for the
              warehouse and lakehouse; DynamoDB and S3 for application state;
              and TypeScript, React, and Tailwind for the operator surfaces.
              Everything ships as small, atomic Terraform PRs.
            </p>
            <p>
              Beyond the stack, I&apos;m genuinely fascinated by how the
              practice of building software is changing. The pre-AI discipline
              I came up on — careful modules, slow-and-correct review, deep
              observability — still grounds the work. I also treat agentic
              coding workflows as a first-class production system in their own
              right: prompts, evals, telemetry, and review held to the same bar
              as everything else. The before and after of AI tooling both
              belong in the toolbox.
            </p>
            <p>
              My cybersecurity background never stopped influencing how I
              build. Least-privilege IAM, federated SSO, secret rotation, KMS
              everywhere — reflexes, not checklist items. That security lens
              shapes every design choice in the data work: who can read this,
              how does it rotate, what&apos;s the blast radius.
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
