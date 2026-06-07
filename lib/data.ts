export interface ProjectHighlight {
  label: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  /** Bento grid size for styling */
  bentoSize?: "large" | "tall" | "wide" | "normal";
  /** CSS Grid area: "row-start / col-start / row-end / col-end" */
  gridArea?: string;
  /** Architecture/workflow diagram key (resolved in projects-section) */
  diagramKey?:
    | "data-flow"
    | "ai-agent-workflow"
    | "cloud-deployment"
    | "operational-insights";
  /** Optional grouped bullet highlights shown in the detail modal */
  highlights?: ProjectHighlight[];
}

/**
 * Projects Configuration
 *
 * Each project card appears in the bento grid on the home page.
 * Project id "1" is wired to an interactive FOCUS schema modal.
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "Enterprise FinOps Data Platform",
    description:
      "20+ SaaS billing feeds normalized to one FOCUS v1.2 cost model, with automated allocation and anomaly detection.",
    longDescription:
      "End-to-end FinOps platform that ingests usage and billing data from 20+ SaaS vendors (observability, CI/CD, security, integration, AI, telephony, certificates, backup) and normalizes everything to the FOCUS v1.2 open cost specification. Built on serverless ingestion (Lambda + Step Functions), a medallion-layout Redshift Serverless warehouse, and an Athena/Glue lakehouse for ad-hoc analytics. Drives executive dashboards for cost attribution by division, contract effective rate, anomaly detection, and chargeback.",
    technologies: [
      "Python",
      "AWS Lambda",
      "Step Functions",
      "Redshift Serverless",
      "Athena",
      "Glue",
      "Terraform",
      "FOCUS v1.2",
    ],
    featured: true,
    bentoSize: "large",
    gridArea: "1 / 1 / 3 / 3",
    diagramKey: "data-flow",
    highlights: [
      {
        label: "Outcomes",
        items: [
          "Single FOCUS v1.2 view spanning 20+ vendor cost feeds — 65-column unified schema, partitioned by date for fast queries.",
          "Automated cost allocation by organizational division with explicit tagged, overhead, and corporate cost columns for audit.",
          "Replaced monthly spreadsheet rollups with dashboards refreshed within hours of each vendor invoice.",
        ],
      },
      {
        label: "Engineering",
        items: [
          "Medallion-layout Redshift Serverless namespace, with COPY/MERGE pipelines and namespace-scoped database roles.",
          "Athena-on-S3 lakehouse for ad-hoc and BI use cases, Glue catalog kept in sync via Terraform.",
          "All schemas, IAM, and pipelines codified as Terraform with Terraform Cloud runs and PR review.",
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Vendor Data Ingestion Mesh",
    description:
      "Serverless ingestion: ~60 Lambdas, producer/consumer fanout, EventBridge, Parquet on S3.",
    longDescription:
      "Scalable ingestion fabric for SaaS billing and usage APIs. Each vendor follows a producer/consumer pattern — a scheduled producer enumerates organizations and fans out to SQS, and consumer Lambdas pull credentials from Secrets Manager, page through vendor APIs, and write partitioned Parquet to S3. Handles rate limits, multi-org tenants, retries, and DLQs uniformly across 14+ vendors.",
    technologies: [
      "AWS Lambda",
      "SQS",
      "EventBridge",
      "S3 + Parquet",
      "Secrets Manager",
      "Python",
    ],
    featured: false,
    bentoSize: "normal",
    gridArea: "1 / 3 / 2 / 4",
    diagramKey: "cloud-deployment",
    highlights: [
      {
        label: "What it solves",
        items: [
          "One ingestion pattern for 14+ vendors instead of bespoke scripts — producer/consumer fanout, shared retry and DLQ wiring.",
          "Idempotent Parquet writes partitioned by year/month so reruns are cheap and queries stay fast.",
          "Multi-org tenants modeled uniformly so adding a new account is configuration, not new code.",
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Polyglot Ingestion Runtime",
    description:
      "Python ingestion runtime that lands any-format file uploads (CSV · JSON · JSONL · XML · Parquet) into the lakehouse with one unified output contract.",
    longDescription:
      "The back-end engine that the DAG Lite console sits on top of. A thin event Lambda bridges S3 uploads into a Python-driven orchestration workflow that validates input, routes by file extension, and invokes a format-specific processor — CSV, JSON, JSONL, XML, or Parquet. Every processor returns the same `ProcessorOutput` contract (row count, inferred schema, output chunks, output bytes, format) so the rest of the pipeline doesn't care what shape it started as. The workflow handles out-of-memory errors by bumping execution memory and retrying, then refreshes the Glue catalog so new partitions are queryable from Athena within seconds of the upload landing. Adding a sixth file format is one routing branch + one processor module.",
    technologies: [
      "Python 3.12",
      "Pandas / PyArrow",
      "lxml",
      "AWS Lambda",
      "S3 events",
      "Glue Catalog",
      "Athena",
      "Parquet",
      "boto3",
    ],
    featured: false,
    bentoSize: "tall",
    gridArea: "2 / 3 / 4 / 4",
    highlights: [
      {
        label: "What it solves",
        items: [
          "One pipeline shape handles 5 file formats — CSV, JSON, JSONL, XML, Parquet — with format-specific processors behind a uniform contract.",
          "Every processor returns the same `ProcessorOutput` (row count, column count, inferred schema, output keys, chunk count, bytes) so downstream code is format-agnostic.",
          "Out-of-memory? The orchestrator bumps execution memory and retries before failing — large CSVs and wide Parquet files don't kill the pipeline.",
        ],
      },
      {
        label: "Engineering",
        items: [
          "Python orchestration workflow drives the flow: validate → route by extension → process → write outputs → refresh Glue → respond to caller.",
          "S3 event trigger Lambda is intentionally thin — it bridges uploads to the orchestrator with a signed internal-secret header.",
          "Glue crawler kicked off on every new partition so Athena sees data within seconds of upload completion.",
        ],
      },
    ],
  },
  {
    id: "4",
    title: "DAG Lite — Internal Pipeline Console",
    description:
      "Designed and built an internal DAG-lite tool — workspaces, datasets, ingestions, queries, and QuickSight assets behind one OAuth-secured console.",
    longDescription:
      "An internal tool I designed and built end-to-end — both the React + TypeScript operator SPA and the FastAPI service behind it. Gives the data team a single console for the day-to-day: managing workspaces and datasets, tracking ingestion jobs, running ad-hoc queries against the lakehouse, watching live API activity and dependency health, administering users + RBAC grants + scoped API keys, and driving QuickSight asset backup/restore workflows. Auth is layered (OAuth session for browsers, API Gateway usage-plan keys for programmatic, internal-secret for trusted services). Local dev runs against a LocalStack-backed gateway proxy that mirrors production API Gateway behavior, so the contract is exercised end-to-end without real AWS.",
    technologies: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "React Query",
      "FastAPI",
      "DynamoDB",
      "S3",
      "OAuth (Okta)",
      "LocalStack",
      "Bun",
    ],
    featured: false,
    bentoSize: "normal",
    gridArea: "3 / 1 / 4 / 2",
    diagramKey: "operational-insights",
    highlights: [
      {
        label: "Designed + built end-to-end",
        items: [
          "Owned both sides: the React + TypeScript operator SPA and the FastAPI service it talks to.",
          "Single console for workspaces, datasets, ingestion jobs, ad-hoc queries, QuickSight assets, users + grants, and scoped API keys.",
          "Layered authentication — OAuth session (Okta) for browsers, API Gateway usage-plan keys for programmatic clients, internal-secret header for trusted services.",
        ],
      },
      {
        label: "Operator features",
        items: [
          "Live API metrics (requests, latency, error rate, method/status mix) with per-endpoint drill-down.",
          "Filterable activity log backed by a ring buffer + DynamoDB + S3 archive — incident triage on real traffic.",
          "RBAC roles, per-resource grants, and scoped API keys — three-layer authorization with audit.",
          "Dataset CRUD with S3 partition sync, a workbench for ad-hoc queries, and QuickSight asset backup/restore.",
        ],
      },
    ],
  },
  {
    id: "5",
    title: "AI Coding Distribution",
    description:
      "Wires an AI coding CLI to AWS Bedrock through corporate SSO + OIDC federation.",
    longDescription:
      "End-to-end distribution package I designed and built that lets internal developers run an AI coding CLI against AWS Bedrock using existing corporate SSO. Three Python components ship in the bundle: a `credential_process` helper that federates an Okta / Azure AD / Cognito OIDC token through a Cognito Identity Pool into short-lived AWS credentials cached per profile; an OTEL helper that extracts user identity claims from the JWT and forwards usage + cost telemetry to an enterprise collector; and a settings helper that creates or reconciles the CLI's local config without clobbering unrelated preferences. Packaged with PyInstaller into signed binaries for macOS (arm64 + Intel), Linux (arm64 + x64), and Windows — built, packaged, and released automatically through GitHub Actions on every tag, with a one-line installer that registers the AWS profile and verifies authentication before the CLI runs.",
    technologies: [
      "Python 3.12",
      "AWS Bedrock",
      "OIDC SSO",
      "Cognito Identity Pool",
      "PyInstaller",
      "OpenTelemetry",
      "GitHub Actions",
      "uv · mypy · pylint",
    ],
    featured: false,
    bentoSize: "normal",
    gridArea: "3 / 2 / 4 / 3",
    diagramKey: "ai-agent-workflow",
    highlights: [
      {
        label: "Why it exists",
        items: [
          "Internal devs couldn't point an AI coding CLI at third-party API keys — security policy blocks them.",
          "This bridge wires the same CLI to AWS Bedrock with corporate SSO and short-lived federated credentials.",
          "Usage telemetry is tied back to the developer's identity for cost attribution and audit.",
        ],
      },
      {
        label: "What I designed and built",
        items: [
          "`credential_process` helper — OIDC id_token → Cognito Identity Pool → cached AWS creds, with multi-provider profile config (Okta, Azure AD, Cognito User Pool).",
          "OTEL helper that parses the JWT, extracts user claims, and writes the OpenTelemetry headers the collector expects.",
          "Settings helper that creates or reconciles the CLI's local config without overwriting unrelated preferences.",
          "Cross-platform release pipeline — PyInstaller builds for macOS arm64/Intel, Linux arm64/x64, and Windows; packaged into a .pkg / .tar.gz / .zip and published on tag by GitHub Actions.",
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Terraform Module Library",
    description:
      "Opinionated AWS modules — consistent naming, IAM, encryption, and observability baked in.",
    longDescription:
      "Internal Terraform module library that standardizes how services are deployed across environments. Each module enforces a resource_prefix convention, attaches least-privilege IAM, configures KMS encryption, lifecycle policies, DLQs, log groups, and tagging, and wires the resource into the correct triggers. Consumed by a monorepo of service templates organized as child modules, with squash-merged PRs validated by terraform plan in Terraform Cloud before reaching production.",
    technologies: [
      "Terraform",
      "AWS",
      "Terraform Cloud",
      "GitHub Actions",
      "IAM",
      "KMS",
    ],
    featured: false,
    bentoSize: "wide",
    gridArea: "4 / 1 / 5 / 3",
    diagramKey: "cloud-deployment",
    highlights: [
      {
        label: "Standardization",
        items: [
          "One naming convention threaded from root to leaf — every resource carries a deterministic, environment-scoped prefix.",
          "Encryption, lifecycle, DLQ, and log retention defaults built into every shared module; callers opt out, not in.",
          "Least-privilege IAM scaffolded per Lambda, per Step Function, and per Redshift role.",
        ],
      },
      {
        label: "Workflow",
        items: [
          "~200-line atomic PRs, squash-merged, with required terraform fmt / validate / plan checks.",
          "Speculative plans in Terraform Cloud reviewed before any apply touches AWS.",
          "Refactors use Terraform `moved` blocks to migrate state without destroying stateful resources.",
        ],
      },
    ],
  },
  {
    id: "7",
    title: "QuickSight Automation",
    description:
      "API-driven backup, restore, author provisioning, and event-driven Active Directory → QuickSight RBAC sync.",
    longDescription:
      "Set of Lambda-backed APIs that automate everything QuickSight's console can't: nightly asset bundle exports to S3, restore submission and status APIs, automatic author provisioning from uploaded rosters, and event-driven syncing of Active Directory security groups into QuickSight so RBAC stays consistent the moment AD membership changes. Fronted by API Gateway with usage-plan keys for programmatic access.",
    technologies: [
      "Rust",
      "AWS Lambda",
      "API Gateway",
      "QuickSight",
      "DynamoDB",
      "cargo-lambda",
    ],
    featured: false,
    bentoSize: "normal",
    gridArea: "4 / 3 / 5 / 4",
    highlights: [
      {
        label: "Capabilities",
        items: [
          "Event-driven syncing of Active Directory security groups into QuickSight, so RBAC reflects AD membership changes within seconds instead of nightly batch drift.",
          "Nightly asset bundle exports to S3 with metadata indexed in DynamoDB for fast restore lookups.",
          "Restore submission + status APIs replace manual console clicks during recovery.",
          "Full audit log of every sync action with success/failure breakdown surfaced to operators.",
        ],
      },
    ],
  },
];
