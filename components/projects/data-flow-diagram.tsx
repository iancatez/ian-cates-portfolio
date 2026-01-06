"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Database, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Scale,
  GitMerge,
  Cloud,
  BarChart3,
  Cpu
} from "lucide-react";

interface DataFlowDiagramProps {
  activeStep?: number;
  onStepClick?: (step: number) => void;
}

const vendors = [
  { name: "Cloud Provider A", icon: Cloud, color: "#FF9900" },
  { name: "Monitoring B", icon: BarChart3, color: "#632CA6" },
  { name: "Integration C", icon: GitMerge, color: "#00A2E0" },
  { name: "AI/ML Service D", icon: Cpu, color: "#D97706" },
];

const pipelineStages = [
  { id: 1, name: "Ingest", icon: Database, description: "Raw Data Landing" },
  { id: 2, name: "Map", icon: Layers, description: "Schema Mapping" },
  { id: 3, name: "Enrich", icon: Sparkles, description: "Add Metadata" },
  { id: 4, name: "Redistribute", icon: Scale, description: "Cost Allocation" },
  { id: 5, name: "Unify", icon: GitMerge, description: "UNION ALL" },
];

export function DataFlowDiagram({ activeStep = 0, onStepClick }: DataFlowDiagramProps) {
  return (
    <div className="relative w-full py-8">
      {/* Main flow container */}
      <div className="flex flex-col gap-8">
        {/* Vendor Sources Row */}
        <div className="flex justify-center gap-3 px-4">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${vendor.color}20`, border: `2px solid ${vendor.color}` }}
              >
                <vendor.icon className="w-6 h-6" style={{ color: vendor.color }} />
              </div>
              <span className="text-[10px] text-muted-foreground text-center max-w-16 leading-tight">
                {vendor.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Connecting arrows from vendors */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-primary/50" />
            <ArrowRight className="w-4 h-4 text-primary/50 rotate-90" />
          </motion.div>
        </div>

        {/* Pipeline Stages Row */}
        <div className="flex justify-center items-center gap-2 px-4 overflow-x-auto">
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="flex items-center"
            >
              <button
                onClick={() => onStepClick?.(stage.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                  "hover:bg-primary/10 cursor-pointer",
                  activeStep === stage.id && "bg-primary/20 ring-2 ring-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  activeStep === stage.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-muted text-muted-foreground"
                )}>
                  <stage.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-xs font-medium transition-colors",
                    activeStep === stage.id ? "text-primary" : "text-foreground"
                  )}>
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground max-w-20 leading-tight">
                    {stage.description}
                  </div>
                </div>
              </button>

              {/* Arrow between stages */}
              {index < pipelineStages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Connecting arrow to output */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-green-500/50" />
            <ArrowRight className="w-4 h-4 text-green-500/70 rotate-90" />
          </motion.div>
        </div>

        {/* Unified Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
            
            <div className="relative flex flex-col items-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-primary/10 border-2 border-green-500/30">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Database className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-500">FOCUS v1.2</div>
                <div className="text-xs text-muted-foreground">Unified Cost View</div>
                <div className="text-[10px] text-muted-foreground mt-1">65 Columns • 20+ Vendors</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

