interface InsightRowProps {
  tone: "critical" | "insight" | "auto";
  title: string;
  meta: string;
}

const dotColors: Record<string, string> = {
  critical: "bg-red-400",
  insight: "bg-accent",
  auto: "bg-blue-400",
};

export default function InsightRow({ tone, title, meta }: InsightRowProps) {
  return (
    <div className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-bg/40 transition-colors cursor-pointer">
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColors[tone]}`}
      />
      <div>
        <div className="text-[11px] font-medium">{title}</div>
        <div className="text-[10px] text-fg-m">{meta}</div>
      </div>
    </div>
  );
}
