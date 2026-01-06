/**
 * FOCUS v1.2 Unified Schema Mock Data
 * This represents the standardized output schema for multi-vendor cost data normalization.
 * Generic vendor names are used to avoid proprietary information.
 */

export interface FocusColumn {
  name: string;
  type: string;
  category: "billing" | "charge" | "commitment" | "cost" | "provider" | "resource" | "service" | "allocation";
  description: string;
}

export interface RawVendorData {
  vendorName: string;
  columns: string[];
  sampleData: Record<string, string | number>[];
}

export interface TransformationStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

// FOCUS v1.2 Standard Columns (simplified for demo)
export const focusColumns: FocusColumn[] = [
  // Billing Information
  { name: "BillingAccountId", type: "VARCHAR", category: "billing", description: "Unique identifier for the billing account" },
  { name: "BillingAccountName", type: "VARCHAR", category: "billing", description: "Display name of the billing account" },
  { name: "BillingCurrency", type: "VARCHAR", category: "billing", description: "Currency code for billing (e.g., USD)" },
  { name: "BillingPeriodStart", type: "TIMESTAMP", category: "billing", description: "Start of the billing period" },
  { name: "BillingPeriodEnd", type: "TIMESTAMP", category: "billing", description: "End of the billing period" },
  
  // Charge Details
  { name: "ChargeCategory", type: "VARCHAR", category: "charge", description: "Category: Usage, Purchase, Tax, Credit, Adjustment" },
  { name: "ChargeDescription", type: "VARCHAR", category: "charge", description: "Human-readable description of the charge" },
  { name: "ChargeFrequency", type: "VARCHAR", category: "charge", description: "Recurrence: Usage-Based, Recurring, One-Time" },
  { name: "ChargePeriodStart", type: "TIMESTAMP", category: "charge", description: "Start of the charge period" },
  { name: "ChargePeriodEnd", type: "TIMESTAMP", category: "charge", description: "End of the charge period" },
  
  // Cost Fields
  { name: "BilledCost", type: "DECIMAL", category: "cost", description: "Amount billed to the customer" },
  { name: "EffectiveCost", type: "DECIMAL", category: "cost", description: "Actual cost after adjustments" },
  { name: "ListCost", type: "DECIMAL", category: "cost", description: "Cost at list/public pricing" },
  { name: "ContractedCost", type: "DECIMAL", category: "cost", description: "Cost based on negotiated rates" },
  
  // Provider Information
  { name: "ProviderName", type: "VARCHAR", category: "provider", description: "Cloud/service provider name" },
  { name: "PublisherName", type: "VARCHAR", category: "provider", description: "Vendor/publisher name" },
  { name: "InvoiceIssuerName", type: "VARCHAR", category: "provider", description: "Name of the invoice issuer" },
  
  // Resource Information
  { name: "ResourceId", type: "VARCHAR", category: "resource", description: "Unique identifier for the resource" },
  { name: "ResourceName", type: "VARCHAR", category: "resource", description: "Display name of the resource" },
  { name: "ResourceType", type: "VARCHAR", category: "resource", description: "Type of resource" },
  { name: "RegionId", type: "VARCHAR", category: "resource", description: "Region identifier" },
  { name: "RegionName", type: "VARCHAR", category: "resource", description: "Region display name" },
  
  // Service Information
  { name: "ServiceCategory", type: "VARCHAR", category: "service", description: "High-level service category" },
  { name: "ServiceName", type: "VARCHAR", category: "service", description: "Name of the service" },
  { name: "SkuId", type: "VARCHAR", category: "service", description: "Stock keeping unit identifier" },
  
  // Cost Allocation (Extended)
  { name: "x_Division", type: "VARCHAR", category: "allocation", description: "Organizational division for allocation" },
  { name: "x_TaggedCost", type: "DECIMAL", category: "allocation", description: "Direct cost to valid divisions" },
  { name: "x_OverheadCost", type: "DECIMAL", category: "allocation", description: "Redistributed unknown costs" },
];

// Mock raw vendor data - different schemas for each vendor
export const rawVendorData: RawVendorData[] = [
  {
    vendorName: "Cloud Provider A",
    columns: ["account_id", "usage_date", "product_code", "usage_type", "usage_amount", "cost", "resource_arn"],
    sampleData: [
      { account_id: "123456789012", usage_date: "2024-01-15", product_code: "AmazonEC2", usage_type: "BoxUsage:t3.medium", usage_amount: 24, cost: 12.48, resource_arn: "arn:aws:ec2:us-east-1:123456789012:instance/i-abc123" },
      { account_id: "123456789012", usage_date: "2024-01-15", product_code: "AmazonS3", usage_type: "TimedStorage-ByteHrs", usage_amount: 1073741824, cost: 0.023, resource_arn: "arn:aws:s3:::my-bucket" },
    ],
  },
  {
    vendorName: "Monitoring Service B",
    columns: ["org_id", "billing_month", "product_name", "sku", "quantity", "unit_price", "total_charge"],
    sampleData: [
      { org_id: "org-xyz-789", billing_month: "2024-01", product_name: "Infrastructure Monitoring", sku: "HOST-PRO", quantity: 50, unit_price: 15.00, total_charge: 750.00 },
      { org_id: "org-xyz-789", billing_month: "2024-01", product_name: "Log Management", sku: "LOGS-500GB", quantity: 500, unit_price: 1.20, total_charge: 600.00 },
    ],
  },
  {
    vendorName: "Integration Platform C",
    columns: ["tenant_id", "period_start", "period_end", "service_tier", "resource_name", "work_units", "amount_usd"],
    sampleData: [
      { tenant_id: "TENANT-001", period_start: "2024-01-01", period_end: "2024-01-31", service_tier: "Enterprise", resource_name: "Prod-Snaplex-01", work_units: 150000, amount_usd: 4500.00 },
      { tenant_id: "TENANT-001", period_start: "2024-01-01", period_end: "2024-01-31", service_tier: "Enterprise", resource_name: "Dev-Snaplex-01", work_units: 25000, amount_usd: 750.00 },
    ],
  },
  {
    vendorName: "AI/ML Service D",
    columns: ["customer_id", "invoice_date", "model_name", "input_tokens", "output_tokens", "total_cost_usd"],
    sampleData: [
      { customer_id: "CUST-2024-001", invoice_date: "2024-01-31", model_name: "claude-3-opus", input_tokens: 1250000, output_tokens: 450000, total_cost_usd: 87.50 },
      { customer_id: "CUST-2024-001", invoice_date: "2024-01-31", model_name: "claude-3-sonnet", input_tokens: 5000000, output_tokens: 1200000, total_cost_usd: 42.00 },
    ],
  },
];

