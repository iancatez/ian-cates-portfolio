"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataFlowDiagram } from "./data-flow-diagram";
import {
  focusColumns,
  rawVendorData,
  transformationSteps,
  normalizedSampleData,
  type FocusColumn,
} from "@/lib/project-data/focus-schema";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Database, Layers, Code2 } from "lucide-react";

interface DataTransformationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Category color mapping
const categoryColors: Record<FocusColumn["category"], string> = {
  billing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  charge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  commitment: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  cost: "bg-green-500/20 text-green-400 border-green-500/30",
  provider: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  resource: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  service: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  allocation: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export function DataTransformationModal({ open, onOpenChange }: DataTransformationModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedVendor, setSelectedVendor] = useState<number>(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Enterprise Cost Data Pipeline
          </DialogTitle>
          <DialogDescription>
            Multi-vendor cost normalization to FOCUS v1.2 specification with automated cost allocation
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <Layers className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="raw" className="text-xs sm:text-sm">
              <Database className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Raw Data
            </TabsTrigger>
            <TabsTrigger value="transform" className="text-xs sm:text-sm">
              <Code2 className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="schema" className="text-xs sm:text-sm">
              <Check className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Output
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              <DataFlowDiagram activeStep={activeStep} onStepClick={setActiveStep} />
              
              {/* Stats summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
                {[
                  { label: "Vendor Sources", value: "20+", color: "text-orange-400" },
                  { label: "Output Columns", value: "65", color: "text-blue-400" },
                  { label: "Records/Month", value: "~2M", color: "text-green-400" },
                  { label: "Cost Savings", value: "~35%", color: "text-purple-400" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Card className="text-center">
                      <CardContent className="pt-4 pb-3">
                        <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw" className="flex-1 overflow-auto mt-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {rawVendorData.map((vendor, index) => (
                  <Button
                    key={vendor.vendorName}
                    variant={selectedVendor === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVendor(index)}
                    className="text-xs"
                  >
                    {vendor.vendorName}
                  </Button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVendor}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{rawVendorData[selectedVendor].vendorName}</CardTitle>
                      <CardDescription className="text-xs">
                        Raw schema: {rawVendorData[selectedVendor].columns.length} columns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Column badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {rawVendorData[selectedVendor].columns.map((col) => (
                          <Badge key={col} variant="outline" className="text-[10px] font-mono">
                            {col}
                          </Badge>
                        ))}
                      </div>

                      {/* Sample data table */}
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {rawVendorData[selectedVendor].columns.slice(0, 5).map((col) => (
                                <TableHead key={col} className="text-xs font-mono whitespace-nowrap">
                                  {col}
                                </TableHead>
                              ))}
                              {rawVendorData[selectedVendor].columns.length > 5 && (
                                <TableHead className="text-xs">...</TableHead>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rawVendorData[selectedVendor].sampleData.map((row, i) => (
                              <TableRow key={i}>
                                {rawVendorData[selectedVendor].columns.slice(0, 5).map((col) => (
                                  <TableCell key={col} className="text-xs font-mono py-2">
                                    {String(row[col]).length > 20 
                                      ? String(row[col]).slice(0, 20) + "..." 
                                      : String(row[col])}
                                  </TableCell>
                                ))}
                                {rawVendorData[selectedVendor].columns.length > 5 && (
                                  <TableCell className="text-xs text-muted-foreground">...</TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="flex-1 overflow-auto mt-4">
            <div className="space-y-3">
              {transformationSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{step.icon}</span>
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-normal">
                              Step {step.id}
                            </span>
                            {step.title}
                          </CardTitle>
                          <CardDescription className="text-xs">{step.description}</CardDescription>
                        </div>
                        {index < transformationSteps.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <ul className="space-y-1.5">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Output Schema Tab */}
          <TabsContent value="schema" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6">
              {/* Schema columns by category */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">FOCUS v1.2 Schema</CardTitle>
                  <CardDescription className="text-xs">
                    Standardized 65-column output schema across all vendors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border max-h-64 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sticky top-0 bg-background">Column</TableHead>
                          <TableHead className="text-xs sticky top-0 bg-background">Type</TableHead>
                          <TableHead className="text-xs sticky top-0 bg-background">Category</TableHead>
                          <TableHead className="text-xs sticky top-0 bg-background hidden md:table-cell">Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {focusColumns.map((col) => (
                          <TableRow key={col.name}>
                            <TableCell className="text-xs font-mono py-1.5">{col.name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground py-1.5">{col.type}</TableCell>
                            <TableCell className="py-1.5">
                              <Badge 
                                variant="outline" 
                                className={cn("text-[10px] capitalize", categoryColors[col.category])}
                              >
                                {col.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground py-1.5 hidden md:table-cell">
                              {col.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Sample normalized output */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Normalized Output Sample</CardTitle>
                  <CardDescription className="text-xs">
                    Multi-vendor data unified into single queryable format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs whitespace-nowrap">Provider</TableHead>
                          <TableHead className="text-xs whitespace-nowrap">Service</TableHead>
                          <TableHead className="text-xs whitespace-nowrap">Resource</TableHead>
                          <TableHead className="text-xs whitespace-nowrap">Cost</TableHead>
                          <TableHead className="text-xs whitespace-nowrap">Division</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {normalizedSampleData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs py-2 font-medium">{row.ProviderName}</TableCell>
                            <TableCell className="text-xs py-2">{row.ServiceName}</TableCell>
                            <TableCell className="text-xs py-2 font-mono">{row.ResourceName}</TableCell>
                            <TableCell className="text-xs py-2 text-green-400 font-mono">
                              ${row.EffectiveCost.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-xs py-2">
                              <Badge variant="outline" className="text-[10px]">{row.x_Division}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* SQL Query example */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Example Query</CardTitle>
                  <CardDescription className="text-xs">
                    Query all vendors with unified schema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono overflow-x-auto">
{`SELECT 
    x_Division,
    ProviderName,
    SUM(EffectiveCost) as total_cost,
    SUM(x_TaggedCost) as direct_cost,
    SUM(x_OverheadCost) as overhead_cost
FROM unified_cost_view
WHERE BillingPeriodStart >= '2024-01-01'
GROUP BY x_Division, ProviderName
ORDER BY total_cost DESC;`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

