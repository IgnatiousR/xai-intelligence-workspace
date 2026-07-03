import LineChart from "../charts/LineChart";
import ProgressBar from "../ProgressBar";
import InsightRow from "../InsightRow";
import {
  processingVolume,
  dataSources,
  latestInsights,
} from "@/data/dashboard";

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
      <div className="lg:col-span-3 rounded-xl bg-bg-el p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-semibold text-[13px]">
            Processing Volume
          </span>
          <span className="text-fg-m text-[11px]">Last 7 days</span>
        </div>
        <LineChart
          data={[...processingVolume.data]}
          labels={[...processingVolume.labels]}
          min={processingVolume.min}
          max={processingVolume.max}
          height={150}
          formatY={(v) => `${v.toFixed(1)}M`}
        />
      </div>
      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-xl bg-bg-el p-4">
          <span className="font-display font-semibold text-[13px] block mb-3">
            Data Sources
          </span>
          <div className="space-y-2.5">
            {dataSources.map((ds) => (
              <ProgressBar
                key={ds.label}
                label={ds.label}
                value={ds.value}
                displayValue={`${ds.value}%`}
                opacity={ds.opacity}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-bg-el p-4">
          <span className="font-display font-semibold text-[13px] block mb-2.5">
            Latest Insights
          </span>
          <div className="space-y-1">
            {latestInsights.map((insight, i) => (
              <InsightRow key={i} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
