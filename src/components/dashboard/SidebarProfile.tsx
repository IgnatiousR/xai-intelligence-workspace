import { cn } from "@/lib/cn";

interface SidebarProfileProps {
  collapsed: boolean;
  mobileOpen?: boolean;
}

export function SidebarProfile({ collapsed, mobileOpen }: SidebarProfileProps) {
  return (
    <div className="p-2.5 border-t border-bdr">
      <div className={cn("flex items-center gap-2 py-1", collapsed && !mobileOpen ? "justify-center" : "px-1.5")}>
        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
          <span className="text-accent text-[9px] font-bold">JD</span>
        </div>
        {(!collapsed || mobileOpen) && (
          <div>
            <div className="text-[11px] font-medium leading-tight">Jane Doe</div>
            <div className="text-[9px] text-fg-m">Admin</div>
          </div>
        )}
      </div>
    </div>
  );
}
