import { analysisModels } from "@/data/dashboard";
import { TabWrapper } from "./TabWrapper";

const statusColors = {
  active: "text-green-400",
  idle: "text-fg-m",
};

export default function AnalysisTab() {
  const columns = [
    { label: "Model" },
    { label: "Accuracy" },
    { label: "Latency", className: "hidden sm:table-cell" },
    { label: "Queries", className: "hidden md:table-cell" },
    { label: "Status", className: "text-right" },
  ];

  return (
    <TabWrapper columns={columns}>
          <tbody className="font-body">
            {analysisModels.map((model, i) => (
              <tr
                key={i}
                className={`border-b border-bdr/40 hover:bg-bg/30 transition-colors ${i === analysisModels.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="p-3 font-medium">{model.name}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                    <span className="font-display font-semibold">{model.accuracy}%</span>
                  </div>
                </td>
                <td className="p-3 text-fg-m hidden sm:table-cell">{model.latency}</td>
                <td className="p-3 hidden md:table-cell">{model.queries}</td>
                <td className={`p-3 text-right capitalize ${statusColors[model.status]}`}>
                  {model.status}
                </td>
              </tr>
            ))}
      </tbody>
    </TabWrapper>
  );
}
