"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
  Cloud,
  BarChart3,
  Workflow,
  Cpu,
  Server,
  Download,
  HardDrive,
  Map,
  Sparkles,
  Scale,
  GitMerge,
  Database,
  PieChart,
  Building2,
  type LucideIcon,
} from "lucide-react";

interface DataFlowDiagramProps {
  className?: string;
}

// Custom node component for data sources
function SourceNode({ data }: { data: { label: string; icon: LucideIcon; color: string } }) {
  const Icon = data.icon;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center border-2 shadow-lg"
        style={{ borderColor: data.color, backgroundColor: `${data.color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color: data.color }} />
      </div>
      <span className="text-[9px] text-muted-foreground text-center max-w-14 leading-tight font-medium">
        {data.label}
      </span>
    </div>
  );
}

// Custom node component for pipeline stages
function StageNode({ data }: { data: { label: string; sublabel?: string; icon: LucideIcon; color: string } }) {
  const Icon = data.icon;
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 shadow-md min-w-[120px]"
      style={{ borderColor: `${data.color}50`, backgroundColor: `${data.color}15` }}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${data.color}30` }}
      >
        <Icon className="w-4 h-4" style={{ color: data.color }} />
      </div>
      <div>
        <div className="text-xs font-semibold" style={{ color: data.color }}>
          {data.label}
        </div>
        {data.sublabel && (
          <div className="text-[9px] text-muted-foreground">{data.sublabel}</div>
        )}
      </div>
    </div>
  );
}

// Custom node component for the unified output
function OutputNode({ data }: { data: { label: string; sublabel: string } }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-2xl" />
      <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-green-500/50 bg-green-500/10 shadow-lg min-w-[200px]">
        <div className="w-10 h-10 rounded-lg bg-green-500/30 flex items-center justify-center">
          <Database className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <div className="text-sm font-bold text-green-400">{data.label}</div>
          <div className="text-[10px] text-muted-foreground">{data.sublabel}</div>
        </div>
      </div>
    </div>
  );
}

// Custom node component for consumers
function ConsumerNode({ data }: { data: { label: string; icon: LucideIcon } }) {
  const Icon = data.icon;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-cyan-500/50 bg-cyan-500/15 shadow-md">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <span className="text-[9px] text-muted-foreground text-center max-w-16 leading-tight font-medium">
        {data.label}
      </span>
    </div>
  );
}

// Group/label node for sections
function GroupLabelNode({ data }: { data: { label: string } }) {
  return (
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1 bg-muted/30 rounded">
      {data.label}
    </div>
  );
}

// Node types mapping
const nodeTypes = {
  source: SourceNode,
  stage: StageNode,
  output: OutputNode,
  consumer: ConsumerNode,
  groupLabel: GroupLabelNode,
};

