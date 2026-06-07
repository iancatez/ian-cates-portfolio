"use client";

import {
  Globe,
  KeyRound,
  Lock,
  Server,
  Database,
  HardDrive,
  BarChart3,
  ListChecks,
  Activity,
} from "lucide-react";
import {
  DiagramArrow,
  DiagramFrame,
  DiagramLegend,
  DiagramNode,
  DiagramRow,
} from "./diagram-primitives";

/**
 * Operational insights architecture:
 * dual ingress (programmatic + portal) → API → catalog & storage,
 * with the React admin surface fed by the same routes.
 */
export function OperationalInsightsDiagram() {
  return (
    <DiagramFrame>
      <div className="space-y-2">
        <DiagramRow label="Clients">
          <DiagramNode
            tone="neutral"
            Icon={Globe}
            label="Programmatic"
            description="External services calling the v2 dataset API"
          />
          <DiagramNode
            tone="neutral"
            Icon={BarChart3}
            label="Admin Portal"
            description="React 19 + TypeScript SPA — metrics, activity, datasets"
          />
        </DiagramRow>

        <DiagramArrow label="Ingress" />

        <DiagramRow label="Edge">
          <DiagramNode
            tone="auth"
            Icon={KeyRound}
            label="API Gateway"
            description="Usage-plan API keys + trusted identity headers"
          />
          <DiagramNode
            tone="auth"
            Icon={Lock}
            label="OAuth Session"
            description="Session cookies for portal traffic with route guards"
          />
        </DiagramRow>

        <DiagramArrow label="Request" />

        <DiagramRow label="Service">
          <DiagramNode
            tone="compute"
            Icon={Server}
            label="FastAPI App"
            description="Routers · services · repositories with structured JSON logs"
          />
          <DiagramNode
            tone="compute"
            Icon={ListChecks}
            label="Admin Endpoints"
            description="Activity log · aggregate metrics · health · routes"
          />
        </DiagramRow>

        <DiagramArrow label="Persist" />

        <DiagramRow label="State">
          <DiagramNode
            tone="storage"
            Icon={Database}
            label="DynamoDB Catalog"
            description="Single-table workspaces · datasets · ingestions, four GSIs"
          />
          <DiagramNode
            tone="storage"
            Icon={HardDrive}
            label="S3 Datasets"
            description="Presigned upload URLs and partitioned dataset storage"
          />
          <DiagramNode
            tone="storage"
            Icon={Activity}
            label="Request Log"
            description="In-memory ring buffer feeds the admin activity views"
          />
        </DiagramRow>
      </div>

      <DiagramLegend
        items={[
          { tone: "neutral", label: "Client surface" },
          { tone: "auth", label: "Auth / Edge" },
          { tone: "compute", label: "Service" },
          { tone: "storage", label: "State" },
        ]}
      />
    </DiagramFrame>
  );
}
