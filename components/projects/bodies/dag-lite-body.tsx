"use client";

import {
  Activity,
  BarChart3,
  Boxes,
  Database,
  FlaskConical,
  GitBranch,
  HeartPulse,
  KeyRound,
  ListFilter,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const SURFACE_TILES = [
  { label: "Workspaces", value: "12" },
  { label: "Datasets", value: "184" },
  { label: "Ingestions /24h", value: "2,310" },
  { label: "API keys", value: "27" },
];

const FEATURES = [
  {
    Icon: Boxes,
    title: "Workspaces & datasets",
    body: "Hierarchical organization with dataset CRUD, slug reservations, partition sync against S3, and soft-delete recovery.",
  },
  {
    Icon: GitBranch,
    title: "Ingestion tracking",
    body: "Every upload tracked through producer → upload URL → processing → indexed — surfaced in the console as it runs.",
  },
  {
    Icon: FlaskConical,
    title: "Data workbench",
    body: "Ad-hoc queries against the lakehouse without leaving the portal; results streamed and paged into the UI.",
  },
  {
    Icon: Sparkles,
    title: "QuickSight asset workflow",
    body: "Browse the asset catalog, kick off restores, follow status — wraps the underlying QuickSight automation APIs.",
  },
  {
    Icon: Users,
    title: "Users, RBAC & grants",
    body: "Three-layer auth: role-based access, per-resource grants for sensitive datasets, and scoped API key permissions.",
  },
  {
    Icon: KeyRound,
    title: "Scoped API keys",
    body: "Vend and revoke API Gateway keys with per-permission scopes (e.g. datasets:read, workspace/foo:*).",
  },
  {
    Icon: BarChart3,
    title: "Live metrics",
    body: "Per-endpoint metrics — requests, latency, error rate, method/status — auto-refreshed via React Query.",
  },
  {
    Icon: ListFilter,
    title: "Activity log",
    body: "Filterable history backed by an in-memory ring buffer, a DynamoDB log, and an S3 archive — pick your time window.",
  },
  {
    Icon: HeartPulse,
    title: "Dependency health",
    body: "DynamoDB + S3 + OAuth + API Gateway probes surfaced as first-class operator state.",
  },
];

const STACK_GROUPS = [
  {
    label: "Frontend",
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind v4",
      "shadcn/ui",
      "React Query",
      "Recharts",
      "Bun",
    ],
  },
  {
    label: "Backend",
    tags: [
      "FastAPI",
      "Python",
      "Pydantic Settings",
      "DynamoDB single-table",
      "S3",
      "moto (test)",
      "LocalStack",
    ],
  },
  {
    label: "Auth & edge",
    tags: [
      "OAuth (Okta)",
      "API Gateway usage plans",
      "Trusted-identity proxy",
      "RBAC + grants",
      "Scoped API keys",
    ],
  },
];

export function DagLiteBody() {
  return (
    <div className="space-y-8">
      {/* Authorship callout */}
      <div className="rounded-lg border border-primary/25 bg-primary/[0.04] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary/80">
          Scope
        </p>
        <p className="mt-0.5 text-sm leading-snug text-foreground">
          <span className="font-semibold">Designed and built end-to-end</span>{" "}
          — the React + TypeScript operator SPA and the FastAPI service behind
          it, plus the LocalStack-backed dev environment that mirrors production
          API Gateway.
        </p>
      </div>

      {/* Console mock */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          What the operator sees
        </h3>
        <div className="rounded-lg border border-border/60 bg-card/40">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
              </div>
              <p className="ml-2 font-mono text-[11px] text-muted-foreground">
                dag-lite · /workspaces
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Snapshot
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {SURFACE_TILES.map((t) => (
              <div
                key={t.label}
                className="rounded-md border border-border/40 bg-background/40 px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </p>
                <p className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
                  {t.value}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border/40 px-4 py-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              Recent ingestions
            </p>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <IngestionRow
                dataset="finops.cur.daily"
                status="processed"
                bytes="412 MB"
                age="3m"
              />
              <IngestionRow
                dataset="vendor.metrics.hourly"
                status="processing"
                bytes="62 MB"
                age="1m"
              />
              <IngestionRow
                dataset="quicksight.assets.nightly"
                status="processed"
                bytes="9.1 MB"
                age="12m"
              />
              <IngestionRow
                dataset="audit.access.events"
                status="failed"
                bytes="—"
                age="29m"
              />
            </ul>
          </div>
        </div>
        <p className="text-[11px] italic text-muted-foreground">
          Illustrative snapshot — same widgets, real data in production.
        </p>
      </section>

      {/* Feature grid */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Inside the console
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{title}</p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Auth tier — recurring theme worth its own block */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Auth, layered three ways
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <AuthTier
            Icon={ShieldCheck}
            label="Browsers"
            title="OAuth session"
            body="Okta-issued session cookies, CSRF protection, route guards in the SPA."
          />
          <AuthTier
            Icon={KeyRound}
            label="Programmatic"
            title="API Gateway keys"
            body="Usage-plan keys mapped to scoped permissions; raw key material never reaches the app."
          />
          <AuthTier
            Icon={Activity}
            label="Trusted services"
            title="Internal secret"
            body="Shared-secret header for internal-only routes (activity archive, system tasks)."
          />
        </div>
      </section>

      {/* Stack — grouped because the project genuinely spans layers */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          How it&apos;s built
        </h3>
        <div className="space-y-2">
          {STACK_GROUPS.map(({ label, tags }) => (
            <div
              key={label}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
            >
              <p className="w-28 shrink-0 pt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border/60 bg-background/40 px-2 py-0.5 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AuthTier({
  Icon,
  label,
  title,
  body,
}: {
  Icon: typeof ShieldCheck;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function IngestionRow({
  dataset,
  status,
  bytes,
  age,
}: {
  dataset: string;
  status: "processed" | "processing" | "failed";
  bytes: string;
  age: string;
}) {
  const statusTone =
    status === "processed"
      ? "text-emerald-400"
      : status === "processing"
      ? "text-cyan-400"
      : "text-red-400";
  return (
    <li className="flex items-center justify-between gap-3 text-muted-foreground">
      <span className="flex items-center gap-2 truncate">
        <Database className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="truncate text-foreground/80">{dataset}</span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <span className={statusTone}>{status}</span>
        <span>{bytes}</span>
        <span>{age}</span>
      </span>
    </li>
  );
}
