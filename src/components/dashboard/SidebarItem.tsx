import { cn } from "@/lib/cn";
import { SidebarIcons } from "./SidebarIcons";

interface SidebarItemProps {
  id: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  mobileOpen?: boolean;
  onClick: () => void;
}

export function SidebarItem({ id, label, active, collapsed, mobileOpen, onClick }: SidebarItemProps) {
  const isOnlyCollapsed = collapsed && !mobileOpen;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg text-left transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        isOnlyCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
        active ? "bg-accent/[.07] text-accent" : "text-fg-m hover:bg-accent/[.07] hover:text-accent"
      )}
      title={isOnlyCollapsed ? label : undefined}
    >
      {SidebarIcons[id]}
      {!isOnlyCollapsed && label}
    </button>
  );
}
