"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataFlowDiagram } from "./data-flow-diagram";
import {
  focusColumns,
  rawVendorData,
  transformationSteps,
  type FocusColumn,
} from "@/lib/project-data/focus-schema";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Boxes,
  Check,
  Clock,
  Database,
  Download,
  FileSpreadsheet,
  GitBranch,
  GitMerge,
  Layers,
  Map,
  Network,
  Scale,
  ServerCog,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface DataTransformationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_COLOR: Record<FocusColumn["category"], string> = {
  billing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  charge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  commitment: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  cost: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  provider: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  resource: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  service: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  allocation: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
};

const CATEGORY_LABEL: Record<FocusColumn["category"], string> = {
  billing: "Billing",
  charge: "Charge",
  commitment: "Commitment",
  cost: "Cost",
  provider: "Provider",
  resource: "Resource",
  service: "Service",
  allocation: "Allocation",
};

// Hand-curated raw→FOCUS mappings per mock vendor. The shape mirrors the work
// you do in the real transformation layer: pick the right FOCUS column, cast
// types, default unknown values.
const VENDOR_MAPPINGS: Record<string, { from: string; to: string; note?: string }[]> = {
  "Cloud Provider A": [
    { from: "account_id", to: "BillingAccountId" },
    { from: "usage_date", to: "ChargePeriodStart", note: "cast → TIMESTAMP" },
    { from: "product_code", to: "ServiceName", note: "lookup table" },
    { from: "usage_type", to: "SkuId" },
    { from: "usage_amount", to: "UsageQuantity" },
    { from: "cost", to: "EffectiveCost" },
    { from: "resource_arn", to: "ResourceId" },
  ],
  "Monitoring Service B": [
    { from: "org_id", to: "BillingAccountId" },
    { from: "billing_month", to: "BillingPeriodStart", note: "parse YYYY-MM" },
    { from: "product_name", to: "ServiceName" },
    { from: "sku", to: "SkuId" },
    { from: "quantity", to: "UsageQuantity" },
    { from: "unit_price", to: "ListUnitPrice" },
    { from: "total_charge", to: "EffectiveCost" },
  ],
  "Integration Platform C": [
    { from: "tenant_id", to: "BillingAccountId" },
    { from: "period_start", to: "BillingPeriodStart" },
    { from: "period_end", to: "BillingPeriodEnd" },
    { from: "service_tier", to: "PricingCategory", note: "fixed mapping" },
    { from: "resource_name", to: "ResourceName" },
    { from: "work_units", to: "UsageQuantity" },
    { from: "amount_usd", to: "EffectiveCost" },
  ],
  "AI/ML Service D": [
    { from: "customer_id", to: "BillingAccountId" },
    { from: "invoice_date", to: "BillingPeriodStart" },
    { from: "model_name", to: "ResourceName" },
    { from: "input_tokens", to: "x_InputTokens", note: "extension column" },
    { from: "output_tokens", to: "x_OutputTokens", note: "extension column" },
    { from: "total_cost_usd", to: "EffectiveCost" },
  ],
};

// Mock cost allocation by division (for the Overview chart). Numbers are
// illustrative, but the shape — tagged vs overhead vs corporate — mirrors how
// the real platform redistributes untaggable spend.
const DIVISION_SPEND = [
  { name: "Engineering", tagged: 64, overhead: 18, corporate: 8 },
  { name: "Data", tagged: 42, overhead: 22, corporate: 10 },
  { name: "Product", tagged: 28, overhead: 12, corporate: 7 },
  { name: "Security", tagged: 19, overhead: 8, corporate: 5 },
];

const KPIS = [
  { label: "Vendor sources", value: "20+", tone: "text-cyan-300" },
  { label: "FOCUS columns", value: "65", tone: "text-emerald-300" },
  { label: "Refresh", value: "Hourly", tone: "text-orange-300" },
  { label: "Allocation method", value: "FOCUS x_*", tone: "text-purple-300" },
];

// Lucide icons keyed to the names in focus-schema.transformationSteps
const STEP_ICON: Record<string, LucideIcon> = {
  download: Download,
  map: Map,
  sparkles: Sparkles,
  scale: Scale,
  "git-merge": GitMerge,
};

