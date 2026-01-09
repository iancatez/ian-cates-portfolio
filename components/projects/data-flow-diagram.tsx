"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  Position,
  Handle,
  NodeProps,
  EdgeProps,
  BaseEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
  Cloud,
  BarChart3,
  Workflow,
  Cpu,
  Database,
  FolderOpen,
  TableProperties,
  Eye,
  Layers,
  PieChart,
  TrendingUp,
  Shield,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";

interface DataFlowDiagramProps {
  className?: string;
}

// Node data interface
interface BaseNodeData {
  label: string;
  description?: string;
  badge?: string;
  metadata?: string;
  icon?: LucideIcon;
  color: string;
  [key: string]: unknown;
}

// === PERFECT SYMMETRY: Center axis at x=700 ===
const CENTER_X = 700;

// === ROW Y POSITIONS (260px spacing for edge routing) ===
const ROW_Y = {
  SOURCES: 80,
  LAMBDA: 340,      // +260px
  STORAGE: 600,     // +260px
  ATHENA: 860,      // +260px
  FOCUS: 1120,      // +260px
  CONSUMERS: 1380,  // +260px
};

// === NODE DIMENSIONS ===
const DIMS = {
  SOURCE: { width: 130, height: 80 },
  LAMBDA: { width: 170, height: 90 },
  STORAGE: { width: 160, height: 85 },
  ATHENA: { width: 170, height: 90 },
  FOCUS: { width: 260, height: 130 },
  CONSUMER: { width: 140, height: 80 },
};

// === SYMMETRIC X POSITIONS (accounting for node width to center properly) ===
// The position is the left edge, so we offset by half the node width

// Sources: 7 nodes, 150px center-to-center spacing
const SOURCE_SPACING = 150;
const sourceX = Array.from({ length: 7 }, (_, i) => 
  CENTER_X + (i - 3) * SOURCE_SPACING - DIMS.SOURCE.width / 2
);

// Lambda: 3 nodes, 300px center-to-center spacing
const LAMBDA_SPACING = 300;
const lambdaX = [
  CENTER_X - LAMBDA_SPACING - DIMS.LAMBDA.width / 2,
  CENTER_X - DIMS.LAMBDA.width / 2,
  CENTER_X + LAMBDA_SPACING - DIMS.LAMBDA.width / 2,
];

// Storage: 2 nodes, 260px center-to-center spacing
const STORAGE_SPACING = 260;
const storageX = [
  CENTER_X - STORAGE_SPACING / 2 - DIMS.STORAGE.width / 2,
  CENTER_X + STORAGE_SPACING / 2 - DIMS.STORAGE.width / 2,
];

// Athena: 3 nodes, 300px center-to-center spacing
const athenaX = [
  CENTER_X - LAMBDA_SPACING - DIMS.ATHENA.width / 2,
  CENTER_X - DIMS.ATHENA.width / 2,
  CENTER_X + LAMBDA_SPACING - DIMS.ATHENA.width / 2,
];

// FOCUS: 1 node, perfectly centered
const focusX = CENTER_X - DIMS.FOCUS.width / 2;

// Consumers: 2 nodes, 240px center-to-center spacing
const CONSUMER_SPACING = 240;
const consumerX = [
  CENTER_X - CONSUMER_SPACING / 2 - DIMS.CONSUMER.width / 2,
  CENTER_X + CONSUMER_SPACING / 2 - DIMS.CONSUMER.width / 2,
];

// Typography styles
const textStyles = {
  label: { fontSize: 11, fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.5)" },
  description: { fontSize: 9, fontWeight: 400, lineHeight: 1.2, textShadow: "0 1px 2px rgba(0,0,0,0.5)" },
  badge: { fontSize: 7, fontWeight: 600, textTransform: "uppercase" as const },
};

// Handle styles
const handleStyle = (color: string) => ({
  background: color,
  width: 6,
  height: 6,
  border: "1px solid rgba(0,0,0,0.3)",
});

// === CUSTOM NODE COMPONENTS ===

