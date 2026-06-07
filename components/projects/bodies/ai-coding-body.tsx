"use client";

import {
  Apple,
  Box,
  KeyRound,
  MonitorSmartphone,
  Settings2,
  Telescope,
  Terminal,
} from "lucide-react";

const STEPS = [
  {
    label: "01 · launch",
    title: "Developer runs the CLI",
    body: "First call discovers a missing profile and shells out to the AWS credential_process helper bundled with the installer.",
  },
  {
    label: "02 · sso",
    title: "Browser opens to corporate SSO",
    body: "OIDC provider (Okta / Azure AD / Cognito User Pool) authenticates the user and returns an id_token to the helper.",
  },
  {
    label: "03 · federate",
    title: "Federate into a Cognito Identity Pool",
    body: "The id_token is exchanged for short-lived AWS credentials scoped to a developer role with Bedrock model invocation rights.",
  },
  {
    label: "04 · cache",
    title: "Credentials cached per profile",
    body: "Credentials are kept in the SDK's credential cache and refreshed transparently — no static keys, no shared accounts.",
  },
  {
    label: "05 · observe",
    title: "Telemetry forwarded with identity",
    body: "An OTEL helper extracts user claims from the JWT and forwards usage/cost telemetry to an enterprise collector.",
  },
];

const PLATFORMS = [
  { os: "macOS · Apple Silicon", artifact: "claude-code-bedrock-X.X.X.pkg" },
  { os: "macOS · Intel", artifact: "claude-code-bedrock-X.X.X.tar.gz" },
  { os: "Linux · arm64", artifact: "claude-code-bedrock-X.X.X.tar.gz" },
  { os: "Linux · x64", artifact: "claude-code-bedrock-X.X.X.tar.gz" },
  { os: "Windows", artifact: "claude-code-bedrock-X.X.X.zip" },
];

const COMPONENTS = [
  {
    Icon: KeyRound,
    name: "credential_process",
    purpose:
      "Federates OIDC id_token → Cognito Identity Pool → cached AWS credentials per profile. Multi-provider config supports Okta, Azure AD, and Cognito User Pool.",
  },
  {
    Icon: Telescope,
    name: "otel-helper",
    purpose:
      "Parses the JWT, extracts user claims, and writes the OpenTelemetry headers the collector expects — usage telemetry tied to identity.",
  },
  {
    Icon: Settings2,
    name: "settings-helper",
    purpose:
      "Creates or reconciles the CLI's local settings.json without clobbering unrelated developer preferences.",
  },
  {
    Icon: Box,
    name: "installer + CDN check",
    purpose:
      "One-line install that registers the AWS profile, verifies authentication, and polls for binary updates on subsequent runs.",
  },
];

export function AiCodingBody() {
  return (
    <div className="space-y-8">
      {/* Authorship callout */}
      <div className="rounded-lg border border-primary/25 bg-primary/[0.04] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-primary/80">
          Scope
        </p>
        <p className="mt-0.5 text-sm leading-snug text-foreground">
          <span className="font-semibold">Designed and built end-to-end</span>{" "}
          — the Python helpers, the cross-platform release pipeline, and the
          installer. Lets internal developers point an AI coding CLI at AWS
          Bedrock with corporate SSO instead of third-party API keys.
        </p>
      </div>

      {/* What ships in the box */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          What ships in the box
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMPONENTS.map(({ Icon, name, purpose }) => (
            <div
              key={name}
              className="rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <p className="font-mono text-[12px] font-semibold text-foreground">
                  {name}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {purpose}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick-install card */}
      <section className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Quick install
          </p>
        </div>
        <pre className="mt-3 overflow-x-auto rounded border border-border/40 bg-background/60 p-3 font-mono text-[12px] text-foreground">
          <code>
            <span className="text-muted-foreground"># macOS / Linux</span>
            {"\n"}
            ./install.sh
            {"\n"}
            export AWS_PROFILE=ClaudeCode
            {"\n"}
            aws sts get-caller-identity
          </code>
        </pre>
        <p className="mt-2 text-[11px] text-muted-foreground">
          The installer copies the credential_process + OTEL helpers, registers
          a `ClaudeCode` AWS profile, and verifies authentication before
          handing off to the CLI.
        </p>
      </section>

      {/* Federation sequence */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Federation sequence
        </h3>
        <ol className="space-y-3">
          {STEPS.map((step) => (
            <li
              key={step.label}
              className="flex gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10 font-mono text-[10px] uppercase tracking-wider text-primary">
                {step.label}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Release matrix */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Release artifacts
        </h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Platform</th>
                <th className="px-3 py-2 font-medium">Bundle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {PLATFORMS.map((p) => (
                <tr key={p.os}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 text-foreground">
                      {p.os.startsWith("macOS") ? (
                        <Apple className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <MonitorSmartphone className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {p.os}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">
                    {p.artifact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Built with PyInstaller. Tagging a release fires a GitHub Actions
          workflow that fan-builds binaries for every platform/arch above and
          publishes a single GitHub Release.
        </p>
      </section>
    </div>
  );
}
