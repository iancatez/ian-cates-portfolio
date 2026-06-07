"use client";

import { Boxes } from "lucide-react";

const MODULES = [
  {
    name: "lambda",
    creates: "Lambda + IAM role + log group + triggers",
    opinion: "Per-function least-privilege; DLQ + retry baked in.",
  },
  {
    name: "s3-bucket",
    creates: "S3 bucket + versioning + KMS + lifecycle + PAB",
    opinion: "Public access blocked by default; lowercase names enforced.",
  },
  {
    name: "sqs-queue",
    creates: "SQS + DLQ + KMS; FIFO opt-in",
    opinion: "DLQ wired automatically; redrive policy is required.",
  },
  {
    name: "dynamodb-table",
    creates: "Table + GSI/LSI + TTL + streams + autoscale",
    opinion: "Encrypted at rest; PITR is on unless explicitly disabled.",
  },
  {
    name: "step-function",
    creates: "State machine + IAM + CloudWatch logs",
    opinion: "Express + Standard supported; log level defaults to ALL.",
  },
  {
    name: "redshift-serverless",
    creates: "Namespace + workgroup + IAM role for COPY",
    opinion: "Security group, default schema, and database roles included.",
  },
];

const WORKFLOW = [
  {
    n: "1",
    title: "Atomic PR (~200 lines)",
    body: "One concern per PR, mirrored to dev + prod directories.",
  },
  {
    n: "2",
    title: "CI: fmt · validate · plan",
    body: "Required checks run against both environments before approval.",
  },
  {
    n: "3",
    title: "Speculative plan in Terraform Cloud",
    body: "Reviewed in-app; zero-destroy guard for stateful resources.",
  },
  {
    n: "4",
    title: "Squash-merge → apply",
    body: "Apply runs under workspace assume-role; secrets stay in TFC.",
  },
];

export function TerraformModulesBody() {
  return (
    <div className="space-y-8">
      {/* Example call snippet */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Module call · the whole point
        </h3>
        <pre className="overflow-x-auto rounded-lg border border-border/60 bg-background/60 p-4 font-mono text-[12px] leading-relaxed text-foreground">
          <code>
            <span className="text-[#7dd3fc]">module</span>{" "}
            <span className="text-[#e9d5ff]">&quot;json_processor&quot;</span>{" "}
            {"{"}
            {"\n"}  source             ={" "}
            <span className="text-[#86efac]">
              &quot;../../modules/lambda&quot;
            </span>
            {"\n"}  resource_prefix    = local.resource_prefix
            {"\n"}  solution_name      ={" "}
            <span className="text-[#86efac]">
              &quot;author-pipeline&quot;
            </span>
            {"\n"}  component          ={" "}
            <span className="text-[#86efac]">
              &quot;json-processor&quot;
            </span>
            {"\n"}  handler            ={" "}
            <span className="text-[#86efac]">&quot;index.handler&quot;</span>
            {"\n"}  runtime            ={" "}
            <span className="text-[#86efac]">&quot;python3.12&quot;</span>
            {"\n"}  environment_vars   = local.lambda_env_vars
            {"\n"}  s3_trigger_bucket  = module.uploads.bucket_name
            {"\n"}  dead_letter_queue  = module.dlq.queue_arn
            {"\n"}  tags               = local.common_tags
            {"\n"}{"}"}
          </code>
        </pre>
        <p className="text-[11px] text-muted-foreground">
          The caller passes a <span className="font-mono">component</span>{" "}
          name. The module computes the full resource name, attaches IAM,
          wires triggers, and registers logs/DLQ — there's nothing left to
          remember.
        </p>
      </section>

      {/* Naming convention */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Naming convention threaded everywhere
        </h3>
        <div className="rounded-lg border border-border/60 bg-card/40 p-4 font-mono text-sm">
          <p className="text-foreground">
            <span className="text-primary">{`{resource_prefix}`}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-cyan-300">{`{solution_name}`}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-pink-300">{`{component}`}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">e.g.</p>
          <p className="mt-1 text-[13px]">
            <span className="text-primary">data-prod</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-cyan-300">author-pipeline</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-pink-300">json-processor</span>
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">
            <span className="text-foreground/80">resource_prefix</span>{" "}
            collapses deployment + environment so two stacks never collide.
            Lambda functions, S3 buckets, IAM roles, log groups, step
            machines — all derived from this one rule.
          </p>
        </div>
      </section>

      {/* Module catalog */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Module catalog
        </h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Module</th>
                <th className="px-3 py-2 font-medium">Creates</th>
                <th className="px-3 py-2 font-medium">Opinion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {MODULES.map((m) => (
                <tr key={m.name}>
                  <td className="px-3 py-2 align-top">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-primary">
                      <Boxes className="h-3.5 w-3.5" />
                      {m.name}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-foreground/80">
                    {m.creates}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {m.opinion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PR workflow */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Ship discipline
        </h3>
        <ol className="grid gap-3 sm:grid-cols-2">
          {WORKFLOW.map((w) => (
            <li
              key={w.n}
              className="flex gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs text-primary">
                {w.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {w.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
