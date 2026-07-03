import { dataSourceDetails } from "@/data/dashboard";

const statusColors = {
  connected: "bg-green-400",
  warning: "bg-yellow-400",
  error: "bg-red-400",
};

export default function DataSourcesTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-bg-el overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-bdr text-fg-m text-[11px] font-body">
              <th scope="col" className="text-left p-3 font-medium">Source</th>
              <th scope="col" className="text-left p-3 font-medium">Type</th>
              <th scope="col" className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
              <th scope="col" className="text-left p-3 font-medium hidden md:table-cell">Records</th>
              <th scope="col" className="text-left p-3 font-medium hidden lg:table-cell">Last Sync</th>
              <th scope="col" className="text-right p-3 font-medium">Uptime</th>
            </tr>
          </thead>
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
        </table>
      </div>
    </div>
  );
}
