export const sidebarItems = [
  { id: "overview", label: "Overview" },
  { id: "sources", label: "Data Sources" },
  { id: "analysis", label: "Analysis" },
  { id: "insights", label: "Insights" },
  { id: "auto", label: "Automations" },
  { id: "security", label: "Security" },
] as const;

export const metrics = [
  { label: "Data Points", value: "2.4M", delta: "+12.4% from yesterday", tone: "accent" as const },
  { label: "AI Analyses", value: "847", delta: "+8.2% from yesterday", tone: "accent" as const },
  { label: "Insights Generated", value: "156", delta: "23 critical", tone: "accent" as const },
  { label: "Automations Run", value: "312", delta: "98.7% success rate", tone: "muted" as const },
];

export const processingVolume = {
  data: [1.8, 2.1, 1.9, 2.4, 2.2, 2.6, 2.4] as const,
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const,
  min: 0,
  max: 3,
};

export const analysisAccuracy = {
  data: [89, 91, 90, 93, 92, 95, 94, 96] as const,
  labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const,
  min: 85,
  max: 100,
};

export const dataSources = [
  { label: "PostgreSQL", value: 42, opacity: 1 },
  { label: "REST API", value: 28, opacity: 0.7 },
  { label: "S3 Files", value: 18, opacity: 0.5 },
  { label: "Webhooks", value: 12, opacity: 0.3 },
] as const;

export const latestInsights = [
  { tone: "critical" as const, title: "Revenue anomaly detected", meta: "2 min ago — Critical" },
  { tone: "insight" as const, title: "New correlation: churn vs support", meta: "18 min ago — Insight" },
  { tone: "auto" as const, title: "Automation triggered: Slack alert", meta: "34 min ago — Auto" },
];

export const modelPerformance = [
  { label: "GPT-4 Pipeline", value: 96.2, opacity: 1 },
  { label: "Claude Pipeline", value: 94.8, opacity: 0.7 },
  { label: "Custom Model v3", value: 91.4, opacity: 0.5 },
] as const;

export const recentEvents = [
  { event: "Anomaly batch #4821", source: "PostgreSQL", type: "Critical", status: "Processed", statusTone: "success" as const, time: "2m" },
  { event: "Correlation #1205", source: "REST API", type: "Insight", status: "Processed", statusTone: "success" as const, time: "18m" },
  { event: "Auto: Slack #alerts", source: "Webhook", type: "Auto", status: "Sent", statusTone: "success" as const, time: "34m" },
  { event: "Ingest: q4_data.csv", source: "S3 Files", type: "Ingest", status: "Running", statusTone: "accent" as const, time: "1h" },
];

export const tabItems = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "recent", label: "Recent" },
] as const;

// Data Sources section data
export const dataSourceDetails = [
  { name: "PostgreSQL", type: "Database", status: "connected" as const, records: "2.4M", lastSync: "2 min ago", uptime: "99.9%" },
  { name: "REST API", type: "API", status: "connected" as const, records: "847K", lastSync: "5 min ago", uptime: "99.7%" },
  { name: "S3 Files", type: "Storage", status: "connected" as const, records: "1.2M", lastSync: "15 min ago", uptime: "100%" },
  { name: "Webhooks", type: "Integration", status: "warning" as const, records: "312K", lastSync: "1h ago", uptime: "98.5%" },
  { name: "Kafka Stream", type: "Streaming", status: "connected" as const, records: "5.8M", lastSync: "Live", uptime: "99.8%" },
];

// Analysis section data
export const analysisModels = [
  { name: "GPT-4 Pipeline", accuracy: 96.2, latency: "42ms", queries: "12.4K", status: "active" as const },
  { name: "Claude Pipeline", accuracy: 94.8, latency: "38ms", queries: "8.7K", status: "active" as const },
  { name: "Custom Model v3", accuracy: 91.4, latency: "55ms", queries: "5.2K", status: "active" as const },
  { name: "BERT-Large", accuracy: 89.1, latency: "28ms", queries: "3.1K", status: "idle" as const },
];

// Insights section data
export const insightsList = [
  { id: 1, title: "Revenue anomaly detected in Q4 data", severity: "critical" as const, source: "PostgreSQL", time: "2 min ago", description: "Unusual 23% drop in revenue metrics detected across all regions." },
  { id: 2, title: "Customer churn correlation found", severity: "insight" as const, source: "REST API", time: "18 min ago", description: "Strong correlation (-0.87) between support response time and churn rate." },
  { id: 3, title: "New pattern: support volume spike", severity: "insight" as const, source: "Kafka Stream", time: "1h ago", description: "Support ticket volume increases 340% on Tuesdays after product updates." },
  { id: 4, title: "Automation triggered: Slack alert", severity: "auto" as const, source: "Webhooks", time: "34 min ago", description: "Critical threshold exceeded, alert sent to #engineering channel." },
  { id: 5, title: "Model retraining recommended", severity: "info" as const, source: "Analysis", time: "2h ago", description: "Accuracy drift detected in Custom Model v3 over last 7 days." },
];

// Automations section data
export const automationsList = [
  { id: 1, name: "Critical Alert → Slack", trigger: "Severity = Critical", status: "active" as const, lastFired: "2 min ago", firesTotal: 47 },
  { id: 2, name: "Daily Summary Report", trigger: "Schedule: 9am daily", status: "active" as const, lastFired: "14h ago", firesTotal: 365 },
  { id: 3, name: "Anomaly → Jira Ticket", trigger: "Anomaly score > 90", status: "active" as const, lastFired: "1h ago", firesTotal: 128 },
  { id: 4, name: "Data Quality Check", trigger: "Every 6 hours", status: "paused" as const, lastFired: "3 days ago", firesTotal: 892 },
  { id: 5, name: "Model Performance Alert", trigger: "Accuracy < 90%", status: "active" as const, lastFired: "5h ago", firesTotal: 23 },
];

// Security section data
export const securityEvents = [
  { id: 1, event: "API key rotated", user: "Jane Doe", time: "1h ago", type: "info" as const },
  { id: 2, event: "Failed login attempt", user: "Unknown", time: "3h ago", type: "warning" as const },
  { id: 3, event: "Permission updated", user: "Admin", time: "1d ago", type: "info" as const },
  { id: 4, event: "Data export initiated", user: "Jane Doe", time: "2d ago", type: "info" as const },
];

export const securityStats = [
  { label: "Active Sessions", value: "3" },
  { label: "API Keys", value: "2" },
  { label: "Failed Logins (24h)", value: "1" },
  { label: "Last Audit", value: "2d ago" },
];