// The 20+ production pipelines, grouped by what they collect. Vendor names
// stay generic on purpose — categories are what matter for the architecture.
type PipelineRow = {
  source: string;
  cadence: "Hourly" | "Daily" | "Monthly" | "Event-driven";
  pattern: "Producer / Consumer" | "Scheduled Lambda" | "Event trigger";
  output: string;
};

const PIPELINE_GROUPS: { name: string; rows: PipelineRow[] }[] = [
  {
    name: "Usage attribution",
    rows: [
      { source: "Observability — hosts, containers, APM", cadence: "Hourly", pattern: "Producer / Consumer", output: "fact_obs_usage" },
      { source: "Observability — logs ingestion", cadence: "Hourly", pattern: "Scheduled Lambda", output: "fact_obs_logs" },
      { source: "On-call & incidents", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_oncall_usage" },
      { source: "CI/CD pipeline minutes", cadence: "Hourly", pattern: "Scheduled Lambda", output: "fact_cicd_usage" },
      { source: "Integration platform runs", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_ipaas_usage" },
      { source: "API gateway throughput", cadence: "Hourly", pattern: "Producer / Consumer", output: "fact_apigw_usage" },
      { source: "AI / LLM tokens", cadence: "Hourly", pattern: "Scheduled Lambda", output: "fact_ai_usage" },
      { source: "Document management seats", cadence: "Monthly", pattern: "Scheduled Lambda", output: "fact_docmgmt_usage" },
      { source: "Backup / DR storage", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_backup_usage" },
      { source: "Certificate inventory", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_certs_usage" },
    ],
  },
  {
    name: "Resources & inventory",
    rows: [
      { source: "Observability orgs / users", cadence: "Daily", pattern: "Scheduled Lambda", output: "dim_obs_resources" },
      { source: "API gateway control planes", cadence: "Daily", pattern: "Producer / Consumer", output: "dim_apigw_resources" },
      { source: "Security scanner assets", cadence: "Daily", pattern: "Producer / Consumer", output: "dim_security_assets" },
      { source: "Terraform workspaces", cadence: "Daily", pattern: "Producer / Consumer", output: "dim_terraform_resources" },
      { source: "Network appliance inventory", cadence: "Daily", pattern: "Scheduled Lambda", output: "dim_net_appliances" },
      { source: "Telephony numbers & services", cadence: "Daily", pattern: "Scheduled Lambda", output: "dim_telephony_resources" },
      { source: "Tunneling / proxy endpoints", cadence: "Daily", pattern: "Scheduled Lambda", output: "dim_tunnel_resources" },
      { source: "Integration platform nodes", cadence: "Daily", pattern: "Event trigger", output: "dim_ipaas_nodes" },
      { source: "Emergency DR resources", cadence: "Daily", pattern: "Scheduled Lambda", output: "dim_dr_resources" },
    ],
  },
  {
    name: "Invoices & pricing",
    rows: [
      { source: "Vendor invoice line items", cadence: "Monthly", pattern: "Scheduled Lambda", output: "fact_vendor_invoices" },
      { source: "Marketplace subscriptions", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_marketplace_subs" },
      { source: "Manual contract pricing", cadence: "Event-driven", pattern: "Event trigger", output: "dim_contract_pricing" },
    ],
  },
  {
    name: "Cloud provider feeds",
    rows: [
      { source: "Primary cloud CUR (cost & usage)", cadence: "Daily", pattern: "Event trigger", output: "fact_cloud_cur" },
      { source: "Secondary cloud billing export", cadence: "Daily", pattern: "Scheduled Lambda", output: "fact_cloud_alt" },
      { source: "User directory / org mapping", cadence: "Hourly", pattern: "Scheduled Lambda", output: "dim_user_directory" },
    ],
  },
];

const CADENCE_TONE: Record<PipelineRow["cadence"], string> = {
  Hourly: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  Daily: "text-cyan-300 bg-cyan-500/10 border-cyan-500/25",
  Monthly: "text-orange-300 bg-orange-500/10 border-orange-500/25",
  "Event-driven": "text-purple-300 bg-purple-500/10 border-purple-500/25",
};

const PIPELINE_KPIS = [
  { label: "Production pipelines", value: "40+" },
  { label: "Lambdas in flight", value: "60+" },
  { label: "Layers (ingest → normalize → marts)", value: "3" },
  { label: "Cadence floor", value: "Hourly" },
];

const DECISIONS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Layers,
    title: "Standardize on FOCUS v1.2",
    body: "Open spec maintained by the FinOps Foundation. Every vendor outputs the same 65-column schema, so dashboards, alerts, and chargeback logic stay vendor-agnostic.",
  },
  {
    Icon: Workflow,
    title: "Producer/consumer ingestion",
    body: "Scheduled producer Lambdas enumerate orgs and fan out via SQS; consumer Lambdas page the API and land partitioned Parquet to S3. Retries, DLQs, and idempotency are uniform.",
  },
  {
    Icon: Network,
    title: "Lakehouse + warehouse, not either-or",
    body: "Athena over Glue tables for ad-hoc and BI; Redshift Serverless for governed marts and ML features. The FOCUS view spans both via UNION ALL.",
  },
  {
    Icon: Sparkles,
    title: "Allocate, don't just report",
    body: "x_TaggedCost / x_OverheadCost / x_CorpCost split every line of spend, so leadership sees who's really paying — not just where the invoice landed.",
  },
];

export function DataTransformationModal({
  open,
  onOpenChange,
}: DataTransformationModalProps) {
  const [vendorIdx, setVendorIdx] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<
    FocusColumn["category"] | "all"
  >("all");

  const visibleColumns = useMemo(
    () =>
      categoryFilter === "all"
        ? focusColumns
        : focusColumns.filter((c) => c.category === categoryFilter),
    [categoryFilter]
  );

  const vendor = rawVendorData[vendorIdx];
  const mapping = VENDOR_MAPPINGS[vendor.vendorName] ?? [];
  const sampleRow = vendor.sampleData[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92vh] max-w-5xl flex-col overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-primary" />
            Enterprise FinOps Data Platform
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Cost and usage data from 20+ SaaS vendors, folded into a single{" "}
            <span className="text-foreground">FOCUS v1.2</span> cost model with
            automated allocation, anomaly detection, and chargeback.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="text-[11px] sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="text-[11px] sm:text-sm">
              Architecture
            </TabsTrigger>
            <TabsTrigger value="pipelines" className="text-[11px] sm:text-sm">
              Pipelines
            </TabsTrigger>
            <TabsTrigger value="mapping" className="text-[11px] sm:text-sm">
              Mapping
            </TabsTrigger>
            <TabsTrigger value="query" className="text-[11px] sm:text-sm">
              Query
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4 flex-1 overflow-auto pr-1">
            <div className="space-y-6">
              {/* KPI strip */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {KPIS.map((k) => (
                  <div
                    key={k.label}
                    className="rounded-lg border border-border/60 bg-card/40 px-3 py-2"
                  >
                    <div
                      className={cn(
                        "text-xl font-semibold tracking-tight",
                        k.tone
                      )}
                    >
                      {k.value}
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {k.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Concrete pipeline count callout */}
              <div className="flex flex-col gap-3 rounded-lg border border-primary/25 bg-primary/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-primary/80">
                    What it actually is
                  </p>
                  <p className="text-sm leading-snug text-foreground">
                    <span className="font-semibold">
                      40+ interdependent data pipelines
                    </span>{" "}
                    — ingestion, normalization, enrichment, allocation, and
                    marts — converging on a single FOCUS view.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300">
                    25+ ingestion
                  </span>
                  <span className="rounded border border-cyan-500/25 bg-cyan-500/10 px-1.5 py-0.5 text-cyan-300">
                    10+ normalize
                  </span>
                  <span className="rounded border border-orange-500/25 bg-orange-500/10 px-1.5 py-0.5 text-orange-300">
                    5+ marts
                  </span>
                </div>
              </div>

              {/* Before / After */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ComparisonCard
                  tone="before"
                  label="Before"
                  title="Spreadsheets, late, partial"
                  bullets={[
                    "One spreadsheet per vendor portal, manually reconciled monthly.",
                    "No common cost or usage column shape — every dashboard was bespoke.",
                    "Untaggable spend was rolled up as 'corporate' with no audit trail.",
                  ]}
                />
                <ComparisonCard
                  tone="after"
                  label="After"
                  title="One queryable cost model"
                  bullets={[
                    "20+ vendors collapsed into a single FOCUS v1.2 view.",
                    "Hourly refresh; leadership reads the same numbers as the data team.",
                    "Tagged / overhead / corporate split per line, with provenance kept.",
                  ]}
                />
              </div>

              {/* Allocation visual */}
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Cost allocation at a glance
                </h3>
                <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                  <div className="space-y-2.5">
                    {DIVISION_SPEND.map((d) => {
                      const total = d.tagged + d.overhead + d.corporate;
                      return (
                        <div key={d.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                              {d.name}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              ${total}k
                            </span>
                          </div>
                          <div className="flex h-2 overflow-hidden rounded-full bg-background/40">
                            <span
                              className="bg-emerald-400/80"
                              style={{ width: `${(d.tagged / total) * 100}%` }}
                            />
                            <span
                              className="bg-yellow-400/80"
                              style={{
                                width: `${(d.overhead / total) * 100}%`,
                              }}
                            />
                            <span
                              className="bg-orange-400/70"
                              style={{
                                width: `${(d.corporate / total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <LegendDot color="bg-emerald-400/80" label="x_TaggedCost (direct)" />
                    <LegendDot
                      color="bg-yellow-400/80"
                      label="x_OverheadCost (redistributed)"
                    />
                    <LegendDot
                      color="bg-orange-400/70"
                      label="x_CorpCost (centralized)"
                    />
                  </div>
                </div>
              </section>

              {/* Stack */}
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Stack
                </h3>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    "Python",
                    "AWS Lambda",
                    "Step Functions",
                    "EventBridge",
                    "SQS",
                    "S3 + Parquet",
                    "AWS Glue",
                    "Athena",
                    "Redshift Serverless",
                    "dbt-style SQL",
                    "Terraform",
                    "FOCUS v1.2",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded border border-border/60 bg-background/40 px-2 py-0.5 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* ARCHITECTURE */}
          <TabsContent
            value="architecture"
            className="mt-4 flex-1 overflow-auto pr-1"
          >
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Data flow, end to end
                </h3>
                <div className="rounded-lg border border-border/60 bg-card/40 p-1">
                  <DataFlowDiagram />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Sources land as raw Parquet in S3, get crawled into Glue,
                  transformed via per-vendor Athena views, and unified into a
                  single FOCUS view. Redshift consumes selected marts; BI tools
                  consume the unified view.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Key engineering decisions
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DECISIONS.map(({ Icon, title, body }) => (
                    <div
                      key={title}
                      className="rounded-lg border border-border/60 bg-card/40 p-3"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          {title}
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* PIPELINES */}
          <TabsContent
            value="pipelines"
            className="mt-4 flex-1 overflow-auto pr-1"
          >
            <div className="space-y-6">
              {/* Make "20+ actual pipelines" explicit at the top */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PIPELINE_KPIS.map((k) => (
                  <div
                    key={k.label}
                    className="rounded-lg border border-border/60 bg-card/40 px-3 py-2"
                  >
                    <div className="text-xl font-semibold tracking-tight text-foreground">
                      {k.value}
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {k.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Canonical pipeline shape — what one pipeline looks like */}
              <section className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Anatomy of one ingestion pipeline
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    25+ ingestion pipelines follow this shape · normalization +
                    mart pipelines build on top
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                  {/* Stage strip */}
                  <ol className="grid grid-cols-2 gap-2 sm:grid-cols-7 sm:items-stretch">
                    <PipelineStage
                      Icon={Clock}
                      label="EventBridge"
                      detail="Cron per vendor"
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={ServerCog}
                      label="Producer λ"
                      detail="Enumerate orgs, fan out"
                      accent
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={Boxes}
                      label="SQS"
                      detail="Jobs + DLQ"
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={Database}
                      label="Consumer λ × N"
                      detail="Page API, write Parquet"
                      accent
                    />
                  </ol>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-7 sm:items-stretch">
                    <PipelineStage
                      Icon={FileSpreadsheet}
                      label="S3 Parquet"
                      detail="year={y}/month={m}"
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={Network}
                      label="Glue catalog"
                      detail="Schema crawled"
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={Workflow}
                      label="Athena view"
                      detail="Maps to FOCUS"
                      accent
                    />
                    <PipelineSep />
                    <PipelineStage
                      Icon={GitMerge}
                      label="focus_unified"
                      detail="UNION ALL"
                      accent
                    />
                  </div>

                  <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs text-muted-foreground">
                    Adding a 21st pipeline isn't writing a new system — it's
                    pasting the producer + consumer Terraform module, defining
                    the vendor API client, and writing one Athena view that
                    casts its columns into FOCUS.
                  </p>
                </div>
              </section>

              {/* The 5 transformation stages inside each pipeline */}
              <section className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  What happens inside the transform
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {transformationSteps.map((step) => {
                    const Icon = STEP_ICON[step.icon] ?? Database;
                    return (
                      <div
                        key={step.id}
                        className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-card/40 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </span>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                            Step {step.id}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {step.title}
                        </p>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {step.description}
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {step.details.slice(0, 3).map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground"
                            >
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary/70" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* The pipeline catalog */}
              <section className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Ingestion pipeline catalog
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Representative slice · production runs 40+ end-to-end
                  </p>
                </div>
                <div className="space-y-4">
                  {PIPELINE_GROUPS.map((group) => (
                    <div
                      key={group.name}
                      className="overflow-hidden rounded-lg border border-border/60"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 bg-card/60 px-3 py-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                          {group.name}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {group.rows.length} pipelines
                        </p>
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-card/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="px-3 py-1.5 font-medium">Source</th>
                            <th className="px-3 py-1.5 font-medium">Cadence</th>
                            <th className="px-3 py-1.5 font-medium">Pattern</th>
                            <th className="px-3 py-1.5 font-medium">
                              Output table
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {group.rows.map((r) => (
                            <tr
                              key={r.source + r.output}
                              className="hover:bg-background/30"
                            >
                              <td className="px-3 py-1.5 text-foreground/80">
                                {r.source}
                              </td>
                              <td className="px-3 py-1.5">
                                <span
                                  className={cn(
                                    "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                                    CADENCE_TONE[r.cadence]
                                  )}
                                >
                                  {r.cadence}
                                </span>
                              </td>
                              <td className="px-3 py-1.5 text-muted-foreground">
                                {r.pattern}
                              </td>
                              <td className="px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                                {r.output}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* MAPPING */}
          <TabsContent
            value="mapping"
            className="mt-4 flex-1 overflow-auto pr-1"
          >
            <div className="space-y-5">
              {/* Vendor picker */}
              <div className="flex flex-wrap gap-1.5">
                {rawVendorData.map((v, i) => {
                  const active = vendorIdx === i;
                  return (
                    <button
                      key={v.vendorName}
                      type="button"
                      onClick={() => setVendorIdx(i)}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs transition-colors",
                        active
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v.vendorName}
                    </button>
                  );
                })}
              </div>

              {/* Side-by-side raw → FOCUS */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={vendor.vendorName}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]"
                >
                  {/* Raw */}
                  <div className="rounded-lg border border-border/60 bg-card/40">
                    <div className="border-b border-border/40 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Raw · {vendor.vendorName}
                      </p>
                      <p className="font-mono text-[11px] text-foreground">
                        {vendor.columns.length} columns
                      </p>
                    </div>
                    <ul className="divide-y divide-border/30 font-mono text-[11px]">
                      {mapping.map((m) => (
                        <li
                          key={m.from}
                          className="flex items-center justify-between gap-2 px-3 py-1.5"
                        >
                          <span className="text-foreground">{m.from}</span>
                          <span className="truncate text-muted-foreground">
                            {String(sampleRow[m.from] ?? "—").slice(0, 22)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow column */}
                  <div className="hidden items-center justify-center lg:flex">
                    <ArrowRight className="h-5 w-5 text-primary/70" />
                  </div>

                  {/* FOCUS */}
                  <div className="rounded-lg border border-primary/30 bg-primary/[0.04]">
                    <div className="border-b border-primary/20 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-primary/90">
                        FOCUS v1.2
                      </p>
                      <p className="font-mono text-[11px] text-foreground">
                        normalized
                      </p>
                    </div>
                    <ul className="divide-y divide-primary/15 font-mono text-[11px]">
                      {mapping.map((m) => (
                        <li
                          key={m.to}
                          className="flex items-center justify-between gap-2 px-3 py-1.5"
                        >
                          <span className="text-foreground">{m.to}</span>
                          {m.note && (
                            <span className="rounded bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {m.note}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="rounded-md border border-border/40 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                The same mapping pattern repeats per vendor: pick the right
                FOCUS column, cast types, default unknowns, then{" "}
                <span className="font-mono text-foreground">UNION ALL</span>{" "}
                into one queryable view.
              </div>

              {/* Filterable FOCUS browser */}
              <section className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    FOCUS column reference
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {visibleColumns.length} / {focusColumns.length}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <CategoryChip
                    active={categoryFilter === "all"}
                    onClick={() => setCategoryFilter("all")}
                    label="All"
                  />
                  {(
                    Object.keys(CATEGORY_LABEL) as FocusColumn["category"][]
                  ).map((c) => (
                    <CategoryChip
                      key={c}
                      active={categoryFilter === c}
                      onClick={() => setCategoryFilter(c)}
                      label={CATEGORY_LABEL[c]}
                      categoryClass={CATEGORY_COLOR[c]}
                    />
                  ))}
                </div>
                <div className="max-h-56 overflow-auto rounded-lg border border-border/60">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-card/80 text-[11px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                      <tr>
                        <th className="px-3 py-1.5 font-medium">Column</th>
                        <th className="px-3 py-1.5 font-medium">Type</th>
                        <th className="px-3 py-1.5 font-medium">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {visibleColumns.map((c) => (
                        <tr key={c.name}>
                          <td className="px-3 py-1.5 font-mono text-foreground">
                            {c.name}
                          </td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {c.type}
                          </td>
                          <td className="px-3 py-1.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] capitalize",
                                CATEGORY_COLOR[c.category]
                              )}
                            >
                              {CATEGORY_LABEL[c.category]}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </TabsContent>

          {/* QUERY */}
          <TabsContent value="query" className="mt-4 flex-1 overflow-auto pr-1">
            <div className="space-y-6">
              {/* Query block */}
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Example query · spend by division and provider
                </h3>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-background/60 p-4 font-mono text-[12px] leading-relaxed text-foreground">
                  <code>
                    <span className="text-[#7dd3fc]">SELECT</span>
                    {"\n  "}x_Division,
                    {"\n  "}ProviderName,
                    {"\n  "}
                    <span className="text-[#86efac]">SUM</span>
                    (EffectiveCost)   <span className="text-[#7dd3fc]">AS</span>{" "}
                    total_cost,
                    {"\n  "}
                    <span className="text-[#86efac]">SUM</span>
                    (x_TaggedCost)    <span className="text-[#7dd3fc]">AS</span>{" "}
                    direct_cost,
                    {"\n  "}
                    <span className="text-[#86efac]">SUM</span>
                    (x_OverheadCost)  <span className="text-[#7dd3fc]">AS</span>{" "}
                    overhead_cost
                    {"\n"}
                    <span className="text-[#7dd3fc]">FROM</span> focus_unified
                    {"\n"}
                    <span className="text-[#7dd3fc]">WHERE</span>{" "}
                    BillingPeriodStart{" "}
                    <span className="text-[#7dd3fc]">{`>=`}</span>{" "}
                    <span className="text-[#e9d5ff]">&apos;2026-01-01&apos;</span>
                    {"\n"}
                    <span className="text-[#7dd3fc]">GROUP BY</span>{" "}
                    x_Division, ProviderName
                    {"\n"}
                    <span className="text-[#7dd3fc]">ORDER BY</span> total_cost{" "}
                    <span className="text-[#7dd3fc]">DESC</span>;
                  </code>
                </pre>
              </section>

              {/* Sample result */}
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Sample result
                </h3>
                <div className="overflow-hidden rounded-lg border border-border/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-card/60 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-3 py-1.5 font-medium">Division</th>
                        <th className="px-3 py-1.5 font-medium">Provider</th>
                        <th className="px-3 py-1.5 font-medium text-right">
                          Total
                        </th>
                        <th className="px-3 py-1.5 font-medium text-right">
                          Direct
                        </th>
                        <th className="px-3 py-1.5 font-medium text-right">
                          Overhead
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[
                        { div: "Engineering", prov: "Cloud Provider A", total: 312840, direct: 248120, overhead: 64720 },
                        { div: "Engineering", prov: "Monitoring Service B", total: 84210, direct: 71500, overhead: 12710 },
                        { div: "Data", prov: "Cloud Provider A", total: 198400, direct: 142300, overhead: 56100 },
                        { div: "Data", prov: "Integration Platform C", total: 56300, direct: 56300, overhead: 0 },
                        { div: "Product", prov: "AI/ML Service D", total: 41280, direct: 35200, overhead: 6080 },
                        { div: "Security", prov: "Cloud Provider A", total: 22950, direct: 18200, overhead: 4750 },
                      ].map((r) => (
                        <tr key={r.div + r.prov}>
                          <td className="px-3 py-1.5 text-foreground">{r.div}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {r.prov}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-foreground">
                            ${r.total.toLocaleString()}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-emerald-300/90">
                            ${r.direct.toLocaleString()}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-yellow-300/90">
                            ${r.overhead.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* What this enables */}
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  What this enables downstream
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      Icon: GitBranch,
                      title: "Chargeback by division",
                      body: "Direct + overhead splits roll up cleanly without bespoke per-vendor logic.",
                    },
                    {
                      Icon: Sparkles,
                      title: "Anomaly detection",
                      body: "Models read one schema, learn one drift profile, and alert across every vendor.",
                    },
                    {
                      Icon: Workflow,
                      title: "Contract effective rate",
                      body: "Compare ListCost vs ContractedCost vs EffectiveCost to see contract slippage.",
                    },
                    {
                      Icon: Layers,
                      title: "Forecast & budget",
                      body: "One time-series feed lights up every dashboard, alert, and forecast model.",
                    },
                  ].map(({ Icon, title, body }) => (
                    <li
                      key={title}
                      className="rounded-lg border border-border/60 bg-card/40 p-3"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold text-foreground">
                          {title}
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ComparisonCard({
  tone,
  label,
  title,
  bullets,
}: {
  tone: "before" | "after";
  label: string;
  title: string;
  bullets: string[];
}) {
  const isAfter = tone === "after";
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isAfter
          ? "border-primary/25 bg-primary/[0.04]"
          : "border-border/60 bg-background/40"
      )}
    >
      <p
        className={cn(
          "text-[10px] uppercase tracking-[0.18em]",
          isAfter ? "text-primary/80" : "text-muted-foreground"
        )}
      >
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                isAfter ? "bg-primary/80" : "bg-muted-foreground/50"
              )}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("inline-block h-2 w-2 rounded-sm", color)}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function PipelineStage({
  Icon,
  label,
  detail,
  accent,
}: {
  Icon: LucideIcon;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-1 rounded-md border px-2.5 py-1.5",
        accent
          ? "border-primary/35 bg-primary/10"
          : "border-border/60 bg-background/40"
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            accent ? "text-primary" : "text-muted-foreground"
          )}
        />
        <span className="text-[11px] font-semibold text-foreground">
          {label}
        </span>
      </div>
      <p className="text-[10px] leading-snug text-muted-foreground">{detail}</p>
    </li>
  );
}

function PipelineSep() {
  return (
    <li
      aria-hidden="true"
      className="hidden items-center justify-center sm:flex"
    >
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />
    </li>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
  categoryClass,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  categoryClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] transition-colors",
        active
          ? categoryClass
            ? cn(categoryClass, "ring-1 ring-current")
            : "border-primary/50 bg-primary/15 text-primary"
          : categoryClass
          ? cn(categoryClass, "opacity-60 hover:opacity-100")
          : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
