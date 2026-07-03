interface TableRow {
  event: string;
  source: string;
  type: string;
  status: string;
  statusTone: "success" | "accent";
  time: string;
}

const typeColors: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-400",
  Insight: "bg-accent/10 text-accent",
  Auto: "bg-blue-500/10 text-blue-400",
  Ingest: "bg-fg-m/10 text-fg-m",
};

const dotColors: Record<string, string> = {
  success: "bg-green-400",
  accent: "bg-accent",
};

interface DataTableProps {
  rows: TableRow[];
}

export default function DataTable({ rows }: DataTableProps) {
  return (
    <div className="rounded-xl bg-bg-el overflow-hidden">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-bdr text-fg-m text-[11px] font-body">
            <th scope="col" className="text-left p-2.5 font-medium">Event</th>
            <th scope="col" className="text-left p-2.5 font-medium hidden sm:table-cell">
              Source
            </th>
            <th scope="col" className="text-left p-2.5 font-medium">Type</th>
            <th scope="col" className="text-left p-2.5 font-medium hidden md:table-cell">
              Status
            </th>
            <th scope="col" className="text-right p-2.5 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="font-body">
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-bdr/40 hover:bg-bg/30 transition-colors ${i === rows.length - 1 ? "border-b-0" : ""}`}
            >
              <td className="p-2.5">{row.event}</td>
              <td className="p-2.5 text-fg-m hidden sm:table-cell">
                {row.source}
              </td>
              <td className="p-2.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${typeColors[row.type] || "bg-fg-m/10 text-fg-m"}`}
                >
                  {row.type}
                </span>
              </td>
              <td className="p-2.5 hidden md:table-cell">
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${dotColors[row.statusTone]}`}
                />
                {row.status}
              </td>
              <td className="p-2.5 text-right text-fg-m">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
