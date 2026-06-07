"use client";

import { Check, Clock, FileArchive, Moon, RotateCw, Shield } from "lucide-react";

const ENDPOINTS = [
  { method: "GET", path: "/backups", desc: "List backup snapshots + metadata" },
  { method: "POST", path: "/restore", desc: "Submit a restore job for a snapshot" },
  { method: "GET", path: "/restore/{id}", desc: "Poll restore job status" },
  { method: "POST", path: "/authors", desc: "Provision QuickSight authors from a roster" },
  { method: "POST", path: "/security-sync", desc: "Force-reconcile an AD → QuickSight group mapping" },
];

const NIGHTLY = [
  { Icon: Moon, label: "00:00", title: "EventBridge fires" },
  { Icon: FileArchive, label: "00:05", title: "Asset bundle export to S3" },
  { Icon: Clock, label: "00:08", title: "Metadata indexed in DynamoDB" },
  { Icon: Shield, label: "Event-driven", title: "AD → QuickSight RBAC sync" },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "text-cyan-300 bg-cyan-500/10 border-cyan-500/25",
  POST: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
};

const CAPABILITIES = [
  "Nightly asset bundle exports for every dashboard, analysis, and dataset.",
  "DynamoDB-indexed snapshot catalog — restores are a single API call away.",
  "Author provisioning from uploaded rosters; no console clicks.",
  "Event-driven syncing of Active Directory security groups into QuickSight — RBAC reflects AD membership changes within seconds instead of relying on nightly batch reconciliation.",
  "Audit trail of every sync, with success/failure breakdown surfaced to operators.",
];

export function QuicksightBody() {
  return (
    <div className="space-y-8">
      {/* Capabilities — single column, checklist */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          What it covers
        </h3>
        <ul className="space-y-2">
          {CAPABILITIES.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2 rounded-md border border-border/40 bg-background/40 px-3 py-2 text-sm text-muted-foreground"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                <Check className="h-2.5 w-2.5 text-primary" />
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Nightly timeline */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Nightly cadence
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NIGHTLY.map(({ Icon, label, title }) => (
            <div
              key={title}
              className="rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Endpoints */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Endpoints (behind API Gateway usage plan)
        </h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border/40">
              {ENDPOINTS.map((e) => (
                <tr key={e.path}>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        METHOD_COLOR[e.method] ?? ""
                      }`}
                    >
                      {e.method}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[12px] text-foreground">
                    {e.path}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Restore flow */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Restore flow
        </h3>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/40 p-3 text-xs">
          <Step label="Operator hits /restore" />
          <Sep />
          <Step label="Lambda enqueues a job" />
          <Sep />
          <Step label="Step Function rehydrates from S3" />
          <Sep />
          <Step label="Status polled via /restore/{id}" />
          <Sep />
          <Step
            label="Done"
            done
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <RotateCw className="h-3.5 w-3.5" />
          Idempotent re-runs — restoring twice produces the same final state.
        </div>
      </section>
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <span
      className={`rounded border px-2 py-1 ${
        done
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border/60 bg-background/40 text-foreground/80"
      }`}
    >
      {label}
    </span>
  );
}

function Sep() {
  return <span className="text-muted-foreground">→</span>;
}