// Transformation pipeline steps
export const transformationSteps: TransformationStep[] = [
  {
    id: 1,
    title: "Data Ingestion",
    description: "Collect raw cost and usage data from 20+ vendor APIs and file exports",
    icon: "📥",
    details: [
      "Scheduled API pulls from vendor billing systems",
      "S3 event-driven ingestion for file-based exports",
      "Schema detection and validation",
      "Raw data stored in landing zone (Parquet format)",
    ],
  },
  {
    id: 2,
    title: "Schema Mapping",
    description: "Map vendor-specific columns to FOCUS v1.2 standard schema",
    icon: "🗺️",
    details: [
      "Vendor-specific transformation rules in SQL/dbt",
      "Column name normalization (e.g., cost → EffectiveCost)",
      "Data type casting and validation",
      "Handle NULL values and defaults",
    ],
  },
  {
    id: 3,
    title: "Data Enrichment",
    description: "Enhance records with organizational metadata and cost allocation tags",
    icon: "✨",
    details: [
      "Join with division/team mapping tables",
      "Apply cost center and GL code assignments",
      "Tag-based cost allocation weights",
      "Calculate derived metrics",
    ],
  },
  {
    id: 4,
    title: "Cost Redistribution",
    description: "Redistribute shared and untagged costs to valid business divisions",
    icon: "⚖️",
    details: [
      "Identify 'unknown' and 'corporate' tagged costs",
      "Calculate proportional weights by division",
      "Redistribute as x_OverheadCost and x_CorpCost",
      "Maintain audit trail with x_TaggedCost",
    ],
  },
  {
    id: 5,
    title: "Schema Unification",
    description: "UNION ALL vendor views into single queryable dataset",
    icon: "🔗",
    details: [
      "All vendors output identical 65-column schema",
      "UNION ALL creates unified cost view",
      "Partition by date for query performance",
      "Incremental refresh with deduplication",
    ],
  },
];

// Final normalized sample data (FOCUS v1.2 format)
export const normalizedSampleData = [
  {
    BillingAccountId: "ORG-MAIN-001",
    BillingAccountName: "Enterprise Account",
    BillingCurrency: "USD",
    BillingPeriodStart: "2024-01-01",
    BillingPeriodEnd: "2024-02-01",
    ChargeCategory: "Usage",
    ProviderName: "Cloud Provider A",
    ServiceCategory: "Compute",
    ServiceName: "Virtual Machines",
    ResourceName: "prod-web-server-01",
    EffectiveCost: 12.48,
    x_Division: "Engineering",
    x_TaggedCost: 12.48,
  },
  {
    BillingAccountId: "ORG-MAIN-001",
    BillingAccountName: "Enterprise Account",
    BillingCurrency: "USD",
    BillingPeriodStart: "2024-01-01",
    BillingPeriodEnd: "2024-02-01",
    ChargeCategory: "Usage",
    ProviderName: "Monitoring Service B",
    ServiceCategory: "Management and Governance",
    ServiceName: "Infrastructure Monitoring",
    ResourceName: "HOST-PRO",
    EffectiveCost: 750.00,
    x_Division: "Platform",
    x_TaggedCost: 650.00,
    x_OverheadCost: 100.00,
  },
  {
    BillingAccountId: "ORG-MAIN-001",
    BillingAccountName: "Enterprise Account",
    BillingCurrency: "USD",
    BillingPeriodStart: "2024-01-01",
    BillingPeriodEnd: "2024-02-01",
    ChargeCategory: "Usage",
    ProviderName: "Integration Platform C",
    ServiceCategory: "Integration",
    ServiceName: "Data Integration",
    ResourceName: "Prod-Snaplex-01",
    EffectiveCost: 4500.00,
    x_Division: "Data Engineering",
    x_TaggedCost: 4500.00,
  },
  {
    BillingAccountId: "ORG-MAIN-001",
    BillingAccountName: "Enterprise Account",
    BillingCurrency: "USD",
    BillingPeriodStart: "2024-01-01",
    BillingPeriodEnd: "2024-02-01",
    ChargeCategory: "Usage",
    ProviderName: "AI/ML Service D",
    ServiceCategory: "AI and Machine Learning",
    ServiceName: "Language Models",
    ResourceName: "claude-3-opus",
    EffectiveCost: 87.50,
    x_Division: "Product",
    x_TaggedCost: 70.00,
    x_OverheadCost: 17.50,
  },
];

// Service categories used across vendors
export const serviceCategories = [
  "AI and Machine Learning",
  "Analytics",
  "API Management",
  "Compute",
  "Databases",
  "Developer Tools",
  "Integration",
  "Management and Governance",
  "Media",
  "Networking",
  "Security",
  "Storage",
];

