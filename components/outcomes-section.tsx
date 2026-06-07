"use client";

import { AnimatedSection } from "@/components/animated-section";
import { staggerItem } from "@/lib/animations";
import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
  detail: string;
}

const STATS: Stat[] = [
  {
    value: "5,000+",
    label: "internal users powered",
    detail:
      "Dashboards and data products built on top of this platform serve 5,000+ internal users — Finance, Engineering, Product, and leadership read the same numbers instead of debating spreadsheets.",
  },
  {
    value: "40+",
    label: "interdependent ETL pipelines in production",
    detail:
      "Designed and operate 40+ production data pipelines forming an interdependent DAG — ingestion, normalization, enrichment, allocation, and marts — converging heterogeneous source data into one queryable model behind analytics, ML, and finance reporting.",
  },
  {
    value: "Hours, not weeks",
    label: "from raw data to dashboard",
    detail:
      "Compressed reporting latency from monthly manual rollups to hourly automated refreshes. Stakeholders read live data instead of waiting on a data-team handoff.",
  },
  {
    value: "100%",
    label: "infrastructure as code",
    detail:
      "Every Lambda, IAM role, Athena view, Redshift schema, and schedule reviewed in atomic PRs and applied through Terraform Cloud — no click-ops drift between dev, stage, and prod.",
  },
];

export function OutcomesSection() {
  return (
    <AnimatedSection id="outcomes" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.div
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Outcomes
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
            What the work adds up to.
          </p>
        </motion.div>

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1 border-l border-border/50 pl-4"
            >
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="text-sm text-muted-foreground">{stat.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
