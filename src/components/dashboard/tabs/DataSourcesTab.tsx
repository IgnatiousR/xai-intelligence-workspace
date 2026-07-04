import { dataSourceDetails } from "@/data/dashboard";
import { TabWrapper } from "./TabWrapper";

const statusColors = {
  connected: "bg-green-400",
  warning: "bg-yellow-400",
  error: "bg-red-400",
};

export default function DataSourcesTab() {
  const columns = [
    { label: "Source" },
    { label: "Type" },
    { label: "Status", className: "hidden sm:table-cell" },
    { label: "Records", className: "hidden md:table-cell" },
    { label: "Last Sync", className: "hidden lg:table-cell" },
    { label: "Uptime", className: "text-right" },
  ];

  return (
    <TabWrapper columns={columns}>
          <tbody className="font-body">
            {dataSourceDetails.map((source, i) => (
              <tr
                key={i}
                className={`border-b border-bdr/40 hover:bg-bg/30 transition-colors ${i === dataSourceDetails.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="p-3 font-medium">{source.name}</td>
                <td className="p-3 text-fg-m">{source.type}</td>
                <td className="p-3 hidden sm:table-cell">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColors[source.status]}`} />
                    <span className="capitalize">{source.status}</span>
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell">{source.records}</td>
                <td className="p-3 text-fg-m hidden lg:table-cell">{source.lastSync}</td>
                <td className="p-3 text-right font-medium">{source.uptime}</td>
              </tr>
            ))}
      </tbody>
    </TabWrapper>
  );
}
