import LineChart from "../charts/LineChart";
import ProgressBar from "../ProgressBar";
import { analysisAccuracy, modelPerformance } from "@/data/dashboard";

export default function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="rounded-xl bg-bg-el p-4">
        <span className="font-display font-semibold text-[13px] block mb-3">
          Analysis Accuracy
        </span>
        <LineChart
          data={[...analysisAccuracy.data]}
          labels={[...analysisAccuracy.labels]}
          min={analysisAccuracy.min}
          max={analysisAccuracy.max}
          height={130}
          formatY={(v) => `${v.toFixed(0)}%`}
        />
      </div>
      <div className="rounded-xl bg-bg-el p-4">
        <span className="font-display font-semibold text-[13px] block mb-3">
          Model Performance
        </span>
        <div className="space-y-3 mt-2">
          {modelPerformance.map((mp) => (
            <ProgressBar
              key={mp.label}
              label={mp.label}
              value={mp.value}
              displayValue={`${mp.value}%`}
              opacity={mp.opacity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
