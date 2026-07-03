export type Stage = {
  id: string;
  index: string;
  title: string;
  body: string;
  tags: string[];
};

export const stages: Stage[] = [
  {
    id: "ingest",
    index: "01",
    title: "Ingest Data",
    body: "Connect any data source — APIs, databases, file uploads, streaming events. Xai normalizes and structures incoming data in real time, regardless of format or volume.",
    tags: ["REST APIs", "SQL / NoSQL", "File Uploads", "Webhooks"],
  },
  {
    id: "analyze",
    index: "02",
    title: "Analyze with AI",
    body: "Multi-model AI pipelines process your data — detecting patterns, anomalies, and correlations that traditional analytics would miss. Every analysis is explainable and auditable.",
    tags: ["Pattern Detection", "Anomaly Scoring", "Correlation Maps"],
  },
  {
    id: "insight",
    index: "03",
    title: "Generate Insight",
    body: "Automated insight generation delivers actionable recommendations, natural language summaries, and trigger-based automations that turn analysis into action.",
    tags: ["NL Summaries", "Auto Actions", "Alert Triggers"],
  },
];
