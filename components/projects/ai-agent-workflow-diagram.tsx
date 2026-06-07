"use client";

import {
  Terminal,
  KeyRound,
  Cloud,
  Cpu,
  ShieldCheck,
  Activity,
  Package,
} from "lucide-react";
import {
  DiagramArrow,
  DiagramFrame,
  DiagramLegend,
  DiagramNode,
  DiagramRow,
} from "./diagram-primitives";

/**
 * Federated AI coding agent workflow:
 * developer → corporate SSO (OIDC) → identity pool → AWS credentials → Bedrock,
 * with telemetry forked from the same JWT to an OTEL collector.
 */
export function AiAgentWorkflowDiagram() {
  return (
    <DiagramFrame>
      <div className="space-y-2">
        <DiagramRow label="Developer">
          <DiagramNode
            tone="neutral"
            Icon={Terminal}
            label="AI Coding CLI"
            description="Local agent on macOS / Linux / Windows"
          />
          <DiagramNode
            tone="neutral"
            Icon={Package}
            label="Signed Installer"
            description="PyInstaller binaries shipped via GitHub Actions"
          />
        </DiagramRow>

        <DiagramArrow label="Federate" />

        <DiagramRow label="Identity">
          <DiagramNode
            tone="auth"
            Icon={KeyRound}
            label="Corporate SSO"
            description="OIDC provider (Okta / Azure AD / Cognito User Pool)"
          />
          <DiagramNode
            tone="auth"
            Icon={ShieldCheck}
            label="Identity Pool"
            description="Federates the OIDC token, mints scoped AWS creds"
          />
          <DiagramNode
            tone="auth"
            Icon={ShieldCheck}
            label="credential_process"
            description="AWS SDK helper that caches short-lived credentials"
          />
        </DiagramRow>

        <DiagramArrow label="AssumeRole" />

        <DiagramRow label="Inference">
          <DiagramNode
            tone="compute"
            Icon={Cloud}
            label="Managed LLM Runtime"
            description="Foundation models hosted in the corporate AWS account"
          />
          <DiagramNode
            tone="compute"
            Icon={Cpu}
            label="Agent Tools"
            description="Filesystem, shell, web, and code-aware tool calls"
          />
        </DiagramRow>

        <DiagramArrow label="Telemetry" />

        <DiagramRow label="Observability">
          <DiagramNode
            tone="consume"
            Icon={Activity}
            label="OTEL Helper"
            description="Extracts user identity claims from the JWT"
          />
          <DiagramNode
            tone="consume"
            Icon={Activity}
            label="Collector"
            description="Aggregates usage and cost attribution metrics"
          />
        </DiagramRow>
      </div>

      <DiagramLegend
        items={[
          { tone: "auth", label: "Identity / Auth" },
          { tone: "compute", label: "Inference" },
          { tone: "consume", label: "Telemetry" },
          { tone: "neutral", label: "Developer surface" },
        ]}
      />
    </DiagramFrame>
  );
}
