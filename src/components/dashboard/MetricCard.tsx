interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  tone?: "accent" | "muted";
}

export default function MetricCard({
  label,
  value,
  delta,
  tone = "accent",
}: MetricCardProps) {
  return (
    <div className="rounded-xl bg-bg-el p-3.5 transition-all duration-300 hover:border-accent/25 hover:-translate-y-px border border-transparent">
      <div className="text-fg-m text-[11px] font-body mb-0.5">{label}</div>
      <div className="font-display font-bold text-lg">{value}</div>
      <div
        className={`text-[11px] mt-0.5 ${tone === "accent" ? "text-accent" : "text-fg-m"}`}
      >
        {delta}
      </div>
    </div>
  );
}