export function DataFlowDiagram({ className }: DataFlowDiagramProps) {
  // Define nodes
  const initialNodes: Node[] = useMemo(() => [
    // Group Labels
    { id: "label-sources", type: "groupLabel", position: { x: 180, y: 0 }, data: { label: "Data Sources (20+)" }, draggable: false },
    { id: "label-consumers", type: "groupLabel", position: { x: 195, y: 420 }, data: { label: "Consumers" }, draggable: false },

    // Data Sources Row
    { id: "source-cloud", type: "source", position: { x: 0, y: 30 }, data: { label: "Cloud Provider", icon: Cloud, color: "#FF9900" }, draggable: false },
    { id: "source-monitoring", type: "source", position: { x: 100, y: 30 }, data: { label: "Monitoring", icon: BarChart3, color: "#632CA6" }, draggable: false },
    { id: "source-integration", type: "source", position: { x: 200, y: 30 }, data: { label: "Integration", icon: Workflow, color: "#00A2E0" }, draggable: false },
    { id: "source-aiml", type: "source", position: { x: 300, y: 30 }, data: { label: "AI/ML", icon: Cpu, color: "#D97706" }, draggable: false },
    { id: "source-more", type: "source", position: { x: 400, y: 30 }, data: { label: "+16 more", icon: Server, color: "#6B7280" }, draggable: false },

    // Ingestion Layer
    { id: "stage-ingest", type: "stage", position: { x: 60, y: 130 }, data: { label: "Ingestion", sublabel: "APIs, S3 Events", icon: Download, color: "#3B82F6" }, draggable: false },
    { id: "stage-landing", type: "stage", position: { x: 270, y: 130 }, data: { label: "Landing Zone", sublabel: "S3 / Parquet", icon: HardDrive, color: "#3B82F6" }, draggable: false },

    // ETL Pipeline
    { id: "stage-map", type: "stage", position: { x: 0, y: 220 }, data: { label: "Schema Map", sublabel: "Normalize columns", icon: Map, color: "#8B5CF6" }, draggable: false },
    { id: "stage-enrich", type: "stage", position: { x: 150, y: 220 }, data: { label: "Enrich", sublabel: "Add metadata", icon: Sparkles, color: "#8B5CF6" }, draggable: false },
    { id: "stage-allocate", type: "stage", position: { x: 280, y: 220 }, data: { label: "Allocate", sublabel: "Cost distribution", icon: Scale, color: "#8B5CF6" }, draggable: false },
    { id: "stage-unify", type: "stage", position: { x: 420, y: 220 }, data: { label: "Unify", sublabel: "UNION ALL", icon: GitMerge, color: "#8B5CF6" }, draggable: false },

    // Unified Output
    { id: "output", type: "output", position: { x: 145, y: 320 }, data: { label: "FOCUS v1.2", sublabel: "65 Columns • Unified" }, draggable: false },

    // Consumers Row
    { id: "consumer-bi", type: "consumer", position: { x: 100, y: 450 }, data: { label: "BI Dashboards", icon: PieChart }, draggable: false },
    { id: "consumer-finance", type: "consumer", position: { x: 210, y: 450 }, data: { label: "Finance", icon: Building2 }, draggable: false },
    { id: "consumer-anomaly", type: "consumer", position: { x: 320, y: 450 }, data: { label: "Anomaly Detection", icon: BarChart3 }, draggable: false },
  ], []);

  // Define edges
  const initialEdges: Edge[] = useMemo(() => [
    // Sources to Ingestion
    { id: "e-cloud-ingest", source: "source-cloud", target: "stage-ingest", animated: true, style: { stroke: "#FF990050" } },
    { id: "e-monitoring-ingest", source: "source-monitoring", target: "stage-ingest", animated: true, style: { stroke: "#632CA650" } },
    { id: "e-integration-ingest", source: "source-integration", target: "stage-ingest", animated: true, style: { stroke: "#00A2E050" } },
    { id: "e-aiml-ingest", source: "source-aiml", target: "stage-landing", animated: true, style: { stroke: "#D9770650" } },
    { id: "e-more-ingest", source: "source-more", target: "stage-landing", animated: true, style: { stroke: "#6B728050" } },

    // Ingestion to Landing
    { 
      id: "e-ingest-landing", 
      source: "stage-ingest", 
      target: "stage-landing", 
      animated: true, 
      style: { stroke: "#3B82F6" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#3B82F6" },
    },

    // Landing to ETL Pipeline
    { id: "e-landing-map", source: "stage-landing", target: "stage-map", animated: true, style: { stroke: "#8B5CF650" } },
    { id: "e-landing-enrich", source: "stage-landing", target: "stage-enrich", animated: true, style: { stroke: "#8B5CF650" } },

    // ETL Pipeline flow
    { 
      id: "e-map-enrich", 
      source: "stage-map", 
      target: "stage-enrich", 
      animated: true, 
      style: { stroke: "#8B5CF6" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
    },
    { 
      id: "e-enrich-allocate", 
      source: "stage-enrich", 
      target: "stage-allocate", 
      animated: true, 
      style: { stroke: "#8B5CF6" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
    },
    { 
      id: "e-allocate-unify", 
      source: "stage-allocate", 
      target: "stage-unify", 
      animated: true, 
      style: { stroke: "#8B5CF6" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
    },

    // Unify to Output
    { 
      id: "e-unify-output", 
      source: "stage-unify", 
      target: "output", 
      animated: true, 
      style: { stroke: "#22C55E" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#22C55E" },
    },

    // Output to Consumers
    { id: "e-output-bi", source: "output", target: "consumer-bi", animated: true, style: { stroke: "#06B6D450" } },
    { id: "e-output-finance", source: "output", target: "consumer-finance", animated: true, style: { stroke: "#06B6D450" } },
    { id: "e-output-anomaly", source: "output", target: "consumer-anomaly", animated: true, style: { stroke: "#06B6D450" } },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={cn("w-full h-[520px] rounded-xl overflow-hidden border border-border/50 bg-background/50", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.8}
        maxZoom={1.2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.1)" />
      </ReactFlow>
    </div>
  );
}
