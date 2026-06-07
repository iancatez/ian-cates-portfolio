"use client";

import {
  GitBranch,
  GitPullRequest,
  ShieldCheck,
  Boxes,
  Cloud,
  Cog,
  FileCode2,
  Workflow,
} from "lucide-react";
import {
  DiagramArrow,
  DiagramFrame,
  DiagramLegend,
  DiagramNode,
  DiagramRow,
} from "./diagram-primitives";

/**
 * Cloud deployment workflow: PR → Terraform Cloud plan/apply → AWS, plus the
 * reusable module library that backs every service template.
 */
export function CloudDeploymentDiagram() {
  return (
    <DiagramFrame>
      <div className="space-y-2">
        <DiagramRow label="Author">
          <DiagramNode
            tone="neutral"
            Icon={FileCode2}
            label="Service Template"
            description="Child Terraform module per service (Lambda, SQS, Step Function…)"
          />
          <DiagramNode
            tone="neutral"
            Icon={Boxes}
            label="Reusable Modules"
            description="lambda · s3-bucket · sqs-queue · dynamodb-table · step-function · redshift-serverless"
          />
        </DiagramRow>

        <DiagramArrow label="Pull Request" />

        <DiagramRow label="CI / Review">
          <DiagramNode
            tone="auth"
            Icon={GitBranch}
            label="Branch"
            description="Feature branch, ~200 lines per PR"
          />
          <DiagramNode
            tone="auth"
            Icon={GitPullRequest}
            label="Automated review"
            description="Codex review + required CI checks before merge"
          />
          <DiagramNode
            tone="auth"
            Icon={ShieldCheck}
            label="Validation"
            description="terraform fmt · validate · plan in CI"
          />
        </DiagramRow>

        <DiagramArrow label="Squash merge" />

        <DiagramRow label="Run">
          <DiagramNode
            tone="compute"
            Icon={Workflow}
            label="Terraform Cloud"
            description="Speculative plan, then gated apply with assume-role creds"
          />
          <DiagramNode
            tone="compute"
            Icon={Cog}
            label="Plan output"
            description="Reviewed in-app; zero-destroy guard for stateful resources"
          />
        </DiagramRow>

        <DiagramArrow label="Apply" />

        <DiagramRow label="Targets">
          <DiagramNode
            tone="consume"
            Icon={Cloud}
            label="dev"
            description="Per-deployment prefix for isolation and quick iteration"
          />
          <DiagramNode
            tone="consume"
            Icon={Cloud}
            label="stage"
            description="Pre-prod parity for integration testing"
          />
          <DiagramNode
            tone="consume"
            Icon={Cloud}
            label="prod"
            description="Production deployment with monitored runs"
          />
        </DiagramRow>
      </div>

      <DiagramLegend
        items={[
          { tone: "neutral", label: "Code / modules" },
          { tone: "auth", label: "Review gate" },
          { tone: "compute", label: "Run" },
          { tone: "consume", label: "Environment" },
        ]}
      />
    </DiagramFrame>
  );
}
