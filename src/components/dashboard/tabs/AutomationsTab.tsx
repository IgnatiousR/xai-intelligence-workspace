import { automationsList } from "@/data/dashboard";

const statusStyles = {
  active: "bg-green-500/10 text-green-400",
  paused: "bg-yellow-500/10 text-yellow-400",
};

export default function AutomationsTab() {
  return (
    <div className="space-y-2">
      {automationsList.map((automation) => (
        <div
          key={automation.id}
          className="rounded-xl bg-bg-el p-4 hover:bg-bg-el/80 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[13px]">{automation.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${statusStyles[automation.status]}`}>
              {automation.status}
            </span>
          </div>
          <div className="text-[12px] text-fg-m mb-2">
            Trigger: {automation.trigger}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-fg-m">
            <span>Last fired: {automation.lastFired}</span>
            <span>Total fires: {automation.firesTotal}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
