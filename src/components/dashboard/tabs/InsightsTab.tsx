import { insightsList } from "@/data/dashboard";

const severityColors = {
  critical: "bg-red-500",
  insight: "bg-accent",
  auto: "bg-blue-400",
  info: "bg-fg-m",
};

const severityBg = {
  critical: "bg-red-500/10 text-red-400",
  insight: "bg-accent/10 text-accent",
  auto: "bg-blue-500/10 text-blue-400",
  info: "bg-fg-m/10 text-fg-m",
};

export default function InsightsTab() {
  return (
    <div className="space-y-2">
      {insightsList.map((insight) => (
        <div
          key={insight.id}
          className="rounded-xl bg-bg-el p-4 hover:bg-bg-el/80 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityColors[insight.severity]}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[13px]">{insight.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${severityBg[insight.severity]}`}
                >
                  {insight.severity}
                </span>
              </div>
              <p className="text-[12px] text-fg-m mb-2">{insight.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-fg-m">
                <span>Source: {insight.source}</span>
                <span>{insight.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
