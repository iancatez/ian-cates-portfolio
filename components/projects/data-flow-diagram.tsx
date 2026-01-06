"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Database, 
  ArrowRight, 
  ArrowDown,
  Layers, 
  Sparkles,
  Scale,
  GitMerge,
  Cloud,
  BarChart3,
  Cpu,
  Download,
  Map,
  Server,
  HardDrive,
  FileJson,
  Users,
  Building2,
  PieChart,
  Table2,
  Workflow
} from "lucide-react";

interface DataFlowDiagramProps {
  className?: string;
}

// Comprehensive architecture diagram showing full data pipeline
export function DataFlowDiagram({ className }: DataFlowDiagramProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Full Architecture Diagram */}
      <div className="space-y-4">
        
        {/* Layer 1: Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 text-center font-medium">
            Data Sources
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {[
              { name: "Cloud Provider", icon: Cloud, color: "#FF9900" },
              { name: "Monitoring", icon: BarChart3, color: "#632CA6" },
              { name: "Integration", icon: Workflow, color: "#00A2E0" },
              { name: "AI/ML", icon: Cpu, color: "#D97706" },
              { name: "+16 more", icon: Server, color: "#6B7280" },
            ].map((source, i) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex flex-col items-center"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center border-2"
                  style={{ borderColor: source.color, backgroundColor: `${source.color}15` }}
                >
                  <source.icon className="w-5 h-5" style={{ color: source.color }} />
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 text-center max-w-12 leading-tight">
                  {source.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Connector */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-6 bg-gradient-to-b from-muted-foreground/30 to-blue-500/50" />
            <ArrowDown className="w-4 h-4 text-blue-500/50" />
          </motion.div>
        </div>

        {/* Layer 2: Ingestion & Landing Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 max-w-md w-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Download className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-blue-400">Ingestion Layer</div>
                  <div className="text-[10px] text-muted-foreground">APIs, S3 Events, Scheduled Jobs</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-blue-400">Landing Zone</div>
                  <div className="text-[10px] text-muted-foreground">S3 / Parquet Format</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connector */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-6 bg-gradient-to-b from-blue-500/50 to-purple-500/50" />
            <ArrowDown className="w-4 h-4 text-purple-500/50" />
          </motion.div>
        </div>

        {/* Layer 3: Transformation Pipeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 max-w-lg w-full">
            <div className="text-[10px] uppercase tracking-wider text-purple-400 mb-2 text-center font-medium">
              ETL Transformation Pipeline
            </div>
            <div className="flex items-center justify-center gap-1">
              {[
                { icon: Map, label: "Schema Map", color: "text-purple-400" },
                { icon: Sparkles, label: "Enrich", color: "text-purple-400" },
                { icon: Scale, label: "Allocate", color: "text-purple-400" },
                { icon: GitMerge, label: "Unify", color: "text-purple-400" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center px-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <step.icon className={cn("w-4 h-4", step.color)} />
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1">{step.label}</span>
                  </div>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-purple-500/30" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Connector */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-6 bg-gradient-to-b from-purple-500/50 to-green-500/50" />
            <ArrowDown className="w-4 h-4 text-green-500/50" />
          </motion.div>
        </div>

        {/* Layer 4: Unified Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-2xl" />
            <div className="relative bg-green-500/10 border-2 border-green-500/40 rounded-xl p-4 max-w-md w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-400">FOCUS v1.2 Unified View</div>
                  <div className="text-[10px] text-muted-foreground">65 Standardized Columns • All Vendors</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1">
                    <FileJson className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400">Athena</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Table2 className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400">Redshift</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connector */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center"
          >
            <div className="w-px h-6 bg-gradient-to-b from-green-500/50 to-cyan-500/50" />
            <ArrowDown className="w-4 h-4 text-cyan-500/50" />
          </motion.div>
        </div>

        {/* Layer 5: Consumers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 text-center font-medium">
            Consumers
          </div>
          <div className="flex justify-center gap-4">
            {[
              { name: "BI Dashboards", icon: PieChart, color: "#06B6D4" },
              { name: "Finance Teams", icon: Building2, color: "#06B6D4" },
              { name: "Cost Anomaly Detection", icon: BarChart3, color: "#06B6D4" },
            ].map((consumer, i) => (
              <motion.div
                key={consumer.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center border-2"
                  style={{ borderColor: consumer.color, backgroundColor: `${consumer.color}15` }}
                >
                  <consumer.icon className="w-5 h-5" style={{ color: consumer.color }} />
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 text-center max-w-16 leading-tight">
                  {consumer.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
