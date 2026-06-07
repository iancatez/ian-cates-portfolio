"use client";

import {
  Clock,
  Boxes,
  ServerCog,
  Database,
  ListChecks,
} from "lucide-react";

const VENDOR_TYPES = [
  {
    type: "Observability",
    captures: ["Hosts", "Containers", "APM", "Logs"],
    cadence: "Hourly",
    multiOrg: true,
  },
  {
    type: "On-call & incidents",
    captures: ["Services", "Subscriptions"],
    cadence: "Daily",
    multiOrg: false,
  },
  {
    type: "CI/CD",
    captures: ["Pipeline runs", "Build minutes"],
    cadence: "Hourly",
    multiOrg: true,
  },
  {
    type: "Integration / API gateway",
    captures: ["Control planes", "API products", "Throughput"],
    cadence: "Hourly",
    multiOrg: true,
  },
  {
    type: "Security scanners",
    captures: ["Assets", "Findings"],
    cadence: "Daily",
    multiOrg: true,
  },
  {
    type: "AI / LLM",
    captures: ["Tokens", "Model usage"],
    cadence: "Hourly",
    multiOrg: false,
  },
  {
    type: "Telephony & messaging",
    captures: ["Numbers", "Service usage"],
    cadence: "Daily",
    multiOrg: false,
  },
];

const STATS = [
  { value: "60+", label: "Lambdas" },
  { value: "14+", label: "vendors" },
  { value: "Hourly", label: "cadence floor" },
  { value: "Parquet", label: "wire format" },
];

export function IngestionMeshBody() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-md border border-border/60 bg-card/40 px-3 py-2"
          >
            <div className="text-xl font-semibold tracking-tight text-foreground">
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Producer / Consumer pattern as a horizontal flow */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          The pattern
        </h3>
        <div className="rounded-lg border border-border/60 bg-card/40 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-7 sm:items-center">
            <FlowStep
              Icon={Clock}
              label="EventBridge"
              detail="Scheduled trigger per vendor"
            />
            <Arrow />
            <FlowStep
              Icon={ServerCog}
              label="Producer Lambda"
              detail="Enumerates orgs, fans out per page"
              accent
            />
            <Arrow />
            <FlowStep
              Icon={Boxes}
              label="SQS"
              detail="Job queue with DLQ + retries"
            />
            <Arrow />
            <FlowStep
              Icon={Database}
              label="Consumer Lambdas"
              detail="Pull creds, page API, write Parquet"
              accent
            />
          </div>
          <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs text-muted-foreground">
            One ingestion shape reused across every vendor — the only
            per-vendor code is the API client and the schema mapping.
          </p>
        </div>
      </section>

      {/* Vendor matrix */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Coverage
        </h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Vendor category</th>
                <th className="px-3 py-2 font-medium">Captures</th>
                <th className="px-3 py-2 font-medium">Cadence</th>
                <th className="px-3 py-2 font-medium">Multi-org</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_TYPES.map((v, i) => (
                <tr
                  key={v.type}
                  className={
                    i % 2 === 0 ? "bg-background/30" : "bg-background/0"
                  }
                >
                  <td className="px-3 py-2 text-foreground">{v.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {v.captures.join(" · ")}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {v.cadence}
                  </td>
                  <td className="px-3 py-2">
                    {v.multiOrg ? (
                      <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                        Yes
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        n/a
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What's nice about the pattern */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Why the pattern holds up
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Idempotent Parquet writes partitioned by year/month — replays are cheap.",
            "Multi-org tenants are configuration, not new code.",
            "Per-vendor retry caps + DLQs uniform across every Lambda.",
            "Secrets pulled at runtime so creds rotate without redeploy.",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-md border border-border/40 bg-background/40 px-3 py-2 text-sm text-muted-foreground"
            >
              <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FlowStep({
  Icon,
  label,
  detail,
  accent,
}: {
  Icon: typeof Clock;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${
        accent
          ? "border-primary/35 bg-primary/10"
          : "border-border/60 bg-background/40"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={`h-3.5 w-3.5 ${
            accent ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <span className="text-xs font-semibold text-foreground">{label}</span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <div
      aria-hidden="true"
      className="hidden text-muted-foreground sm:flex sm:items-center sm:justify-center"
    >
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
        <path
          d="M1 5h18m0 0l-4-4m4 4l-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
