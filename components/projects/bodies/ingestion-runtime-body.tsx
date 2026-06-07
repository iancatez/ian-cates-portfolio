"use client";

import {
  Boxes,
  Clock,
  Cog,
  Database,
  FileText,
  Network,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

const FORMATS = [
  {
    ext: ".csv",
    how: "Pandas → Parquet",
    notes: "Schema inferred from headers + first N rows",
  },
  {
    ext: ".json",
    how: "Walked + flattened",
    notes: "Nested objects collapsed to columnar fields",
  },
  {
    ext: ".jsonl",
    how: "Line-streamed",
    notes: "Memory-friendly path for very large files",
  },
  {
    ext: ".xml",
    how: "lxml → records",
    notes: "Configurable record-path per dataset",
  },
  {
    ext: ".parquet",
    how: "Pass-through",
    notes: "Already columnar — schema validated against catalog",
  },
];

export function IngestionRuntimeBody() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-primary/25 bg-primary/[0.04] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary/80">
          Scope
        </p>
        <p className="mt-0.5 text-sm leading-snug text-foreground">
          <span className="font-semibold">Designed and built end-to-end</span>{" "}
          — the orchestration workflow, the five polyglot Python processors,
          the S3 event trigger, and the unified output contract that everything
          downstream (including the DAG Lite console) depends on.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Anatomy of an upload
        </h3>
        <div className="rounded-lg border border-border/60 bg-card/40 p-4">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-7 sm:items-stretch">
            <Stage
              Icon={FileText}
              label="S3 upload"
              detail="Caller uses a presigned URL"
            />
            <Sep />
            <Stage
              Icon={Clock}
              label="Trigger λ"
              detail="Thin shim → orchestrator"
              accent
            />
            <Sep />
            <Stage
              Icon={Cog}
              label="Orchestrator"
              detail="Validate → route → invoke"
              accent
            />
            <Sep />
            <Stage
              Icon={ServerCog}
              label="Processor λ"
              detail="One of 5 format-specific Lambdas"
              accent
            />
          </ol>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-7 sm:items-stretch">
            <Stage
              Icon={Boxes}
              label="Output Parquet"
              detail="Chunked, partitioned by date"
            />
            <Sep />
            <Stage
              Icon={Network}
              label="Glue crawler"
              detail="Refresh catalog → new partitions"
              accent
            />
            <Sep />
            <Stage
              Icon={Database}
              label="Athena"
              detail="Queryable within seconds"
            />
            <Sep />
            <Stage
              Icon={ShieldCheck}
              label="ProcessorOutput"
              detail="Same contract for every format"
              accent
            />
          </div>

          <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs text-muted-foreground">
            Adding a sixth file format is one routing branch + one processor
            module. The contract everything else depends on doesn&apos;t change.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Formats it handles
        </h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Extension</th>
                <th className="px-3 py-2 font-medium">How it&apos;s processed</th>
                <th className="px-3 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {FORMATS.map((f) => (
                <tr key={f.ext}>
                  <td className="px-3 py-2 font-mono text-[12px] text-primary">
                    {f.ext}
                  </td>
                  <td className="px-3 py-2 text-foreground/80">{f.how}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {f.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          The contract every processor returns
        </h3>
        <pre className="overflow-x-auto rounded-lg border border-border/60 bg-background/60 p-4 font-mono text-[12px] leading-relaxed text-foreground">
          <code>
            <span className="text-[#7dd3fc]">class</span>{" "}
            <span className="text-[#e9d5ff]">ProcessorOutput</span>(TypedDict):
            {"\n    "}row_count:         <span className="text-[#86efac]">int</span>
            {"\n    "}column_count:      <span className="text-[#86efac]">int</span>
            {"\n    "}schema:            <span className="text-[#86efac]">list</span>[SchemaField]
            {"\n    "}output_keys:       <span className="text-[#86efac]">list</span>[<span className="text-[#86efac]">str</span>]
            {"\n    "}output_format:     <span className="text-[#86efac]">str</span>{"   "}
            <span className="text-muted-foreground"># &quot;parquet&quot; | &quot;jsonl&quot;</span>
            {"\n    "}chunk_count:       <span className="text-[#86efac]">int</span>
            {"\n    "}output_size_bytes: <span className="text-[#86efac]">int</span>
          </code>
        </pre>
        <p className="text-[11px] text-muted-foreground">
          Whether the upload was a 30-byte CSV or a 4-GB Parquet, downstream
          consumers see the same shape.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Big files don&apos;t kill the pipeline
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "The orchestrator watches for OutOfMemoryError on processor workers and bumps memory before retrying.",
            "Retry counter + memory ratchet tracked in state — there's an audit trail of what got bumped where.",
            "JSONL processor streams line-by-line so multi-GB uploads never load the whole file into RAM.",
            "Glue crawler is fired only on successful output, so failed runs never advertise stale partitions.",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-md border border-border/40 bg-background/40 px-3 py-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stage({
  Icon,
  label,
  detail,
  accent,
}: {
  Icon: typeof Cog;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <li
      className={
        accent
          ? "flex flex-col gap-1 rounded-md border border-primary/35 bg-primary/10 px-2.5 py-1.5"
          : "flex flex-col gap-1 rounded-md border border-border/60 bg-background/40 px-2.5 py-1.5"
      }
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={
            accent
              ? "h-3.5 w-3.5 text-primary"
              : "h-3.5 w-3.5 text-muted-foreground"
          }
        />
        <span className="text-[11px] font-semibold text-foreground">
          {label}
        </span>
      </div>
      <p className="text-[10px] leading-snug text-muted-foreground">{detail}</p>
    </li>
  );
}

function Sep() {
  return (
    <li
      aria-hidden="true"
      className="hidden items-center justify-center sm:flex"
    >
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
        <path
          d="M1 5h12m0 0L9 1m4 4L9 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/60"
        />
      </svg>
    </li>
  );
}