function SourceNode({ data }: NodeProps<Node<BaseNodeData>>) {
  const Icon = data.icon as LucideIcon;
  return (
    <div
      style={{
        width: DIMS.SOURCE.width,
        minHeight: DIMS.SOURCE.height,
        padding: "8px 8px 10px 8px",
        borderRadius: 8,
        border: `2px solid ${data.color}`,
        backgroundColor: `${data.color}15`,
        boxShadow: `0 3px 10px ${data.color}20`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle(data.color)} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle(data.color)} />
      
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {Icon && <Icon size={12} style={{ color: data.color, flexShrink: 0 }} />}
        <span style={{ ...textStyles.label, color: data.color }}>{data.label}</span>
      </div>
      
      {data.description && (
        <p style={{ 
          ...textStyles.description, 
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.4,
          margin: 0,
        }}>
          {data.description}
        </p>
      )}
      
      {data.badge && (
        <span style={{
          ...textStyles.badge,
          marginTop: "auto",
          padding: "2px 5px",
          borderRadius: 3,
          backgroundColor: `${data.color}30`,
          color: data.color,
          alignSelf: "flex-start",
          lineHeight: 1.3,
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

function LambdaNode({ data }: NodeProps<Node<BaseNodeData>>) {
  return (
    <div
      style={{
        width: DIMS.LAMBDA.width,
        height: DIMS.LAMBDA.height,
        padding: "8px",
        borderRadius: 8,
        border: `2px solid ${data.color}`,
        backgroundColor: `${data.color}15`,
        boxShadow: `0 3px 12px ${data.color}25`,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
      }}
    >
      {/* 2 top handles spread at 35% and 65% */}
      <Handle type="target" position={Position.Top} id="top-left" style={{ ...handleStyle(data.color), left: "35%" }} />
      <Handle type="target" position={Position.Top} id="top-right" style={{ ...handleStyle(data.color), left: "65%" }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle(data.color)} />
      
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: data.color }}>λ</span>
        <span style={{ ...textStyles.label, color: data.color }}>{data.label}</span>
      </div>
      
      {data.description && (
        <p style={{ 
          ...textStyles.description, 
          color: "rgba(255,255,255,0.65)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {data.description}
        </p>
      )}
      
      {data.badge && (
        <span style={{
          ...textStyles.badge,
          marginTop: "auto",
          padding: "1px 4px",
          borderRadius: 3,
          backgroundColor: `${data.color}30`,
          color: data.color,
          alignSelf: "flex-start",
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

function StorageNode({ data }: NodeProps<Node<BaseNodeData>>) {
  const Icon = (data.icon as LucideIcon) || Database;
  const isS3 = data.label?.toString().includes("S3");
  
  return (
    <div
      style={{
        width: DIMS.STORAGE.width,
        height: DIMS.STORAGE.height,
        padding: "8px",
        borderRadius: 8,
        border: `2px solid ${data.color}`,
        backgroundColor: `${data.color}15`,
        boxShadow: `0 3px 12px ${data.color}25`,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
      }}
    >
      {isS3 ? (
        <>
          {/* S3: 3 top handles for Lambda inputs, bottom and right for outputs */}
          <Handle type="target" position={Position.Top} id="top-left" style={{ ...handleStyle(data.color), left: "25%" }} />
          <Handle type="target" position={Position.Top} id="top-center" style={{ ...handleStyle(data.color), left: "50%" }} />
          <Handle type="target" position={Position.Top} id="top-right" style={{ ...handleStyle(data.color), left: "75%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle(data.color)} />
          <Handle type="source" position={Position.Right} id="right" style={handleStyle(data.color)} />
        </>
      ) : (
        <>
          {/* Glue: left for S3, right handles for Marketplace/Contracts, 3 bottom handles for Athena */}
          <Handle type="target" position={Position.Left} id="left" style={handleStyle(data.color)} />
          <Handle type="target" position={Position.Right} id="right-top" style={{ ...handleStyle(data.color), top: "30%" }} />
          <Handle type="target" position={Position.Right} id="right-bottom" style={{ ...handleStyle(data.color), top: "70%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom-left" style={{ ...handleStyle(data.color), left: "25%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom-center" style={{ ...handleStyle(data.color), left: "50%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ ...handleStyle(data.color), left: "75%" }} />
        </>
      )}
      
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Icon size={12} style={{ color: data.color, flexShrink: 0 }} />
        <span style={{ ...textStyles.label, color: data.color }}>{data.label}</span>
      </div>
      
      {data.description && (
        <p style={{ 
          ...textStyles.description, 
          color: "rgba(255,255,255,0.65)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {data.description}
        </p>
      )}
      
      {data.badge && (
        <span style={{
          ...textStyles.badge,
          marginTop: "auto",
          padding: "1px 4px",
          borderRadius: 3,
          backgroundColor: `${data.color}30`,
          color: data.color,
          alignSelf: "flex-start",
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

function AthenaNode({ data }: NodeProps<Node<BaseNodeData>>) {
  return (
    <div
      style={{
        width: DIMS.ATHENA.width,
        height: DIMS.ATHENA.height,
        padding: "8px",
        borderRadius: 8,
        border: `2px solid ${data.color}`,
        backgroundColor: `${data.color}15`,
        boxShadow: `0 3px 12px ${data.color}25`,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={handleStyle(data.color)} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle(data.color)} />
      
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Eye size={12} style={{ color: data.color, flexShrink: 0 }} />
        <span style={{ ...textStyles.label, color: data.color }}>{data.label}</span>
      </div>
      
      {data.description && (
        <p style={{ 
          ...textStyles.description, 
          color: "rgba(255,255,255,0.65)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {data.description}
        </p>
      )}
      
      {data.badge && (
        <span style={{
          ...textStyles.badge,
          marginTop: "auto",
          padding: "1px 4px",
          borderRadius: 3,
          backgroundColor: `${data.color}30`,
          color: data.color,
          alignSelf: "flex-start",
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

function FocusNode({ data }: NodeProps<Node<BaseNodeData>>) {
  return (
    <div
      style={{
        width: DIMS.FOCUS.width,
        height: DIMS.FOCUS.height,
        padding: "12px",
        borderRadius: 12,
        border: "3px solid #22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.12)",
        boxShadow: "0 0 35px rgba(34, 197, 94, 0.35), 0 6px 24px rgba(34, 197, 94, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* 3 top handles spread at 30%, 50%, 70% */}
      <Handle type="target" position={Position.Top} id="top-left" style={{ ...handleStyle("#22C55E"), left: "30%" }} />
      <Handle type="target" position={Position.Top} id="top-center" style={{ ...handleStyle("#22C55E"), left: "50%" }} />
      <Handle type="target" position={Position.Top} id="top-right" style={{ ...handleStyle("#22C55E"), left: "70%" }} />
      {/* 2 bottom handles at 40% and 60% */}
      <Handle type="source" position={Position.Bottom} id="bottom-left" style={{ ...handleStyle("#22C55E"), left: "40%" }} />
      <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ ...handleStyle("#22C55E"), left: "60%" }} />
      
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Layers size={20} style={{ color: "#22C55E" }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: "#22C55E", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          {data.label}
        </span>
      </div>
      
      {data.description && (
        <p style={{ 
          fontSize: 9,
          fontWeight: 400,
          lineHeight: 1.3,
          color: "rgba(255,255,255,0.75)",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          margin: 0,
          maxWidth: "95%",
        }}>
          {data.description}
        </p>
      )}
      
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
        {data.badge && (
          <span style={{
            ...textStyles.badge,
            padding: "2px 6px",
            borderRadius: 4,
            backgroundColor: "rgba(34, 197, 94, 0.25)",
            color: "#4ADE80",
          }}>
            {data.badge}
          </span>
        )}
        {data.metadata && (
          <span style={{
            ...textStyles.badge,
            padding: "2px 6px",
            borderRadius: 4,
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            color: "#86EFAC",
          }}>
            {data.metadata}
          </span>
        )}
      </div>
    </div>
  );
}

function ConsumerNode({ data }: NodeProps<Node<BaseNodeData>>) {
  const Icon = (data.icon as LucideIcon) || PieChart;
  return (
    <div
      style={{
        width: DIMS.CONSUMER.width,
        height: DIMS.CONSUMER.height,
        padding: "8px",
        borderRadius: 8,
        border: `2px solid ${data.color}`,
        backgroundColor: `${data.color}15`,
        boxShadow: `0 3px 10px ${data.color}20`,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={handleStyle(data.color)} />
      
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Icon size={12} style={{ color: data.color, flexShrink: 0 }} />
        <span style={{ ...textStyles.label, color: data.color }}>{data.label}</span>
      </div>
      
      {data.description && (
        <p style={{ 
          ...textStyles.description, 
          color: "rgba(255,255,255,0.65)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          margin: 0,
        }}>
          {data.description}
        </p>
      )}
      
      {data.badge && (
        <span style={{
          ...textStyles.badge,
          marginTop: "auto",
          padding: "1px 4px",
          borderRadius: 3,
          backgroundColor: `${data.color}30`,
          color: data.color,
          alignSelf: "flex-start",
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

function LabelNode({ data }: NodeProps<Node<{ label: string; [key: string]: unknown }>>) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "rgba(255,255,255,0.8)",
      textAlign: "center",
      whiteSpace: "nowrap",
      padding: "5px 14px",
      backgroundColor: "#0a0a0a",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 6,
      boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
      position: "relative",
      zIndex: 9999,
    }}>
      {data.label}
    </div>
  );
}

// Custom edge for Marketplace → Glue routing
// Path: DOWN → RIGHT (clear Lambda) → DOWN (to target Y level) → LEFT → arrive at target
function DirectImportEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const r = 18; // border radius for curves
  const yOffset = (data?.yOffset as number) || 0;
  
  // Key Y levels for routing
  const firstTurnY = ROW_Y.SOURCES + DIMS.SOURCE.height + 30 + yOffset; // Turn right shortly after leaving source
  
  // Go right far enough to clear all Lambda nodes
  const rightmostX = lambdaX[2] + DIMS.LAMBDA.width + 40;
  
  // Path with 4 segments ending exactly at target handle
  const path = `
    M ${sourceX} ${sourceY}
    L ${sourceX} ${firstTurnY - r}
    Q ${sourceX} ${firstTurnY} ${sourceX + r} ${firstTurnY}
    L ${rightmostX - r} ${firstTurnY}
    Q ${rightmostX} ${firstTurnY} ${rightmostX} ${firstTurnY + r}
    L ${rightmostX} ${targetY - r}
    Q ${rightmostX} ${targetY} ${rightmostX - r} ${targetY}
    L ${targetX} ${targetY}
  `;

  return (
    <BaseEdge
      id={id}
      path={path}
      style={style}
      markerEnd={markerEnd}
    />
  );
}

// Node types
const nodeTypes = {
  source: SourceNode,
  lambda: LambdaNode,
  storage: StorageNode,
  athena: AthenaNode,
  focus: FocusNode,
  consumer: ConsumerNode,
  label: LabelNode,
};

// Edge types (custom edges)
const edgeTypes = {
  directImport: DirectImportEdge,
};

// Arrow marker helper
const arrow = (color: string) => ({
  type: MarkerType.ArrowClosed,
  width: 10,
  height: 10,
  color,
});

// Edge base style
const edgeStyle = (color: string, width: number = 2, dashed: boolean = false) => ({
  stroke: color,
  strokeWidth: width,
  ...(dashed ? { strokeDasharray: "6 4" } : {}),
});

export function DataFlowDiagram({ className }: DataFlowDiagramProps) {
  const initialNodes: Node[] = useMemo(() => [
    // === ROW 1: DATA SOURCES (symmetric around CENTER_X, all same teal color) ===
    { id: "src-cloud", type: "source", position: { x: sourceX[0], y: ROW_Y.SOURCES }, data: { label: "Cloud", description: "AWS, Azure, GCP", badge: "Multi-cloud", icon: Cloud, color: "#14B8A6" }, draggable: false },
    { id: "src-monitoring", type: "source", position: { x: sourceX[1], y: ROW_Y.SOURCES }, data: { label: "Monitoring", description: "Datadog metrics", badge: "API", icon: BarChart3, color: "#14B8A6" }, draggable: false },
    { id: "src-integration", type: "source", position: { x: sourceX[2], y: ROW_Y.SOURCES }, data: { label: "Integration", description: "SnapLogic, Kong", badge: "iPaaS", icon: Workflow, color: "#14B8A6" }, draggable: false },
    { id: "src-aiml", type: "source", position: { x: sourceX[3], y: ROW_Y.SOURCES }, data: { label: "AI/ML", description: "OpenAI, Anthropic", badge: "Usage", icon: Cpu, color: "#14B8A6" }, draggable: false },
    { id: "src-security", type: "source", position: { x: sourceX[4], y: ROW_Y.SOURCES }, data: { label: "Security", description: "Tenable, PagerDuty", badge: "Security", icon: Shield, color: "#14B8A6" }, draggable: false },
    { id: "src-marketplace", type: "source", position: { x: sourceX[5], y: ROW_Y.SOURCES }, data: { label: "Marketplace", description: "Subscriptions", badge: "Direct", icon: Cloud, color: "#14B8A6" }, draggable: false },
    { id: "src-contracts", type: "source", position: { x: sourceX[6], y: ROW_Y.SOURCES }, data: { label: "Contracts", description: "Manual pricing", badge: "Config", icon: FolderOpen, color: "#14B8A6" }, draggable: false },

    // === ROW 2: LAMBDA FUNCTIONS (symmetric) ===
    { id: "lambda-usage", type: "lambda", position: { x: lambdaX[0], y: ROW_Y.LAMBDA }, data: { label: "get-vendor-usage", description: "Collects usage metrics", badge: "EventBridge", color: "#FF9900" }, draggable: false },
    { id: "lambda-resources", type: "lambda", position: { x: lambdaX[1], y: ROW_Y.LAMBDA }, data: { label: "get-vendor-resources", description: "Maps resources", badge: "SQS", color: "#FF9900" }, draggable: false },
    { id: "lambda-invoice", type: "lambda", position: { x: lambdaX[2], y: ROW_Y.LAMBDA }, data: { label: "get-vendor-invoice", description: "Extracts invoices", badge: "Monthly", color: "#FF9900" }, draggable: false },

    // === ROW 3: STORAGE (symmetric) ===
    { id: "s3-raw", type: "storage", position: { x: storageX[0], y: ROW_Y.STORAGE }, data: { label: "S3 Raw Data", description: "Parquet partitioned", badge: "Columnar", icon: FolderOpen, color: "#EF4444" }, draggable: false },
    { id: "glue-tables", type: "storage", position: { x: storageX[1], y: ROW_Y.STORAGE }, data: { label: "Glue Tables", description: "Data catalog", badge: "15+ Tables", icon: TableProperties, color: "#3B82F6" }, draggable: false },

    // === ROW 4: ATHENA VIEWS (symmetric) ===
    { id: "athena-cur", type: "athena", position: { x: athenaX[0], y: ROW_Y.ATHENA }, data: { label: "vendor-cur", description: "Cost allocation", badge: "SQL View", color: "#8B5CF6" }, draggable: false },
    { id: "athena-focus", type: "athena", position: { x: athenaX[1], y: ROW_Y.ATHENA }, data: { label: "vendor-focus-cur", description: "FOCUS v1.2 65 cols", badge: "FOCUS", color: "#8B5CF6" }, draggable: false },
    { id: "athena-more", type: "athena", position: { x: athenaX[2], y: ROW_Y.ATHENA }, data: { label: "+15 more views", description: "One per vendor", badge: "Per Vendor", color: "#8B5CF6" }, draggable: false },

    // === ROW 5: FOCUS OUTPUT (perfectly centered) ===
    { id: "focus-output", type: "focus", position: { x: focusX, y: ROW_Y.FOCUS }, data: { label: "FOCUS v1.2", description: "Unified cost from 15+ vendors via UNION ALL", badge: "210K Resources", metadata: "$11.5M Tracked", color: "#22C55E" }, draggable: false },

    // === ROW 6: CONSUMERS (symmetric) ===
    { id: "consumer-quicksight", type: "consumer", position: { x: consumerX[0], y: ROW_Y.CONSUMERS }, data: { label: "QuickSight", description: "Dashboards", badge: "BI", icon: PieChart, color: "#06B6D4" }, draggable: false },
    { id: "consumer-finops", type: "consumer", position: { x: consumerX[1], y: ROW_Y.CONSUMERS }, data: { label: "FinOps Tools", description: "Optimization", badge: "Analysis", icon: TrendingUp, color: "#06B6D4" }, draggable: false },
  ], []);

  // Edge colors match TARGET nodes
  const EDGE_COLORS = {
    LAMBDA: "#FF9900",    // Lambda nodes are orange
    S3: "#EF4444",        // S3 is red
    GLUE: "#3B82F6",      // Glue is blue
    ATHENA: "#8B5CF6",    // Athena is purple
    FOCUS: "#22C55E",     // FOCUS is green
    CONSUMER: "#06B6D4",  // Consumers are cyan
  };

  const initialEdges: Edge[] = useMemo(() => [
    // === SOURCES → LAMBDA (all edges colored as Lambda orange, animated) ===
    { id: "e-cloud-usage", source: "src-cloud", target: "lambda-usage", sourceHandle: "bottom", targetHandle: "top-left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.LAMBDA), markerEnd: arrow(EDGE_COLORS.LAMBDA), pathOptions: { borderRadius: 20 } },
    { id: "e-monitor-usage", source: "src-monitoring", target: "lambda-usage", sourceHandle: "bottom", targetHandle: "top-right", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.LAMBDA), markerEnd: arrow(EDGE_COLORS.LAMBDA), pathOptions: { borderRadius: 20 } },
    { id: "e-integ-resources", source: "src-integration", target: "lambda-resources", sourceHandle: "bottom", targetHandle: "top-left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.LAMBDA), markerEnd: arrow(EDGE_COLORS.LAMBDA), pathOptions: { borderRadius: 20 } },
    { id: "e-aiml-resources", source: "src-aiml", target: "lambda-resources", sourceHandle: "bottom", targetHandle: "top-right", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.LAMBDA), markerEnd: arrow(EDGE_COLORS.LAMBDA), pathOptions: { borderRadius: 20 } },
    { id: "e-security-invoice", source: "src-security", target: "lambda-invoice", sourceHandle: "bottom", targetHandle: "top-left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.LAMBDA), markerEnd: arrow(EDGE_COLORS.LAMBDA), pathOptions: { borderRadius: 20 } },
    
    // Marketplace → Glue (custom edge: down → right to clear Lambda → down to Glue level → left → down to Glue top-right)
    { id: "e-marketplace-glue", source: "src-marketplace", target: "glue-tables", sourceHandle: "bottom", targetHandle: "right-top", type: "directImport", animated: true, style: edgeStyle(EDGE_COLORS.GLUE, 2, true), markerEnd: arrow(EDGE_COLORS.GLUE), data: { yOffset: 0 } },
    // Contracts → Glue (standard smoothstep: straight down then to Glue bottom-right)
    { id: "e-contracts-glue", source: "src-contracts", target: "glue-tables", sourceHandle: "bottom", targetHandle: "right-bottom", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.GLUE, 2, true), markerEnd: arrow(EDGE_COLORS.GLUE), pathOptions: { borderRadius: 25, offset: 30 } },

    // === LAMBDA → S3 (animated, S3 orange) ===
    { id: "e-usage-s3", source: "lambda-usage", target: "s3-raw", sourceHandle: "bottom", targetHandle: "top-left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.S3, 2.5), markerEnd: arrow(EDGE_COLORS.S3), pathOptions: { borderRadius: 25 } },
    { id: "e-resources-s3", source: "lambda-resources", target: "s3-raw", sourceHandle: "bottom", targetHandle: "top-center", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.S3, 2.5), markerEnd: arrow(EDGE_COLORS.S3), pathOptions: { borderRadius: 25 } },
    { id: "e-invoice-s3", source: "lambda-invoice", target: "s3-raw", sourceHandle: "bottom", targetHandle: "top-right", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.S3, 2.5), markerEnd: arrow(EDGE_COLORS.S3), pathOptions: { borderRadius: 25 } },

    // === S3 → GLUE (horizontal, Glue blue) ===
    { id: "e-s3-glue", source: "s3-raw", target: "glue-tables", sourceHandle: "right", targetHandle: "left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.GLUE, 2.5), markerEnd: arrow(EDGE_COLORS.GLUE), pathOptions: { borderRadius: 15 } },

    // === GLUE → ATHENA (Athena purple) ===
    { id: "e-glue-cur", source: "glue-tables", target: "athena-cur", sourceHandle: "bottom-left", targetHandle: "top", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.ATHENA, 2.5), markerEnd: arrow(EDGE_COLORS.ATHENA), pathOptions: { borderRadius: 30 } },
    { id: "e-glue-focus", source: "glue-tables", target: "athena-focus", sourceHandle: "bottom-center", targetHandle: "top", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.ATHENA, 2.5), markerEnd: arrow(EDGE_COLORS.ATHENA), pathOptions: { borderRadius: 20 } },
    { id: "e-glue-more", source: "glue-tables", target: "athena-more", sourceHandle: "bottom-right", targetHandle: "top", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.ATHENA, 2.5), markerEnd: arrow(EDGE_COLORS.ATHENA), pathOptions: { borderRadius: 30 } },

    // === ATHENA → FOCUS (FOCUS green) ===
    { id: "e-cur-focus", source: "athena-cur", target: "focus-output", sourceHandle: "bottom", targetHandle: "top-left", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.FOCUS, 3), markerEnd: arrow(EDGE_COLORS.FOCUS), pathOptions: { borderRadius: 30 } },
    { id: "e-athena-focus-focus", source: "athena-focus", target: "focus-output", sourceHandle: "bottom", targetHandle: "top-center", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.FOCUS, 3.5), markerEnd: arrow(EDGE_COLORS.FOCUS), pathOptions: { borderRadius: 20 } },
    { id: "e-more-focus", source: "athena-more", target: "focus-output", sourceHandle: "bottom", targetHandle: "top-right", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.FOCUS, 3), markerEnd: arrow(EDGE_COLORS.FOCUS), pathOptions: { borderRadius: 30 } },

    // === FOCUS → CONSUMERS (Consumer cyan) ===
    { id: "e-focus-quicksight", source: "focus-output", target: "consumer-quicksight", sourceHandle: "bottom-left", targetHandle: "top", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.CONSUMER, 2.5), markerEnd: arrow(EDGE_COLORS.CONSUMER), pathOptions: { borderRadius: 25 } },
    { id: "e-focus-finops", source: "focus-output", target: "consumer-finops", sourceHandle: "bottom-right", targetHandle: "top", type: "smoothstep", animated: true, style: edgeStyle(EDGE_COLORS.CONSUMER, 2.5), markerEnd: arrow(EDGE_COLORS.CONSUMER), pathOptions: { borderRadius: 25 } },
  ], []);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <ReactFlowProvider>
      <DataFlowDiagramInner nodes={nodes} edges={edges} className={className} />
    </ReactFlowProvider>
  );
}

// Inner component that can use useReactFlow hook
function DataFlowDiagramInner({ 
  nodes, 
  edges, 
  className 
}: { 
  nodes: Node[]; 
  edges: Edge[]; 
  className?: string;
}) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      // Capture the diagram as PNG
      const dataUrl = await toPng(containerRef.current, {
        backgroundColor: '#0a0a0a', // Match dark theme background
        pixelRatio: 2, // Higher quality
        filter: (node) => {
          // Exclude the control panel buttons from the screenshot
          if (node.classList?.contains('react-flow__panel')) {
            return false;
          }
          return true;
        },
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);

      // Show success feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy diagram:', error);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("w-full h-[1325px] rounded-xl overflow-hidden border border-border/30", className)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: -150, y: -10, zoom: 0.9 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.9}
        maxZoom={1.5}
        defaultEdgeOptions={{ zIndex: -1 }}
        style={{ background: 'transparent' }}
      >
        <Panel position="top-right" className="flex gap-1 m-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/80 border-white/20 hover:bg-white/10"
            onClick={handleCopyToClipboard}
            title="Copy diagram to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-white" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/80 border-white/20 hover:bg-white/10"
            onClick={() => zoomIn()}
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/80 border-white/20 hover:bg-white/10"
            onClick={() => zoomOut()}
          >
            <ZoomOut className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/80 border-white/20 hover:bg-white/10"
            onClick={() => fitView({ padding: 0.1 })}
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </Button>
        </Panel>
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="hsl(var(--muted-foreground) / 0.06)" 
        />
      </ReactFlow>
    </div>
  );
}
