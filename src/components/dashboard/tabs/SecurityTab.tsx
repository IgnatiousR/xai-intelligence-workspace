import { securityEvents, securityStats } from "@/data/dashboard";

const typeColors = {
  info: "bg-blue-500",
  warning: "bg-yellow-400",
};

export default function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {securityStats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-bg-el p-3">
            <div className="text-fg-m text-[11px] font-body mb-1">{stat.label}</div>
            <div className="font-display font-bold text-lg">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-bg-el overflow-hidden">
        <div className="p-3 border-b border-bdr">
          <span className="font-display font-semibold text-[13px]">Recent Activity</span>
        </div>
        <div className="divide-y divide-bdr/40">
          {securityEvents.map((event) => (
            <div key={event.id} className="p-3 flex items-center gap-3 hover:bg-bg/30 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeColors[event.type]}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium">{event.event}</div>
                <div className="text-[11px] text-fg-m">by {event.user}</div>
              </div>
              <div className="text-[11px] text-fg-m">{event.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
